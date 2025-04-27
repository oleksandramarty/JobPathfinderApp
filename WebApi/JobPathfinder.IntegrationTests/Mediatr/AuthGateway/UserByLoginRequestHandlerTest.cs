using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.AuthGateway.Users;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using JobPathfinder.IntegrationTests.Shared;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace JobPathfinder.IntegrationTests.Mediatr.AuthGateway;

[TestFixture]
public class UserByLoginRequestHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldReturnUserResponse_WhenLoginExists()
    {
        // Arrange: create a test user and persist it
        IntegrationTestUserEntity testUser = await CreateTestUser(UserRoleEnum.User);

        // Act: send UserByLoginRequest with the existing login
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);
        UserResponse response = await mediator.Send(new UserByLoginRequest
        {
            Login = testUser.User.Login
        });

        // Assert: verify that the response maps user fields correctly
        response.Should().NotBeNull();
        response.Id.Should().Be(testUser.User.Id);
        response.Login.Should().Be(testUser.User.Login);
        response.Email.Should().Be(testUser.User.Email);
    }

    [TestCase(null)]
    [TestCase("")]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenLoginIsNullOrEmpty(string login)
    {
        // Arrange & Act: send request with null or empty login
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserByLoginRequest, UserResponse, EntityNotFoundException>(
            mediator,
            new UserByLoginRequest { Login = login },
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotFound()
    {
        // Arrange: pick a login that does not exist
        string nonexistentLogin = Guid.NewGuid().ToString();

        // Act
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserByLoginRequest, UserResponse, EntityNotFoundException>(
            mediator,
            new UserByLoginRequest { Login = nonexistentLogin },
            ErrorMessages.EntityNotFound
        );
    }
}
