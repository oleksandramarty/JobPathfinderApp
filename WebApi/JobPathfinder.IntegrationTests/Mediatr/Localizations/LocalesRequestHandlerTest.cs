using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Localizations.Models.Locales;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using JobPathfinder.IntegrationTests.Shared;
using Localizations.Domain;
using Localizations.Mediatr.Mediatr.Localizations.Requests;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace JobPathfinder.IntegrationTests.Mediatr.Localizations;

[TestFixture]
public class LocalesRequestHandlerTest(): CommonIntegrationTestSetup()
{
    [Test, TestCaseSource(nameof(CreateAllRolesTestCases))]
    public async Task Handle_ShouldReturnLocales_WhenLocalesRequestIsValid(UserRoleEnum role)
    {
        // Arrange
        IntegrationTestUserEntity userToBeSignIn = await CreateTestUser(role);
        
        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            LocalizationsDataContext localizationsDataContext = scope.ServiceProvider.GetRequiredService<LocalizationsDataContext>();
            bool beforeSignIn = await IsCurrentUserAuthenticated();
            
            IMediator mediator = new Mediator(scope.ServiceProvider);
            VersionedListResponse<LocaleResponse> response = await mediator.Send(new LocalesRequest());
            
            bool afterSignIn = await IsCurrentUserAuthenticated();
            
            // Assert
            beforeSignIn.Should().BeTrue();
            afterSignIn.Should().BeTrue();
            response.Should().NotBeNull();
            response.Version.Should().NotBeNullOrEmpty();
            response.Items.Should().NotBeNullOrEmpty();
            response.Items.Should().HaveCount(await localizationsDataContext.Locales.CountAsync());
        }
    }
}