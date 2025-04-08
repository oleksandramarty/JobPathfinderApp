using CommonModule.Shared.Common;

namespace CommonModule.Shared.Responses.AuthGateway.Profile;

public class UserProfileItemSkillResponse: BaseIdEntity<Guid>
{
    public Guid UserSkillId { get; set; }
    public UserSkillResponse? UserSkill { get; set; }
    public Guid UserProfileItemId { get; set; }
    public UserProfileItemResponse? UserProfileItem { get; set; }
}