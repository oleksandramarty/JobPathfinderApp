using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Profile.Domain;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace JobPathfinder.IntegrationTests.Mediatr.Profile;

[TestFixture]
public class CreateUserSkillCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldCreateUserSkill_WhenUserAuthenticated()
    {
        // Arrange: create & sign in a test user
        var testUser = await CreateTestUser(UserRoleEnum.User);
        var command = new CreateUserSkillCommand
        {
            SkillId      = 100,
            SkillLevelId = 4
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act: send the create-skill command
        BaseEntityIdResponse<Guid> response = await mediator.Send(command);

        // Assert: verify record in ProfileDataContext.UserSkills
        response.Id.Should().NotBeEmpty();

        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        var entity = await context.UserSkills
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == response.Id);

        entity.Should().NotBeNull();
        entity!.UserId.Should().Be(testUser.User.Id);
        entity.SkillId.Should().Be(command.SkillId);
        entity.SkillLevelId.Should().Be(command.SkillLevelId);
        entity.Status.Should().Be(StatusEnum.Active);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create a user but do not sign in
        _ = CreateTestUser(UserRoleEnum.User, false);
        var command = new CreateUserSkillCommand
        {
            SkillId      = 1,
            SkillLevelId = 1
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<CreateUserSkillCommand, BaseEntityIdResponse<Guid>, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }
}
