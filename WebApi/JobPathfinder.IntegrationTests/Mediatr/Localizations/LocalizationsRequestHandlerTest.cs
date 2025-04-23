using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Localizations;
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
public class LocalizationsRequestHandlerTest(): CommonIntegrationTestSetup()
{
    private static IEnumerable<TestCaseData> CreateLocalizationsTestCases()
    {
        foreach (UserRoleEnum role in Enum.GetValues(typeof(UserRoleEnum)))
        {
            yield return new TestCaseData(role, false).SetName($"{role} role with isPublic false");
            yield return new TestCaseData(role, true).SetName($"{role} role with isPublic true");
        }
    }
    
    [Test, TestCaseSource(nameof(CreateLocalizationsTestCases))]
    public async Task Handle_ShouldReturnLocalizations_WhenLocalizationRequestIsValid(UserRoleEnum role, bool isPublic)
    {
        // Arrange
        await SignOutUserIfExist();
        IntegrationTestUserEntity userToBeSignIn = await CreateTestUser(role);
        
        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            LocalizationsDataContext localizationsDataContext = scope.ServiceProvider.GetRequiredService<LocalizationsDataContext>();
            bool beforeSignIn = await IsCurrentUserAuthenticated();
            
            IMediator mediator = new Mediator(scope.ServiceProvider);
            LocalizationsResponse response = await mediator.Send(new LocalizationsRequest
            {
                IsPublic = isPublic
            });
            
            bool afterSignIn = await IsCurrentUserAuthenticated();
            
            // Assert
            beforeSignIn.Should().BeTrue();
            afterSignIn.Should().BeTrue();
            response.Should().NotBeNull();
            response.Version.Should().NotBeNullOrEmpty();
            response.Data.Should().NotBeNullOrEmpty();
            response.Data.Should().HaveCount(await localizationsDataContext.Locales.CountAsync());
            int count = await localizationsDataContext.Localizations.CountAsync(x =>
                x.LocaleId == 1 && x.IsPublic == isPublic);
            response.Data.Should().OnlyContain(data => data.Items.Count == count);
        }
    }
    
    [Test]
    public async Task Handle_ShouldReturnPublicLocalizations_WhenLocalizationRequestIsValid()
    {
        // Arrange
        await SignOutUserIfExist();
        
        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            LocalizationsDataContext localizationsDataContext = scope.ServiceProvider.GetRequiredService<LocalizationsDataContext>();
            bool beforeSignIn = await IsCurrentUserAuthenticated();
            
            IMediator mediator = new Mediator(scope.ServiceProvider);
            LocalizationsResponse response = await mediator.Send(new LocalizationsRequest
            {
                IsPublic = true
            });
            
            bool afterSignIn = await IsCurrentUserAuthenticated();
            
            // Assert
            beforeSignIn.Should().BeFalse();
            afterSignIn.Should().BeFalse();
            response.Should().NotBeNull();
            response.Version.Should().NotBeNullOrEmpty();
            response.Data.Should().NotBeNullOrEmpty();
            response.Data.Should().HaveCount(await localizationsDataContext.Locales.CountAsync());
            int count = await localizationsDataContext.Localizations.CountAsync(x =>
                x.LocaleId == 1 && x.IsPublic == true);
            response.Data.Should().OnlyContain(data => data.Items.Count == count);
        }
    }
}