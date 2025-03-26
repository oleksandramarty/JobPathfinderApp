using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Core;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Responses.AuthGateway.Profile;

public class UserSkillResponse: BaseDateTimeEntity<Guid>, IStatusEntity, IBaseVersionEntity
{
    public Guid UserId { get; set; }
    public int SkillId { get; set; }
    public int SkillLevelId { get; set; }
    
    public ICollection<UserProfileItemSkillResponse> UserProfileItems { get; set; }
    
    public StatusEnum Status { get; set; }
    
    [Required]
    [StringLength(32, MinimumLength = 32)]
    public string Version { get; set; } = VersionExtension.GenerateVersion();
}