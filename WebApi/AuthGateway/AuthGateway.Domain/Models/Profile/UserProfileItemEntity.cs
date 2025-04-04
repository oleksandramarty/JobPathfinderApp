using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Core;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Enums.Users;

namespace AuthGateway.Domain.Models.Profile;

public class UserProfileItemEntity: BaseDateTimeEntity<Guid>, IStatusEntity, IBaseVersionEntity
{
    public Guid UserId { get; set; }
    
    public UserProfileItemEnum ProfileItemType { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    [Required] [MaxLength(100)] public required string Position { get; set; }
    [MaxLength(1000)] public string? Description { get; set; }
    [MaxLength(100)] public string? Company { get; set; }
    [MaxLength(50)] public string? Location { get; set; }
    
    public int? CountryId { get; set; }
    public int? JobTypeId { get; set; }
    public int? WorkArrangementId { get; set; }
    
    public ICollection<UserProfileItemLanguageEntity> Languages { get; set; }
    public ICollection<UserProfileItemSkillEntity> Skills { get; set; }
    
    public StatusEnum Status { get; set; }
    
    [Required]
    [StringLength(32, MinimumLength = 32)]
    public string Version { get; set; } = VersionExtension.GenerateVersion();
}