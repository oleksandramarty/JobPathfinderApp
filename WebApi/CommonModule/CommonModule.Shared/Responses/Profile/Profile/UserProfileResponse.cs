namespace CommonModule.Shared.Responses.Profile.Profile;

public class UserProfileResponse
{
    public ICollection<UserSkillResponse> Skills { get; set; }
    public ICollection<UserLanguageResponse> Languages { get; set; }
    public ICollection<UserProfileItemResponse> Items { get; set; }
}