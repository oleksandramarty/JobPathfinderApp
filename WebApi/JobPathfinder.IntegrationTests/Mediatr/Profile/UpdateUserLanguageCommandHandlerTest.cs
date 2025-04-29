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
public class UpdateUserLanguageCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldUpdateUserLanguage_WhenUserOwnsEntity()
    {
        // Arrange: create & sign in a test user, add one language
        var testUser = await CreateTestUser();
        await Options.AddUserLanguages(TestApplicationFactory, testUser, new Dictionary<int,int> { { 5, 2 } });
        var existing = testUser.UserLanguages.First();
        
        var command = new UpdateUserLanguageCommand
        {
            Id = existing.Id,
            LanguageId = 5,
            LanguageLevelId = 4  // change level from 2 → 4
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        BaseBoolResponse response = await mediator.Send(command);

        // Assert: success and DB updated
        response.Success.Should().BeTrue();

        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        var updated = await context.UserLanguages
            .AsNoTracking()
            .SingleAsync(x => x.Id == existing.Id);

        updated.LanguageLevelId.Should().Be(command.LanguageLevelId);
        updated.LanguageId.Should().Be(command.LanguageId);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user but do NOT sign in, add a language manually
        var user = await CreateTestUser(UserRoleEnum.User, true, false);
        var newLang = new UserLanguageEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.User.Id,
            LanguageId = 7,
            LanguageLevelId = 1,
            Status = StatusEnum.New,
            CreatedAt = DateTime.UtcNow
        };
        using (var initScope = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = initScope.ServiceProvider.GetRequiredService<ProfileDataContext>();
            ctx.UserLanguages.Add(newLang);
            ctx.SaveChanges();
        }

        var command = new UpdateUserLanguageCommand
        {
            Id = newLang.Id,
            LanguageId = 7,
            LanguageLevelId = 3
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserLanguageCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityNotFound()
    {
        // Arrange: authenticated user but random Id
        await CreateTestUser();
        var command = new UpdateUserLanguageCommand
        {
            Id = Guid.NewGuid(),
            LanguageId = 1,
            LanguageLevelId = 1
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserLanguageCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 with a language
        var user1 = await CreateTestUser();
        await Options.AddUserLanguages(TestApplicationFactory, user1, new Dictionary<int,int> { { 9, 2 } });
        var langId = user1.UserLanguages.First().Id;

        // sign in as user2
        await CreateTestUser();

        var command = new UpdateUserLanguageCommand
        {
            Id = langId,
            LanguageId = 9,
            LanguageLevelId = 5
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserLanguageCommand, BaseBoolResponse, ForbiddenException>(
            mediator,
            command,
            ErrorMessages.Forbidden  // ForbiddenException has no specific message
        );
    }
}
