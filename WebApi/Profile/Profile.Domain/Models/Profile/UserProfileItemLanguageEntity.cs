using CommonModule.Shared.Common;

namespace Profile.Domain.Models.Profile;

public class UserProfileItemLanguageEntity: BaseIdEntity<Guid>
{
    public Guid UserSkillId { get; set; }
    public UserLanguageEntity? UserLanguage { get; set; }
    public Guid UserProfileItemId { get; set; }
    public UserProfileItemEntity? UserProfileItem { get; set; }
}