using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Enums.Users;
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
public class CreateUserProfileItemCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldCreateUserProfileItem_WhenUserAuthenticated()
    {
        // Arrange: create & sign in a test user
        var testUser = await CreateTestUser();
        var command = new CreateUserProfileItemCommand
        {
            ProfileItemType = UserProfileItemEnum.Experience,
            Position = "Senior Developer",
            Company = "Acme Corp",
            Location = "Remote",
            StartDate = DateTime.UtcNow.Date,
            EndDate = DateTime.UtcNow.Date.AddMonths(6),
            CountryId = 1,
            JobTypeId = 2,
            WorkArrangementId = 3
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        BaseEntityIdResponse<Guid> response = await mediator.Send(command);

        // Assert: verify record in ProfileDataContext
        response.Id.Should().NotBeEmpty();

        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        var item = await context.UserProfileItems
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == response.Id);

        item.Should().NotBeNull();
        item!.UserId.Should().Be(testUser.User.Id);
        item.ProfileItemType.Should().Be(command.ProfileItemType);
        item.Position.Should().Be(command.Position);
        item.Company.Should().Be(command.Company);
        item.Location.Should().Be(command.Location);
        item.StartDate.Should().Be(command.StartDate);
        item.EndDate.Should().Be(command.EndDate);
        item.CountryId.Should().Be(command.CountryId);
        item.JobTypeId.Should().Be(command.JobTypeId);
        item.WorkArrangementId.Should().Be(command.WorkArrangementId);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        await SignOutUserIfExist();
        var command = new CreateUserProfileItemCommand
        {
            ProfileItemType = UserProfileItemEnum.Experience,
            Position = "X",
            Company = "X",
            Location = "X",
            StartDate = DateTime.UtcNow.Date,
            CountryId = 0,
            JobTypeId = 0,
            WorkArrangementId = 0
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<CreateUserProfileItemCommand, BaseEntityIdResponse<Guid>, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }
}
