using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core.Exceptions;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.AuthGateway;
using CommonModule.Shared.Responses.Base;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using JobPathfinder.IntegrationTests.Shared;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace JobPathfinder.IntegrationTests.Mediatr.AuthGateway;

[TestFixture]
public class AuthSignOutRequestHandlerTest() : CommonIntegrationTestSetup()
{
    [Test, TestCaseSource(nameof(CreateAllRolesTestCases))]
    public async Task Handle_ShouldReturnTrue_WhenAuthSignOutRequestIsValid(UserRoleEnum role)
    {
        // Arrange
        await SignOutUserIfExist();
        await CreateTestUser(role);

        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            bool beforeSignIn = await IsCurrentUserAuthenticated();

            IMediator mediator = new Mediator(scope.ServiceProvider);
            BaseBoolResponse response = await mediator.Send(new AuthSignOutRequest());

            bool afterSignIn = await IsCurrentUserAuthenticated();

            // Assert
            beforeSignIn.Should().BeTrue();
            afterSignIn.Should().BeFalse();
            response.Should().NotBeNull();
            response.Success.Should().BeTrue();
        }
    }

    [Test, TestCaseSource(nameof(CreateAllRolesWithInvalidRolesTestCases))]
    public async Task Handle_ShouldReturnException_WhenAuthSignOutRequestWithBlockedUser(UserRoleEnum role, StatusEnum status, string errorMessage)
    {
        // Arrange
        await SignOutUserIfExist();
        IntegrationTestUserEntity userToBeSignIn = await CreateTestUser(
            role,
            true,
            [
                user => user.Status = status
            ]
        );

        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            bool beforeSignIn = await IsCurrentUserAuthenticated();

            beforeSignIn.Should().BeTrue();
            IMediator mediator = new Mediator(scope.ServiceProvider);

            await TestUtilities.Handle_InvalidCommand<AuthSignInRequest, JwtTokenResponse, BusinessException>(
                mediator,
                new AuthSignInRequest
                {
                    Login = userToBeSignIn.User.Login,
                    Password = userToBeSignIn.User.Login,
                    RememberMe = true
                },
                errorMessage);
        }
    }
}