using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Enums.Users;
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
public class UserProfileItemByIdRequestHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldReturnUserProfileItemResponse_WhenUserOwnsEntity()
    {
        // Arrange: create & authenticate a test user, add a profile item
        var testUser = await CreateTestUser();
        var itemsToAdd = new Dictionary<UserProfileItemEnum, Dictionary<int,int>>
        {
            { UserProfileItemEnum.Experience, new Dictionary<int,int> {{ 1, 1 }} }
        };
        await Options.AddUserProfileItems(TestApplicationFactory, testUser, itemsToAdd);
        var entity = testUser.UserProfileItems.First();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act: send the query
        UserProfileItemResponse response = await mediator.Send(new UserProfileItemByIdRequest
        {
            Id = entity.Id
        });

        // Assert: mapping is correct
        response.Should().NotBeNull();
        response.Id.Should().Be(entity.Id);
        response.UserId.Should().Be(testUser.User.Id);
        response.ProfileItemType.Should().Be(entity.ProfileItemType);
        response.Position.Should().Be(entity.Position);
        response.Company.Should().Be(entity.Company);
        response.Location.Should().Be(entity.Location);
        response.StartDate.Should().Be(entity.StartDate);
        response.EndDate.Should().Be(entity.EndDate);
        response.CountryId.Should().Be(entity.CountryId);
        response.JobTypeId.Should().Be(entity.JobTypeId);
        response.WorkArrangementId.Should().Be(entity.WorkArrangementId);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user but do not sign in, insert a profile item manually
        var user = await CreateTestUser(UserRoleEnum.User, true, false);
        var manual = new UserProfileItemEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.User.Id,
            Status = CommonModule.Shared.Enums.StatusEnum.New,
            ProfileItemType = UserProfileItemEnum.Education,
            Position = "Test",
            Company = "Test",
            Location = "Test",
            StartDate = DateTime.UtcNow,
            CountryId = 1,
            JobTypeId = 1,
            WorkArrangementId = 1
        };
        using (var init = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = init.ServiceProvider.GetRequiredService<ProfileDataContext>();
            ctx.UserProfileItems.Add(manual);
            ctx.SaveChanges();
        }

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserProfileItemByIdRequest, UserProfileItemResponse, EntityNotFoundException>(
            mediator,
            new UserProfileItemByIdRequest { Id = manual.Id },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange: authenticated user but random Id
        await CreateTestUser();
        var fakeId = Guid.NewGuid();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserProfileItemByIdRequest, UserProfileItemResponse, EntityNotFoundException>(
            mediator,
            new UserProfileItemByIdRequest { Id =fakeId },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 adds a profile item
        var user1 = await CreateTestUser();
        var itemsToAdd = new Dictionary<UserProfileItemEnum, Dictionary<int,int>>
        {
            { UserProfileItemEnum.Project, new Dictionary<int,int> {{ 2, 1 }} }
        };
        await Options.AddUserProfileItems(TestApplicationFactory, user1, itemsToAdd);
        var itemId = user1.UserProfileItems.First().Id;

        // Authenticate as user2
        await CreateTestUser();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserProfileItemByIdRequest, UserProfileItemResponse, ForbiddenException>(
            mediator,
            new UserProfileItemByIdRequest { Id = itemId },
            ErrorMessages.Forbidden
        );
    }
}
