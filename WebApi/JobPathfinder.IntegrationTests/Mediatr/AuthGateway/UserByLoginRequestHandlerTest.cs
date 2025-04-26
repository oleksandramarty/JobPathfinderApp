using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core.Exceptions;
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
    public void Handle_ShouldThrowEntityNotFoundException_WhenLoginIsNullOrEmpty(string login)
    {
        // Arrange & Act: send request with null or empty login
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        // Assert: expect EntityNotFoundException for invalid login input
        Func<Task> act = () => mediator.Send(new UserByLoginRequest { Login = login });
        act.Should().ThrowAsync<EntityNotFoundException>();
    }

    [Test]
    public void Handle_ShouldThrowEntityNotFoundException_WhenUserNotFound()
    {
        // Arrange: pick a login that does not exist
        string nonexistentLogin = Guid.NewGuid().ToString();

        // Act
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        // Assert: expect EntityNotFoundException for missing user
        Func<Task> act = () => mediator.Send(new UserByLoginRequest { Login = nonexistentLogin });
        act.Should().ThrowAsync<EntityNotFoundException>();
    }
}
