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
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace JobPathfinder.IntegrationTests.Mediatr.Profile;

[TestFixture]
public class DeleteUserSkillCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldDeleteUserSkill_WhenUserOwnsEntity()
    {
        // Arrange: create & sign in a test user, add two skills
        var testUser = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserSkills(TestApplicationFactory, testUser, new Dictionary<int,int> { { 7, 1 } });
        var skillToDelete = testUser.UserSkills.First();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act: send delete command
        BaseBoolResponse response = await mediator.Send(new DeleteUserSkillCommand
        {
            Id = skillToDelete.Id
        });

        // Assert: verify success and that the skill is removed
        response.Success.Should().BeTrue();
        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        (await context.UserSkills.AnyAsync(x => x.Id == skillToDelete.Id)).Should().BeFalse();
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user without signing in, manually insert a skill
        var user = CreateTestUser(UserRoleEnum.User, false).Result;
        var newSkill = new UserSkillEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.User.Id,
            SkillId = 99,
            SkillLevelId = 2,
            Status = StatusEnum.New,
            CreatedAt = DateTime.UtcNow
        };
        using (var initScope = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = initScope.ServiceProvider.GetRequiredService<ProfileDataContext>();
            ctx.UserSkills.Add(newSkill);
            ctx.SaveChanges();
        }

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<DeleteUserSkillCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            new DeleteUserSkillCommand { Id = newSkill.Id },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityNotFound()
    {
        // Arrange: authenticated user but random skill Id
        await CreateTestUser(UserRoleEnum.User);
        var fakeId = Guid.NewGuid();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<DeleteUserSkillCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            new DeleteUserSkillCommand { Id = fakeId },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 with a skill
        var user1 = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserSkills(TestApplicationFactory, user1, new Dictionary<int,int> { { 42, 1 } });
        var skillId = user1.UserSkills.First().Id;

        // create & sign in as user2
        await CreateTestUser(UserRoleEnum.User);

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert: deleting another’s skill ⇒ ForbiddenException
        await TestUtilities.Handle_InvalidCommand<DeleteUserSkillCommand, BaseBoolResponse, ForbiddenException>(
            mediator,
            new DeleteUserSkillCommand { Id = skillId },
            ErrorMessages.Forbidden
        );
    }
}
