using CommonModule.Shared.Common;

namespace Profile.Domain.Models.Profile;

public class UserProfileItemSkillEntity: BaseIdEntity<Guid>
{
    public Guid UserSkillId { get; set; }
    public UserSkillEntity? UserSkill { get; set; }
    public Guid UserProfileItemId { get; set; }
    public UserProfileItemEntity? UserProfileItem { get; set; }
}