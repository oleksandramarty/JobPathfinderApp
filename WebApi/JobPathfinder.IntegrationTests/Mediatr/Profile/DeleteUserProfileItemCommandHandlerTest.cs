using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Enums.Users;
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
public class DeleteUserProfileItemCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldDeleteProfileItem_WhenUserOwnsEntity()
    {
        // Arrange: create & sign in user1, add one profile item
        var user1 = await CreateTestUser(UserRoleEnum.User);
        var itemsToAdd = new Dictionary<UserProfileItemEnum, Dictionary<int, int>>
        {
            { UserProfileItemEnum.Experience, new Dictionary<int,int> {{ 1, 1 }} }
        };
        await Options.AddUserProfileItems(TestApplicationFactory, user1, itemsToAdd);
        var toDelete = user1.UserProfileItems.First();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        BaseBoolResponse response = await mediator.Send(new DeleteUserProfileItemCommand
        {
            Id = toDelete.Id
        });

        // Assert
        response.Success.Should().BeTrue();
        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        (await context.UserProfileItems.AnyAsync(x => x.Id == toDelete.Id)).Should().BeFalse();
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user but do NOT sign in, manually insert a profile item
        var user = CreateTestUser(UserRoleEnum.User, false).Result;
        var newItem = new UserProfileItemEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.User.Id,
            Status = StatusEnum.New,
            ProfileItemType = UserProfileItemEnum.Education,
            Position = "Test",
            Company = "Test",
            Location = "Test",
            StartDate = DateTime.UtcNow,
            CountryId = 1,
            JobTypeId = 1,
            WorkArrangementId = 1
        };
        using (var initScope = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = initScope.ServiceProvider.GetRequiredService<ProfileDataContext>();
            ctx.UserProfileItems.Add(newItem);
            ctx.SaveChanges();
        }

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<DeleteUserProfileItemCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            new DeleteUserProfileItemCommand { Id = newItem.Id },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange: authenticated user but random Id
        await CreateTestUser(UserRoleEnum.User);
        var fakeId = Guid.NewGuid();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<DeleteUserProfileItemCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            new DeleteUserProfileItemCommand { Id = fakeId },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 with an item
        var user1 = await CreateTestUser(UserRoleEnum.User);
        var itemsToAdd = new Dictionary<UserProfileItemEnum, Dictionary<int, int>>
        {
            { UserProfileItemEnum.Project, new Dictionary<int,int> {{ 2, 1 }} }
        };
        await Options.AddUserProfileItems(TestApplicationFactory, user1, itemsToAdd);
        var itemId = user1.UserProfileItems.First().Id;

        // Switch to user2
        await CreateTestUser(UserRoleEnum.User);

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<DeleteUserProfileItemCommand, BaseBoolResponse, ForbiddenException>(
            mediator,
            new DeleteUserProfileItemCommand { Id = itemId },
            ErrorMessages.Forbidden  // ForbiddenException has no custom message
        );
    }
}
