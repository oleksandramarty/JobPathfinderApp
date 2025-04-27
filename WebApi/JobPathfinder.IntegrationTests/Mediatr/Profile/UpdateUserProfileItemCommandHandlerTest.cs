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
public class UpdateUserProfileItemCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldUpdateUserProfileItem_WhenUserOwnsEntity()
    {
        // Arrange: create & sign in a test user, add one profile item
        var testUser = await CreateTestUser(UserRoleEnum.User);
        var itemsToAdd = new Dictionary<UserProfileItemEnum, Dictionary<int,int>>
        {
            { UserProfileItemEnum.Experience, new Dictionary<int,int> {{ 1, 1 }} }
        };
        await Options.AddUserProfileItems(TestApplicationFactory, testUser, itemsToAdd);
        var existing = testUser.UserProfileItems.First();

        // prepare update command with new values
        var command = new UpdateUserProfileItemCommand
        {
            Id = existing.Id,
            ProfileItemType = UserProfileItemEnum.Experience,
            Position = "Lead Developer",
            Company = "Contoso Ltd",
            Location = "Toronto",
            StartDate = existing.StartDate.AddYears(-1),
            EndDate = existing.EndDate?.AddYears(1),
            CountryId = existing.CountryId + 1,
            JobTypeId = existing.JobTypeId + 1,
            WorkArrangementId = existing.WorkArrangementId + 1
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        BaseBoolResponse response = await mediator.Send(command);

        // Assert: success and DB reflects updated fields
        response.Success.Should().BeTrue();

        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        var updated = await context.UserProfileItems
            .AsNoTracking()
            .SingleAsync(x => x.Id == existing.Id);

        updated.Position.Should().Be(command.Position);
        updated.Company.Should().Be(command.Company);
        updated.Location.Should().Be(command.Location);
        updated.StartDate.Should().Be(command.StartDate);
        updated.EndDate.Should().Be(command.EndDate);
        updated.CountryId.Should().Be(command.CountryId);
        updated.JobTypeId.Should().Be(command.JobTypeId);
        updated.WorkArrangementId.Should().Be(command.WorkArrangementId);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user but do NOT sign in, insert a profile item manually
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

        var command = new UpdateUserProfileItemCommand
        {
            Id = newItem.Id,
            ProfileItemType = newItem.ProfileItemType,
            Position = "X",
            Company = "X",
            Location = "X",
            StartDate = newItem.StartDate,
            CountryId = newItem.CountryId,
            JobTypeId = newItem.JobTypeId,
            WorkArrangementId = newItem.WorkArrangementId
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserProfileItemCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange: authenticated user but random Id
        await CreateTestUser(UserRoleEnum.User);
        var command = new UpdateUserProfileItemCommand
        {
            Id = Guid.NewGuid(),
            ProfileItemType = UserProfileItemEnum.Education,
            Position = "X",
            Company = "X",
            Location = "X",
            StartDate = DateTime.UtcNow,
            CountryId = 0,
            JobTypeId = 0,
            WorkArrangementId = 0
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserProfileItemCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 with a profile item
        var user1 = await CreateTestUser(UserRoleEnum.User);
        var itemsToAdd = new Dictionary<UserProfileItemEnum, Dictionary<int,int>>
        {
            { UserProfileItemEnum.Project, new Dictionary<int,int> {{ 2, 1 }} }
        };
        await Options.AddUserProfileItems(TestApplicationFactory, user1, itemsToAdd);
        var itemId = user1.UserProfileItems.First().Id;

        // sign in as user2
        await CreateTestUser(UserRoleEnum.User);

        var command = new UpdateUserProfileItemCommand
        {
            Id = itemId,
            ProfileItemType = UserProfileItemEnum.Project,
            Position = "X",
            Company = "X",
            Location = "X",
            StartDate = DateTime.UtcNow,
            CountryId = 0,
            JobTypeId = 0,
            WorkArrangementId = 0
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserProfileItemCommand, BaseBoolResponse, ForbiddenException>(
            mediator,
            command,
            ErrorMessages.Forbidden
        );
    }
}
