namespace CommonModule.Shared.Responses.Dictionaries;

public class SiteSettingsResponse
{
    public string? Locale { get; set; }
    public CacheVersionResponse? Version { get; set; }
}

public class CacheVersionResponse
{
    public string? LocalizationPublic { get; set; }
    public string? Localization { get; set; }
    public string? Country { get; set; }
    public string? Locale { get; set; }
    public string? Skill { get; set; }
}
