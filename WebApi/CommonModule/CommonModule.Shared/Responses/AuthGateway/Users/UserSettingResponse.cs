using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Core;

namespace CommonModule.Shared.Responses.AuthGateway.Users;

public class UserSettingResponse: BaseIdEntity<Guid>, IBaseVersionEntity
{
    public string? DefaultLocale { get; set; }
    public int TimeZone { get; set; }
    public int? CountryId { get; set; }
    public int? CurrencyId { get; set; }
    public bool ApplicationAiPrompt { get; set; }
    public Guid UserId { get; set; }
    
    public string? LinkedInUrl { get; set; }
    public string? NpmUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    
    public bool ShowCurrentPosition { get; set; }
    public bool ShowHighestEducation { get; set; }
    
    [Required]
    [StringLength(32, MinimumLength = 32)]
    public string Version { get; set; } = VersionExtension.GenerateVersion();
}