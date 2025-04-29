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
public class DeleteUserLanguageCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldDeleteUserLanguage_WhenUserOwnsEntity()
    {
        // Arrange: create & sign in a test user and add one language
        var testUser = await CreateTestUser();
        await Options.AddUserLanguages(TestApplicationFactory, testUser, new Dictionary<int, int> { { 10, 2 } });
        var toDelete = testUser.UserLanguages.First();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act: send delete command
        BaseBoolResponse response = await mediator.Send(new DeleteUserLanguageCommand
        {
            Id = toDelete.Id
        });

        // Assert: verify success and removal from DB
        response.Success.Should().BeTrue();

        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        var exists = await context.UserLanguages.AnyAsync(x => x.Id == toDelete.Id);
        exists.Should().BeFalse();
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user without signing in and add a language directly in DB
        var user = await CreateTestUser(UserRoleEnum.User, true, false);
        // add one language
        await Options.AddUserLanguages(TestApplicationFactory, user, new Dictionary<int,int> {{ 7, 1 }});

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<DeleteUserLanguageCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            new DeleteUserLanguageCommand { Id = user.UserLanguages.First().Id },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityNotFound()
    {
        // Arrange: authenticated user but no such language in DB
        await CreateTestUser();
        var fakeId = Guid.NewGuid();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<DeleteUserLanguageCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            new DeleteUserLanguageCommand { Id = fakeId },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 with a language, user2 authenticated
        var user1 = await CreateTestUser();
        await Options.AddUserLanguages(TestApplicationFactory, user1, new Dictionary<int, int> { { 20, 3 } });
        var langId = user1.UserLanguages.First().Id;

        // create & sign in as user2
        var user2 = await CreateTestUser();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert: deleting another’s entity => ForbiddenException
        await TestUtilities.Handle_InvalidCommand<DeleteUserLanguageCommand, BaseBoolResponse, ForbiddenException>(
            mediator,
            new DeleteUserLanguageCommand { Id = langId },
            ErrorMessages.Forbidden  // ForbiddenException has no custom message
        );
    }
}
