using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace Dictionaries.Domain.Models.Languages;

public class LanguageEntity: BaseIdEntity<int>, IStatusEntity
{
    [Required] [MaxLength(3)] public required string IsoCode { get; set; }
    [Required] [MaxLength(50)] public required string Title { get; set; }
    [Required] [MaxLength(50)] public required string TitleEn { get; set; }
    public StatusEnum Status { get; set; }
}
