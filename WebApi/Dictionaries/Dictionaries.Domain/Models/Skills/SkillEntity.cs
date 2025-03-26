using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace Dictionaries.Domain.Models.Skills;

public class SkillEntity: BaseIdEntity<int>, IStatusEntity
{
    [Required] [MaxLength(100)] public required string Title { get; set; }
    
    public StatusEnum Status { get; set; }
}