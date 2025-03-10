using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Core;
using CommonModule.Shared.Enums;

namespace AuthGateway.Domain.Models.Users;

public class UserEntity: BaseDateTimeEntity<Guid>, IStatusEntity, IBaseVersionEntity
{
    [Required] [MaxLength(50)] public required string Login { get; set; }
    [Required] [MaxLength(50)] public required string LoginNormalized { get; set; }
    [Required] [MaxLength(50)] public required string Email { get; set; }
    [Required] [MaxLength(50)] public required string EmailNormalized { get; set; }
    [Required] [MaxLength(120)] public required string PasswordHash { get; set; }
    [Required] [MaxLength(64)] public required string Salt { get; set; }
    public StatusEnum Status { get; set; }
    public bool IsTemporaryPassword { get; set; }
    public UserAuthMethodEnum AuthType { get; set; }
    
    public DateTime? LastForgotPassword { get; set; }
    public DateTime? LastForgotPasswordRequest { get; set; }
    
    public ICollection<UserRoleEntity> Roles { get; set; }
    
    public Guid? UserSettingId { get; set; }
    public UserSettingEntity? UserSetting { get; set; }
    
    [Required]
    [StringLength(32, MinimumLength = 32)]
    public string Version { get; set; } = VersionExtension.GenerateVersion();
}