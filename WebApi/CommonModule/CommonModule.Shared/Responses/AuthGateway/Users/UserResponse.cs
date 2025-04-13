using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Core;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Responses.AuthGateway.Users;

public class UserResponse: BaseDateTimeEntity<Guid>, IStatusEntity, IBaseVersionEntity
{
    public string? Login { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Headline { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public StatusEnum Status { get; set; }
    public bool IsTemporaryPassword { get; set; }
    public UserAuthMethodEnum AuthType { get; set; }
    
    public DateTime? LastForgotPassword { get; set; }
    public DateTime? LastForgotPasswordRequest { get; set; }
    
    public ICollection<RoleResponse> Roles { get; set; }
    
    public UserSettingResponse? UserSetting { get; set; }

    [Required]
    [StringLength(32, MinimumLength = 32)]
    public string Version { get; set; } = VersionExtension.GenerateVersion();
}