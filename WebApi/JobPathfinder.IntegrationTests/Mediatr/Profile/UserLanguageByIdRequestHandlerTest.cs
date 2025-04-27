using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonModule.Core.Exceptions;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Profile.Profile;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Core;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace JobPathfinder.IntegrationTests.Mediatr.Profile;

[TestFixture]
public class UserLanguageByIdRequestHandlerTest : CommonIntegrationTestSetup
{
    [Test]
    public async Task Handle_ShouldReturnUserLanguageResponse_WhenUserOwnsEntity()
    {
        // Arrange: create & sign in a test user, then add two languages
        var testUser = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserLanguages(TestApplicationFactory, testUser, new Dictionary<int,int> {{ 7, 1 }});
        var created = testUser.UserLanguages.First();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);

        // Act: send query for that language ID
        UserLanguageResponse response = await mediator.Send(new UserLanguageByIdRequest
        {
            Id = created.Id
        });

        // Assert: response fields match the entity
        response.Should().NotBeNull();
        response.Id.Should().Be(created.Id);
        response.UserId.Should().Be(testUser.User.Id);
        response.LanguageId.Should().Be(created.LanguageId);
        response.LanguageLevelId.Should().Be(created.LanguageLevelId);
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotAuthenticated()
    {
        // Arrange: create user but do not sign in, manually insert a language
        var user = CreateTestUser(UserRoleEnum.User, false).Result;
        var manual = new UserLanguageEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.User.Id,
            LanguageId = 99,
            LanguageLevelId = 2,
            Status = StatusEnum.New,
            CreatedAt = DateTime.UtcNow
        };
        using (var init = TestApplicationFactory.Services.CreateScope())
        {
            var ctx = init.ServiceProvider.GetRequiredService<ProfileDataContext>();
            ctx.UserLanguages.Add(manual);
            ctx.SaveChanges();
        }

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserLanguageByIdRequest, UserLanguageResponse, EntityNotFoundException>(
            mediator,
            new UserLanguageByIdRequest { Id = manual.Id },
            ErrorMessages.Forbidden
        );
    }

    [Test]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange: authenticated user but random ID
        await CreateTestUser(UserRoleEnum.User);
        var fakeId = Guid.NewGuid();

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserLanguageByIdRequest, UserLanguageResponse, EntityNotFoundException>(
            mediator,
            new UserLanguageByIdRequest { Id = fakeId },
            ErrorMessages.Forbidden
        );
    }

    [Test]
    public async Task Handle_ShouldThrowForbiddenException_WhenEntityBelongsToAnotherUser()
    {
        // Arrange: user1 adds a language
        var user1 = await CreateTestUser(UserRoleEnum.User);
        await Options.AddUserLanguages(TestApplicationFactory, user1, new Dictionary<int,int> {{ 5, 1 }});
        var languageId = user1.UserLanguages.First().Id;

        // sign in as user2
        await CreateTestUser(UserRoleEnum.User);

        using var scope = TestApplicationFactory.Services.CreateScope();
        var mediator = new Mediator(scope.ServiceProvider);
        
        // Act & Assert
        await TestUtilities.Handle_InvalidCommand<UserLanguageByIdRequest, UserLanguageResponse, ForbiddenException>(
            mediator,
            new UserLanguageByIdRequest { Id = languageId },
            ErrorMessages.Forbidden
        );
    }
}
