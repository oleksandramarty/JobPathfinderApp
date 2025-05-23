using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Core;

namespace AuthGateway.Domain.Models.Users;

public class UserSettingEntity: BaseDateTimeEntity<Guid>, IBaseVersionEntity
{
    [Required] [MaxLength(2)] public required string DefaultLocale { get; set; } = "en";
    public int? TimeZone { get; set; }
    public int? CountryId { get; set; }
    public int? CurrencyId { get; set; }
    public bool ApplicationAiPrompt { get; set; }
    public Guid UserId { get; set; }
    public UserEntity? User { get; set; }
    
    [MaxLength(100)] public string? LinkedInUrl { get; set; }
    [MaxLength(100)] public string? NpmUrl { get; set; }
    [MaxLength(100)] public string? GitHubUrl { get; set; }
    [MaxLength(100)] public string? PortfolioUrl { get; set; }
    
    public bool ShowCurrentPosition { get; set; }
    public bool ShowHighestEducation { get; set; }
    
    [Required]
    [StringLength(32, MinimumLength = 32)]
    public string Version { get; set; } = VersionExtension.GenerateVersion();
}