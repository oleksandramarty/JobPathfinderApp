using CommonModule.Shared.Common;

namespace CommonModule.Shared.Responses.Profile.Profile;

public class UserProfileItemLanguageResponse: BaseIdEntity<Guid>
{
    public Guid UserSkillId { get; set; }
    public UserLanguageResponse? UserLanguage { get; set; }
    public Guid UserProfileItemId { get; set; }
    public UserProfileItemResponse? UserProfileItem { get; set; }
}