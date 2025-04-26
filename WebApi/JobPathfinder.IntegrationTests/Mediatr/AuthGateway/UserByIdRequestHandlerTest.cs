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
public class UserByIdRequestHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldReturnUserResponse_WhenUserExists()
    {
        // Arrange: create a test user with the "User" role and persist it
        IntegrationTestUserEntity testUser = await CreateTestUser(UserRoleEnum.User);

        // Act: send the query
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        UserResponse response = await mediator.Send(new UserByIdRequest
        {
            Id = testUser.User.Id
        });

        // Assert: verify the mapped fields
        response.Should().NotBeNull();
        response.Id.Should().Be(testUser.User.Id);   // actual.Should().Be(expected)
        response.Login.Should().Be(testUser.User.Login);
        response.Email.Should().Be(testUser.User.Email);
        response.Status.Should().Be(testUser.User.Status);
        response.Roles.Should().NotBeEmpty();
        response.Roles.First().Id.Should().Be(testUser.User.Roles.First().RoleId);
    }

    [Test]
    public void Handle_ShouldThrowEntityNotFoundException_WhenUserDoesNotExist()
    {
        // Arrange: pick a random GUID that is not in the DB
        Guid nonExistentId = Guid.NewGuid();

        // Act & Assert: expect EntityNotFoundException
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        Assert.ThrowsAsync<EntityNotFoundException>(async () =>
        await mediator.Send(new UserByIdRequest { Id = nonExistentId }));
    }

    [Test, TestCaseSource(nameof(CreateAllRolesWithInvalidRolesTestCases))]
    public async Task Handle_ShouldThrowBusinessException_WhenUserHasInvalidStatus(
    UserRoleEnum role,
    StatusEnum invalidStatus,
    string expectedErrorMessage)
    {
        // Arrange: create a user with an invalid status
        IntegrationTestUserEntity testUser = await CreateTestUser(role,
            false,
            [
            user => user.Status = invalidStatus
        ]);

        // Act & Assert: expect a BusinessException with the correct message
        using var scope = TestApplicationFactory.Services.CreateScope();
        IMediator mediator = new Mediator(scope.ServiceProvider);

        await TestUtilities.Handle_InvalidCommand<UserByIdRequest, UserResponse, BusinessException>(
        mediator,
        new UserByIdRequest { Id = testUser.User.Id },
        expectedErrorMessage);
    }
}