using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Profile.Profile;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace JobPathfinder.IntegrationTests.Mediatr.Profile;

[TestFixture]
public class UserSkillByIdRequestHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldReturnUserSkillResponse_WhenUserOwnsEntity()
    {
        // Arrange: authenticate a test user and add a skill
        var testUser = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserSkills(TestApplicationFactory, testUser, new Dictionary<int,int> { { 15, 3 } });
        var created = testUser.UserSkills.First();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        UserSkillResponse response = await mediator.Send(new UserSkillByIdRequest
        {
            Id = created.Id
        });

        // Assert: the response should reflect the entity
        response.Should().NotBeNull();
        response.Id.Should().Be(created.Id);
        response.UserId.Should().Be(testUser.User.Id);
        response.SkillId.Should().Be(created.SkillId);
        response.SkillLevelId.Should().Be(created.SkillLevelId);
        response.Status.Should().Be(created.Status);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create a user but do not sign in, insert a skill manually
        var user = CreateTestUser(UserRoleEnum.User, false).Result;
        var manual = new UserSkillEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.User.Id,
            SkillId = 20,
            SkillLevelId = 2,
            Status = StatusEnum.New,
            CreatedAt = DateTime.UtcNow
        };
        using (var init = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = init.ServiceProvider.GetRequiredService<ProfileDataContext>();
            ctx.UserSkills.Add(manual);
            ctx.SaveChanges();
        }

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserSkillByIdRequest, UserSkillResponse, EntityNotFoundException>(
            mediator,
            new UserSkillByIdRequest { Id = manual.Id },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange: authenticated user but random Id
        await CreateTestUser(UserRoleEnum.User);
        var randomId = Guid.NewGuid();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserSkillByIdRequest, UserSkillResponse, EntityNotFoundException>(
            mediator,
            new UserSkillByIdRequest { Id = randomId },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 adds a skill
        var user1 = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserSkills(TestApplicationFactory, user1, new Dictionary<int,int> { { 25, 1 } });
        var skillId = user1.UserSkills.First().Id;

        // Authenticate as user2
        await CreateTestUser(UserRoleEnum.User);

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserSkillByIdRequest, UserSkillResponse, EntityNotFoundException>(
            mediator,
            new UserSkillByIdRequest { Id = skillId },
            ErrorMessages.EntityNotFound
        );
    }
}
