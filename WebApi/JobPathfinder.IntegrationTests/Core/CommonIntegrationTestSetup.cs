using AuthGateway.Domain.Models.Users;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Enums.Users;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries;
using FluentAssertions;
using JobPathfinder.IntegrationTests.Shared;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace JobPathfinder.IntegrationTests.Core;

/// <summary>
/// Common setup for integration tests
/// </summary>
public class CommonIntegrationTestSetup : IDisposable
{
    /// <summary>
    /// Http client for integration tests
    /// </summary>
    protected HttpClient Client { get; set; }

    /// <summary>
    /// Test application factory
    /// </summary>
    protected IntegrationTestBase TestApplicationFactory;

    /// <summary>
    /// Options for integration tests
    /// </summary>
    protected IntegrationTestOptions Options { get; }

    /// <summary>
    /// Start with specific user or without user
    /// </summary>
    /// <param name="role">User role</param>
    public CommonIntegrationTestSetup(UserRoleEnum? role = null)
    {
        Options = role.HasValue ? new IntegrationTestOptions(role.Value) : new IntegrationTestOptions();
    }

    /// <summary>
    /// Setup for integration tests
    /// Create factory and client
    /// </summary>
    [OneTimeSetUp]
    public async Task OneTimeSetup()
    {
        TestApplicationFactory = new IntegrationTestBase(Options);
        Client = TestApplicationFactory.CreateClient();

        await Options.InitializeUser(TestApplicationFactory);
    }

    /// <summary>
    /// Create test user
    /// </summary>
    /// <param name="role">User role</param>
    /// <param name="withSignIn">Sign in user flag</param>
    /// <param name="userActions">User actions</param>
    /// <returns></returns>
    public async Task<IntegrationTestUserEntity> CreateTestUser(
        UserRoleEnum role,
        bool withSignIn = true,
        IEnumerable<Action<UserEntity>>? userActions = null)
    {
        return await Options.CreateUser(TestApplicationFactory, role, withSignIn,
            userActions);
    }

    /// <summary>
    /// Add all types of expenses for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="userSkillDictionary">User skills</param>
    /// <param name="userLanguageDictionary">User languages</param>
    /// <param name="userProfileItemDictionary">User Profile Items</param>
    public async Task AddUserProfileGenericItems(
        Guid userId,
        Dictionary<int, int>? userSkillDictionary = null,
        Dictionary<int, int>? userLanguageDictionary = null,
        Dictionary<UserProfileItemEnum, Dictionary<int, int>>? userProfileItemDictionary = null)
    {
        if (userSkillDictionary != null)
        {
            await Options.AddUserSkills(TestApplicationFactory, userId, userSkillDictionary);
        }

        if (userLanguageDictionary != null)
        {
            await Options.AddUserLanguages(TestApplicationFactory, userId, userLanguageDictionary);
        }

        if (userProfileItemDictionary != null)
        {
            await Options.AddUserProfileItems(TestApplicationFactory, userId, userProfileItemDictionary);
        }
    }

    /// <summary>
    /// Sign out user if exist
    /// </summary>
    public async Task SignOutUserIfExist()
    {
        await Options.SignOutUserIfExist(TestApplicationFactory);
    }

    /// <summary>
    /// Check if current user is authenticated
    /// </summary>
    /// <returns></returns>
    public async Task<bool> IsCurrentUserAuthenticated()
    {
        return await Options.IsCurrentUserAuthenticated(TestApplicationFactory);
    }

    /// <summary>
    /// Dispose
    /// </summary>
    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        await Options.Dispose(TestApplicationFactory);
        Dispose();
    }

    /// <summary>
    /// Dispose client
    /// </summary>
    public void Dispose()
    {
        Client.Dispose();
    }

    public static IEnumerable<TestCaseData> CreateAllRolesTestCases()
    {
        foreach (UserRoleEnum role in Enum.GetValues(typeof(UserRoleEnum)))
        {
            yield return new TestCaseData(role).SetName(role.ToString()).SetDescription($"{role} role");
        }
    }
    public static IEnumerable<TestCaseData> CreateAllRolesWithInvalidRolesTestCases()
    {
        foreach (UserRoleEnum role in Enum.GetValues(typeof(UserRoleEnum)))
        {
            yield return new TestCaseData(role, StatusEnum.New, ErrorMessages.StatusNew).SetName($"{StatusEnum.New.ToString()} {role.ToString()}").SetDescription($"{role} role with {StatusEnum.New} status");
            yield return new TestCaseData(role, StatusEnum.Inactive, ErrorMessages.StatusInactive).SetName($"{StatusEnum.Inactive.ToString()} {role.ToString()}").SetDescription($"{role} role with {StatusEnum.Inactive} status");
            yield return new TestCaseData(role, StatusEnum.Blocked, ErrorMessages.StatusBlocked).SetName($"{StatusEnum.Blocked.ToString()} {role.ToString()}").SetDescription($"{role} role with {StatusEnum.Blocked} status");
            yield return new TestCaseData(role, StatusEnum.Deleted, ErrorMessages.StatusDeleted).SetName($"{StatusEnum.Deleted.ToString()} {role.ToString()}").SetDescription($"{role} role with {StatusEnum.Deleted} status");
            yield return new TestCaseData(role, StatusEnum.Archived, ErrorMessages.StatusArchived).SetName($"{StatusEnum.Archived.ToString()} {role.ToString()}").SetDescription($"{role} role with {StatusEnum.Archived} status");
        }
    }

    public async Task<SiteSettingsResponse> SiteSettings()
    {
        return await Options.SiteSettings(TestApplicationFactory);
    }

    public async Task HandleValidDictionary<TRequest, TEntity, TEntityResponse>(
        UserRoleEnum role,
        string? version,
        int count = 0)
        where TRequest : IRequest<VersionedListResponse<TEntityResponse>>, IBaseVersionEntity, new()
        where TEntityResponse : class
        where TEntity : class
    {
        // Arrange
        await SignOutUserIfExist();
        await CreateTestUser(role);

        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            IMediator mediator = new Mediator(scope.ServiceProvider);

            TRequest request = new TRequest
            {
                Version = version
            };

            VersionedListResponse<TEntityResponse> response = await mediator.Send(request);

            // Assert
            response.Should().NotBeNull();
            if (count != 0)
            {
                response.Items.Should().NotBeNullOrEmpty();
            }

            response.Items.Should().HaveCount(count);
        }
    }
}