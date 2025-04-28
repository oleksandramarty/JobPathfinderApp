using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Interfaces;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.AuthGateway.Users;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using JobPathfinder.IntegrationTests.Shared;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace JobPathfinder.IntegrationTests.Mediatr.Auth;

[TestFixture]
public class CurrentUserRequestHandlerTest(): CommonIntegrationTestSetup()
{
    [Test, TestCaseSource(nameof(CreateAllRolesTestCases))]
    public async Task Handle_ShouldReturnTokenResponse_WhenAuthSignInRequestIsValid(UserRoleEnum role)
    {
        // Arrange
        await SignOutUserIfExist();
        IntegrationTestUserEntity userToBeSignIn = await CreateTestUser(role);
        
        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            IJwtTokenFactory jwtTokenFactory = scope.ServiceProvider.GetRequiredService<IJwtTokenFactory>();
            bool beforeSignIn = await IsCurrentUserAuthenticated();
            
            IMediator mediator = new Mediator(scope.ServiceProvider);
            UserResponse response = await mediator.Send(new CurrentUserRequest());
            
            bool afterSignIn = await IsCurrentUserAuthenticated();
            
            // Assert
            beforeSignIn.Should().BeTrue();
            afterSignIn.Should().BeTrue();
            response.Should().NotBeNull();
            response.Id.Should().Be(userToBeSignIn.User.Id);
            response.Login.Should().Be(userToBeSignIn.User.Login);
            response.Email.Should().Be(userToBeSignIn.User.Email);
            response.Status.Should().Be(userToBeSignIn.User.Status);
            response.Roles.Should().NotBeNull();
            response.Roles.Should().NotBeEmpty();
            response.Roles.Should().HaveCount(1);
            response.Roles.First().Id.Should().Be((int)userToBeSignIn.Role);
        }
    }
}