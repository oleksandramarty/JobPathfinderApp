using AuthGateway.Domain;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using JobPathfinder.IntegrationTests.Shared;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace JobPathfinder.IntegrationTests.Mediatr.Auth;

[TestFixture]
public class UpdateUserPreferencesCommandHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldUpdateUserAndExistingSettings()
    {
        // Arrange: create and sign in a test user (settings exist by default)
        IntegrationTestUserEntity testUser = await CreateTestUser(UserRoleEnum.User);
        var command = new UpdateUserPreferencesCommand
        {
            FirstName = "John",
            LastName = "Doe",
            Login = "newlogin",
            Phone = "+1 123-456-7890",
            Headline = "Dev",
            DefaultLocale = "fr",
            CountryId = 39,
            ApplicationAiPrompt = true,
            CurrencyId = 1,
            TimeZone = 0,
            LinkedInUrl = "https://linkedin.com/in/johndoe",
            NpmUrl = "https://npmjs.com/~johndoe",
            GitHubUrl = "https://github.com/johndoe",
            ShowCurrentPosition = true,
            ShowHighestEducation = true
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        // Act
        BaseBoolResponse response = await mediator.Send(command);

        // Assert: response indicates success, and DB was updated
        response.Success.Should().BeTrue();

        var context = scope.ServiceProvider.GetRequiredService<AuthGatewayDataContext>();
        var user = await context.Users
            .Include(u => u.UserSetting)
            .SingleAsync(u => u.Id == testUser.User.Id);

        // verify user fields
        user.FirstName.Should().Be(command.FirstName);
        user.LastName.Should().Be(command.LastName);
        user.Login.Should().Be(command.Login);
        user.LoginNormalized.Should().Be(command.Login.ToUpper());
        user.Phone.Should().Be(command.Phone.FormatUserPhone());
        user.Headline.Should().Be(command.Headline);

        // verify existing settings updated
        var settings = user.UserSetting!;
        settings.DefaultLocale.Should().Be(command.DefaultLocale);
        settings.CountryId.Should().Be(command.CountryId);
        settings.ApplicationAiPrompt.Should().Be(command.ApplicationAiPrompt);
        settings.CurrencyId.Should().Be(command.CurrencyId);
        settings.TimeZone.Should().Be(command.TimeZone);
        settings.LinkedInUrl.Should().Be(command.LinkedInUrl);
        settings.NpmUrl.Should().Be(command.NpmUrl);
        settings.GitHubUrl.Should().Be(command.GitHubUrl);
        settings.ShowCurrentPosition.Should().Be(command.ShowCurrentPosition);
        settings.ShowHighestEducation.Should().Be(command.ShowHighestEducation);
    }

    [Test]
    public async Task Handle_ShouldCreateSettings_WhenNoExistingSettings()
    {
        // Arrange: create and sign in a user, but remove its initial settings
        IntegrationTestUserEntity testUser = await CreateTestUser(
            UserRoleEnum.User,
            true,
            [
                user => user.UserSetting = null
            ]);

        var command = new UpdateUserPreferencesCommand
        {
            FirstName = "Alice",
            LastName = "Smith",
            Login = "alice123",
            Phone = null,
            Headline = null,
            DefaultLocale = "uk",
            CountryId = 232,
            ApplicationAiPrompt = false,
            CurrencyId = 2,
            TimeZone = 0,
            LinkedInUrl = null,
            NpmUrl = null,
            GitHubUrl = null,
            ShowCurrentPosition = false,
            ShowHighestEducation = false
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        // Act
        BaseBoolResponse response = await mediator.Send(command);

        // Assert: settings were created
        response.Success.Should().BeTrue();

        var context = scope.ServiceProvider.GetRequiredService<AuthGatewayDataContext>();
        var user = await context.Users
            .Include(u => u.UserSetting)
            .SingleAsync(u => u.Id == testUser.User.Id);

        user.UserSetting.Should().NotBeNull();
        var settings = user.UserSetting!;
        settings.DefaultLocale.Should().Be(command.DefaultLocale);
        settings.CountryId.Should().Be(command.CountryId);
        settings.ApplicationAiPrompt.Should().Be(command.ApplicationAiPrompt);
        settings.CurrencyId.Should().Be(command.CurrencyId);
        settings.TimeZone.Should().Be(command.TimeZone);
        settings.ShowCurrentPosition.Should().Be(command.ShowCurrentPosition);
        settings.ShowHighestEducation.Should().Be(command.ShowHighestEducation);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenNotAuthenticated()
    {
        // Arrange: create user but do not sign in
        await CreateTestUser(UserRoleEnum.User, false);
        var command = new UpdateUserPreferencesCommand
        {
            Login = "irrelevant"
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserPreferencesCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserDeleted()
    {
        // Arrange: sign in user then remove from DB
        IntegrationTestUserEntity testUser = await CreateTestUser(UserRoleEnum.User);
        using (var cleanupScope = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = cleanupScope.ServiceProvider.GetRequiredService<AuthGatewayDataContext>();
            ctx.UserRoles.RemoveRange(ctx.UserRoles.Where(ur => ur.UserId == testUser.User.Id));
            ctx.UserSettings.RemoveRange(ctx.UserSettings.Where(us => us.UserId == testUser.User.Id));
            ctx.Users.Remove(ctx.Users.Find(testUser.User.Id)!);
            ctx.SaveChanges();
        }

        var command = new UpdateUserPreferencesCommand { Login = "x" };

        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UpdateUserPreferencesCommand, BaseBoolResponse, EntityNotFoundException>(
            mediator,
            command,
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowBusinessException_WhenLoginAlreadyExists()
    {
        // Arrange: two users in DB; second tries to take first’s login
        IntegrationTestUserEntity user1 = await CreateTestUser(UserRoleEnum.User);
        IntegrationTestUserEntity user2 = await CreateTestUser(UserRoleEnum.User);
        var command = new UpdateUserPreferencesCommand
        {
            Login = user1.User.Login
        };

        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        // Act & Assert: duplicate login => BusinessException
        await TestUtilities.Handle_InvalidCommand<UpdateUserPreferencesCommand, BaseBoolResponse, Exception>(
            mediator,
            command,
            ErrorMessages.EntityWithLoginAlreadyExists);
    }
}
