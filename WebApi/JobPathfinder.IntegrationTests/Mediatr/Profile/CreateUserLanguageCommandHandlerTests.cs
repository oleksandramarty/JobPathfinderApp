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
public class CreateUserLanguageCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldCreateUserLanguage_WhenUserAuthenticated()
    {
        // Arrange: создать и аутентифицировать пользователя
        var testUser = await CreateTestUser();
        var command = new CreateUserLanguageCommand
        {
            LanguageId = 42,
            LanguageLevelId = 3
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act: отправляем команду
        BaseEntityIdResponse<Guid> response = await mediator.Send(command);

        // Assert: проверяем, что в ProfileDataContext появилась нужная запись
        response.Id.Should().NotBeEmpty();

        var context = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        var entity = await context.UserLanguages
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == response.Id);

        entity.Should().NotBeNull();
        entity!.UserId.Should().Be(testUser.User.Id);
        entity.LanguageId.Should().Be(command.LanguageId);
        entity.LanguageLevelId.Should().Be(command.LanguageLevelId);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        await SignOutUserIfExist();
        var command = new CreateUserLanguageCommand
        {
            LanguageId = 1,
            LanguageLevelId = 1
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<CreateUserLanguageCommand, BaseEntityIdResponse<Guid>, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }
}
