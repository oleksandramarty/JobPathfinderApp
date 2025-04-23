using System.Security.Claims;
using AuditTrail.Domain;
using AuditTrail.Domain.Models;
using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Core;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Enums.Users;
using CommonModule.Shared.Responses.Dictionaries;
using Dictionaries.Domain;
using JobPathfinder.IntegrationTests.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Profile.Domain;
using Profile.Domain.Models.Profile;

namespace JobPathfinder.IntegrationTests.Core;

/// <summary>
/// Options for integration tests
/// </summary>
public class IntegrationTestOptions
{
    public IntegrationTestUserEntity? CurrentUserEntity { get; set; }
    public IntegrationTestUserEntity? AdditionalUser { get; set; }

    private UserRoleEnum? Role { get; set; }

    public IntegrationTestOptions()
    {
    }

    public IntegrationTestOptions(UserRoleEnum role)
    {
        Role = role;
    }

    public async Task InitializeUser(IntegrationTestBase testApplicationFactory)
    {
        AdditionalUser = await CreateUser(
            testApplicationFactory,
            UserRoleEnum.User,
            false);

        if (!Role.HasValue)
        {
            return;
        }

        await CreateUser(testApplicationFactory, Role.Value);
    }

    public async Task<IntegrationTestUserEntity> CreateUser(
        IntegrationTestBase testApplicationFactory,
        UserRoleEnum role,
        bool withSignIn = true,
        IEnumerable<Action<UserEntity>>? userActions = null)

    {
        using var scope = testApplicationFactory.Services.CreateScope();
        AuthGatewayDataContext authGatewayDataContext =
            scope.ServiceProvider.GetRequiredService<AuthGatewayDataContext>();
        IJwtTokenFactory jwtTokenFactory = scope.ServiceProvider.GetRequiredService<IJwtTokenFactory>();
        ITokenRepository tokenRepository = scope.ServiceProvider.GetRequiredService<ITokenRepository>();

        string login = IntegrationTestConstants.UserName + StringExtension.GenerateRandomString(5);
        Guid userId = Guid.NewGuid();
        string salt = jwtTokenFactory.GenerateSalt();
        string passwordHash = jwtTokenFactory.HashPassword(login, salt);

        UserEntity user = new UserEntity
        {
            Id = userId,
            Login = login,
            LoginNormalized = login.ToUpper(),
            Email = login + "@mail.com",
            EmailNormalized = (login + "@mail.com").ToUpper(),
            Phone = "01234567890",
            FirstName = "John",
            LastName = "Smith",
            Headline = "Headline Test",
            Status = StatusEnum.Active,
            IsTemporaryPassword = true,
            AuthType = UserAuthMethodEnum.Base,
            Salt = salt,
            PasswordHash = passwordHash,
            
            Roles = new List<UserRoleEntity>
            {
                new UserRoleEntity
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    RoleId = (int)role
                }
            },
            UserSetting = new UserSettingEntity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                DefaultLocale = "en",
                ApplicationAiPrompt = false,
                ShowCurrentPosition = true,
                ShowHighestEducation = true,
            }
        };

        user.UserSettingId = user.UserSetting.Id;

        if (userActions != null)
        {
            foreach (var action in userActions)
            {
                action(user);
            }
        }

        await authGatewayDataContext.Users.AddAsync(user);
        await authGatewayDataContext.SaveChangesAsync();

        IntegrationTestUserEntity result = new IntegrationTestUserEntity
        {
            Role = role,
            User = await authGatewayDataContext.Users
                .Include(u => u.Roles)
                .ThenInclude(r => r.Role)
                .Include(u => u.UserSetting)
                .FirstOrDefaultAsync(u => u.Id == user.Id),
            UserSkills = new List<UserSkillEntity>(),
            UserLanguages = new List<UserLanguageEntity>(),
            UserProfileEntity = new List<UserProfileItemEntity>(),
            Token = null
        };

        if (withSignIn)
        {
            if (result.User == null)
            {
                throw new ArgumentNullException(nameof(result.User));
            }

            CurrentUserEntity = result;
            Role = role;

            var token = jwtTokenFactory.GenerateJwtToken(
                CurrentUserEntity.User.Id,
                CurrentUserEntity.User.Login,
                CurrentUserEntity.User.Email,
                string.Join(",", Role.Value.ToString()),
                true);

            result.Token = token;

            var httpContextAccessorForTesting = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
            List<Claim> claims = TestClaims();

            ClaimsIdentity identity = new ClaimsIdentity(claims, "IntegrationTestAuthentication");
            ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(identity);
            httpContextAccessorForTesting.HttpContext = new DefaultHttpContext
            {
                User = claimsPrincipal
            };

            await tokenRepository.AddTokenAsync(token, TimeSpan.FromDays(30));
        }

        return result;
    }

    public async Task AddUserSkills(
        IntegrationTestBase testApplicationFactory,
        Guid userId,
        Dictionary<int, int> data)
    {
        using var scope = testApplicationFactory.Services.CreateScope();
        ProfileDataContext profileDataContext = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();

        List<UserSkillEntity> userSkills = new List<UserSkillEntity>();
        
        foreach (var (key, value) in data)
        {
            for (var i = 0; i < value; i++)
            {
                userSkills.Add(new UserSkillEntity
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UserId = userId,
                    SkillId = key,
                    SkillLevelId = value,
                    Status = StatusEnum.New
                });
            }
        }

        await profileDataContext.UserSkills.AddRangeAsync(userSkills);
        await profileDataContext.SaveChangesAsync();

        if (CurrentUserEntity != null)
        {
            CurrentUserEntity.UserSkills = userSkills;
        }
    }

    public async Task AddUserLanguages(
        IntegrationTestBase testApplicationFactory,
        Guid userId,
        Dictionary<int, int> data)
    {
        using var scope = testApplicationFactory.Services.CreateScope();
        ProfileDataContext profileDataContext = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();

        List<UserLanguageEntity> userLanguages = new List<UserLanguageEntity>();
        
        foreach (var (key, value) in data)
        {
            for (var i = 0; i < value; i++)
            {
                userLanguages.Add(new UserLanguageEntity
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UserId = userId,
                    LanguageId = key,
                    LanguageLevelId = value,
                    Status = StatusEnum.New
                });
            }
        }

        await profileDataContext.UserLanguages.AddRangeAsync(userLanguages);
        await profileDataContext.SaveChangesAsync();

        if (CurrentUserEntity != null)
        {
            CurrentUserEntity.UserLanguages = userLanguages;
        }
    }

    public async Task AddUserProfileItems(
        IntegrationTestBase testApplicationFactory,
        Guid userId,
        Dictionary<UserProfileItemEnum, Dictionary<int, int>> data)
    {
        using var scope = testApplicationFactory.Services.CreateScope();
        ProfileDataContext profileDataContext = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();

        List<UserProfileItemEntity> userProfileItems = new List<UserProfileItemEntity>();

        foreach (var profileItemTypeSection in data)
        {
            foreach (var (key, value) in profileItemTypeSection.Value)
            {
                for (var i = 0; i < value; i++)
                {
                    userProfileItems.Add(new UserProfileItemEntity
                    {
                        Id = Guid.NewGuid(),
                        CreatedAt = DateTime.UtcNow,
                        UserId = userId,
                        Status = StatusEnum.New,
                        Position = $"Position {key}",
                        Company = $"Company {key}",
                        Location = $"Location {key}",
                        ProfileItemType = profileItemTypeSection.Key,
                        StartDate = DateTime.UtcNow,
                        CountryId = key,
                        JobTypeId = key,
                        WorkArrangementId = value,
                    });
                }
            }
        }

        await profileDataContext.UserProfileItems.AddRangeAsync(userProfileItems);
        await profileDataContext.SaveChangesAsync();

        if (CurrentUserEntity != null)
        {
            CurrentUserEntity.UserProfileEntity = userProfileItems;
        }
    }

    public async Task SignOutUserIfExist(IntegrationTestBase testApplicationFactory)
    {
        using var scope = testApplicationFactory.Services.CreateScope();

        if (CurrentUserEntity?.Token != null && CurrentUserEntity.User != null)
        {
            ITokenRepository tokenRepository = scope.ServiceProvider.GetRequiredService<ITokenRepository>();
            await tokenRepository.DeleteUserTokenAsync(CurrentUserEntity.User.Id);

            HttpContextAccessorForTesting httpContextAccessorForTesting = new HttpContextAccessorForTesting();
            httpContextAccessorForTesting.HttpContext = new DefaultHttpContext()
            {
                User = null
            };

            CurrentUserEntity = null;
        }
    }

    public async Task<bool> IsCurrentUserAuthenticated(IntegrationTestBase testApplicationFactory)
    {
        using var scope = testApplicationFactory.Services.CreateScope();
        ITokenRepository tokenRepository = scope.ServiceProvider.GetRequiredService<ITokenRepository>();

        if (CurrentUserEntity?.Token == null)
        {
            return false;
        }

        return !tokenRepository.IsTokenExpired(CurrentUserEntity.Token);
    }

    public HttpContextAccessorForTesting GenerateClaims()
    {
        HttpContextAccessorForTesting httpContextAccessorForTesting = new HttpContextAccessorForTesting();

        if (CurrentUserEntity == null)
        {
            httpContextAccessorForTesting.HttpContext = new DefaultHttpContext()
            {
                User = null
            };
            return httpContextAccessorForTesting;
        }

        List<Claim> claims = TestClaims();

        ClaimsIdentity identity = new ClaimsIdentity(claims, "IntegrationTestAuthentication");
        ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(identity);
        httpContextAccessorForTesting.HttpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        return httpContextAccessorForTesting;
    }

    private List<Claim> TestClaims()
    {
        if (CurrentUserEntity?.User == null)
        {
            throw new ArgumentNullException(nameof(CurrentUserEntity.User));
        }

        if (CurrentUserEntity.User.Roles == null || !CurrentUserEntity.User.Roles.Any())
        {
            throw new ArgumentNullException(nameof(CurrentUserEntity.User.Roles));
        }

        bool rememberMe = true;

        List<Claim> claims =
        [
            new Claim(AuthClaims.Login, CurrentUserEntity.User.Login),
            new Claim(AuthClaims.Email, CurrentUserEntity.User.Email),
            new Claim(AuthClaims.UserId, CurrentUserEntity.User.Id.ToString()),
            new Claim(AuthClaims.Role,
                CurrentUserEntity.User.Roles.FirstOrDefault()?.Role?.UserRole.ToString() ?? string.Empty),
            new Claim(AuthClaims.RememberMe, rememberMe.ToString())
        ];

        return claims;
    }

    public async Task Dispose(IntegrationTestBase testApplicationFactory)
    {
        using var scope = testApplicationFactory.Services.CreateScope();
        AuthGatewayDataContext authGatewayDataContext = scope.ServiceProvider.GetRequiredService<AuthGatewayDataContext>();
        ProfileDataContext profileDataContext = scope.ServiceProvider.GetRequiredService<ProfileDataContext>();
        AuditTrailDataContext auditTrailDataContext = scope.ServiceProvider.GetRequiredService<AuditTrailDataContext>();

        await RemoveAllFromTable<AuthGatewayDataContext, UserSettingEntity>(authGatewayDataContext);
        await RemoveAllFromTable<AuthGatewayDataContext, UserRoleEntity>(authGatewayDataContext);
        await RemoveAllFromTable<AuthGatewayDataContext, UserEntity>(authGatewayDataContext);
        
        await RemoveAllFromTable<ProfileDataContext, UserProfileItemLanguageEntity>(profileDataContext);
        await RemoveAllFromTable<ProfileDataContext, UserProfileItemSkillEntity>(profileDataContext);
        await RemoveAllFromTable<ProfileDataContext, UserProfileItemEntity>(profileDataContext);
        await RemoveAllFromTable<ProfileDataContext, UserSkillEntity>(profileDataContext);
        await RemoveAllFromTable<ProfileDataContext, UserLanguageEntity>(profileDataContext);
        
        await RemoveAllFromTable<AuditTrailDataContext, AuditTrailArchiveEntity>(auditTrailDataContext);
        await RemoveAllFromTable<AuditTrailDataContext, AuditTrailEntity>(auditTrailDataContext);
    }

    private async Task RemoveAllFromTable<TDataContext, TEntity>(TDataContext context)
        where TDataContext : DbContext
        where TEntity : class
    {
        List<TEntity> entities = await context.Set<TEntity>().ToListAsync();

        context.RemoveRange(entities);
        await context.SaveChangesAsync();
    }

    public async Task<SiteSettingsResponse> SiteSettings(IntegrationTestBase testApplicationFactory)
    {
        ICacheBaseRepository<Guid> cacheBaseRepository =
            testApplicationFactory.Services.GetRequiredService<ICacheBaseRepository<Guid>>();

        SiteSettingsResponse response = new SiteSettingsResponse
        {
            Version = new CacheVersionResponse
            {
                Localization = await cacheBaseRepository.CacheVersionAsync("localization") ??
                               VersionExtension.GenerateVersion(),
                LocalizationPublic = await cacheBaseRepository.CacheVersionAsync("localization_public") ??
                                     VersionExtension.GenerateVersion()
            }
        };

        return response;
    }
}