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
public class UpdateUserSkillCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldUpdateUserSkill_WhenUserOwnsEntity()
    {
        // Arrange: create & sign in a test user, add one skill
        var testUser = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserSkills(TestApplicationFactory, testUser, new Dictionary<int,int> { { 7, 2 } });
        var existing = testUser.UserSkills.First();

        // prepare update command to change skill and level
        var command = new UpdateUserSkillCommand
        {
            Id = existing.Id,
            SkillId = 7,     // same skill
            SkillLevelId = 4      // change level from 2 → 4
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        BaseBoolResponse response = await mediator.Send(command);

        // Assert: success and DB updated
        response.Success.Should().BeTrue();

        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        var updated = await context.UserSkills
            .AsNoTracking()
            .SingleAsync(x => x.Id == existing.Id);

        updated.SkillLevelId.Should().Be(command.SkillLevelId);
        updated.SkillId.Should().Be(command.SkillId);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user without signing in, insert a skill manually
        var user = CreateTestUser(UserRoleEnum.User, false).Result;
        var newSkill = new UserSkillEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.User.Id,
            SkillId = 9,
            SkillLevelId = 1,
            Status = StatusEnum.New,
            CreatedAt = DateTime.UtcNow
        };
        using (var initScope = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = initScope.ServiceProvider.GetRequiredService<ProfileDataContext>();
            ctx.UserSkills.Add(newSkill);
            ctx.SaveChanges();
        }

        var command = new UpdateUserSkillCommand
        {
            Id = newSkill.Id,
            SkillId = newSkill.SkillId,
            SkillLevelId = 3
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserSkillCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityNotFound()
    {
        // Arrange: authenticated user but random skill Id
        await CreateTestUser(UserRoleEnum.User);
        var command = new UpdateUserSkillCommand
        {
            Id = Guid.NewGuid(),
            SkillId = 1,
            SkillLevelId = 1
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserSkillCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 with a skill
        var user1 = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserSkills(TestApplicationFactory, user1, new Dictionary<int,int> { { 15, 2 } });
        var skillId = user1.UserSkills.First().Id;

        // sign in as user2
        await CreateTestUser(UserRoleEnum.User);

        var command = new UpdateUserSkillCommand
        {
            Id = skillId,
            SkillId = 15,
            SkillLevelId = 5
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserSkillCommand, BaseBoolResponse, ForbiddenException>(
            mediator,
            command,
            ErrorMessages.Forbidden  // ForbiddenException has no custom message
        );
    }
}
