using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace Dictionaries.Domain.Models.ExperienceLevels;

public class ExperienceLevelEntity: BaseIdEntity<int>, IStatusEntity
{
    [Required] [MaxLength(100)] public required string Title { get; set; }
    [Required] [MaxLength(100)] public required string TitleEn { get; set; }
    
    public StatusEnum Status { get; set; }
}