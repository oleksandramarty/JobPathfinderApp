using AuthGateway.Domain.Models.Users;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Profile.Profile;
using Profile.Domain.Models.Profile;

namespace JobPathfinder.IntegrationTests.Shared;

public class IntegrationTestUserEntity
{
    public UserEntity? User { get; set; }
    public List<UserSkillEntity>? UserSkills { get; set; }
    public List<UserLanguageEntity>? UserLanguages { get; set; }
    public List<UserProfileItemEntity>? UserProfileItems { get; set; }
    public UserRoleEnum? Role { get; set; }
    
    public string? Token { get; set; }
}