using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Enums.Users;
using CommonModule.Shared.Responses.Profile.Profile;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace JobPathfinder.IntegrationTests.Mediatr.Profile;

[TestFixture]
public class UserProfileRequestHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create a user but do NOT sign in
        _ = await CreateTestUser(UserRoleEnum.User, true, false);

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserProfileRequest, UserProfileResponse, EntityNotFoundException>(
            mediator,
            new UserProfileRequest(),
            ErrorMessages.EntityNotFound
        );
    }

    [Test]
    public async Task Handle_ShouldReturnAggregatedProfile_ForAuthenticatedUser()
    {
        // Arrange: create & sign in a test user
        var testUser = await CreateTestUser(UserRoleEnum.User, true);

        // add one skill
        await Options.AddUserSkills(TestApplicationFactory, testUser,
            new Dictionary<int,int> {{ 1, 1 }});
        // add one language
        await Options.AddUserLanguages(TestApplicationFactory, testUser,
            new Dictionary<int,int> {{ 3, 1 }});
        // add one profile item
        await Options.AddUserProfileItems(TestApplicationFactory, testUser,
            new Dictionary<UserProfileItemEnum, Dictionary<int,int>>
            {
                { UserProfileItemEnum.Experience, new Dictionary<int,int> {{ 5, 1 }} }
            });

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        var response = await mediator.Send(new UserProfileRequest());

        // Assert: verify that each list contains exactly one element with correct Id
        response.Skills.Should().HaveCount(1);
        response.Skills.Single().Id.Should().Be(testUser.UserSkills.Single().Id);

        response.Languages.Should().HaveCount(1);
        response.Languages.Single().Id.Should().Be(testUser.UserLanguages.Single().Id);

        response.Items.Should().HaveCount(1);
        response.Items.Single().Id.Should().Be(testUser.UserProfileItems.Single().Id);
    }

    [Test]
    public async Task Handle_ShouldReturnEmptyLists_WhenNoProfileData()
    {
        // Arrange: create & sign in user with no skills, languages, or items
        _ = await CreateTestUser();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act
        var response = await mediator.Send(new UserProfileRequest());

        // Assert: all returned collections should be empty
        response.Skills.Should().BeEmpty();
        response.Languages.Should().BeEmpty();
        response.Items.Should().BeEmpty();
    }
}
