namespace CommonModule.Shared.Responses.Dictionaries;

public class SiteSettingsResponse
{
    public CacheVersionResponse? Version { get; set; }
}

public class CacheVersionResponse
{
    public string? LocalizationPublic { get; set; }
    public string? Localization { get; set; }
}
