using CommonModule.Shared.Enums;
using CommonModule.Shared.Enums.Users;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace JobPathfinder.IntegrationTests.Mediatr.Profile;

[TestFixture]
public class UserProfileByIdRequestHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldAggregateSkillsLanguagesAndItems()
    {
        // Arrange: create a test user
        var testUser = await CreateTestUser(UserRoleEnum.User);

        // add one skill
        await Options.AddUserSkills(TestApplicationFactory, testUser, new Dictionary<int,int> {{ 5, 1 }});
        // add one language
        await Options.AddUserLanguages(TestApplicationFactory, testUser, new Dictionary<int,int> {{ 7, 1 }});
        // add one profile item
        await Options.AddUserProfileItems(TestApplicationFactory, testUser, new Dictionary<UserProfileItemEnum, Dictionary<int, int>>{
            { UserProfileItemEnum.Experience , new Dictionary<int,int> {{ 1, 1 }}}});

        // Act: send UserProfileByIdRequest
        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        var response = await mediator.Send(new UserProfileByIdRequest
        {
            Id = testUser.User.Id
        });

        // Assert: verify aggregated lists
        response.Skills.Should().HaveCount(1);
        response.Skills.First().Id.Should().Be(testUser.UserSkills[0].Id);

        response.Languages.Should().HaveCount(1);
        response.Languages.First().Id.Should().Be(testUser.UserLanguages[0].Id);

        response.Items.Should().HaveCount(1);
        response.Items.First().Id.Should().Be(testUser.UserProfileItems[0].Id);
    }

    [Test]
    public async Task Handle_ShouldReturnEmptyLists_WhenNoDataExists()
    {
        // Arrange: create a test user with no skills, languages or items
        var testUser = await CreateTestUser(UserRoleEnum.User);

        // Act
        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        var response = await mediator.Send(new UserProfileByIdRequest
        {
            Id = testUser.User.Id
        });

        // Assert: all collections are empty
        response.Skills.Should().BeEmpty();
        response.Languages.Should().BeEmpty();
        response.Items.Should().BeEmpty();
    }
}
