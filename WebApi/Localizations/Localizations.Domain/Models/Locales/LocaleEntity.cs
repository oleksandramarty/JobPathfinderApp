using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace Localizations.Domain.Models.Locales;

public class LocaleEntity : BaseIdEntity<int>, IStatusEntity
{
    [Required] [MaxLength(2)] public required string IsoCode { get; set; }
    [Required] [MaxLength(50)] public required string Title { get; set; }
    [Required] [MaxLength(50)] public required string TitleEn { get; set; }
    [Required] [MaxLength(50)] public required string TitleNormalized { get; set; }
    [Required] [MaxLength(50)] public required string TitleEnNormalized { get; set; }
    public bool IsDefault { get; set; }
    public StatusEnum Status { get; set; }
    public LocaleEnum LocaleEnum { get; set; }
    [Required] [MaxLength(8)] public string? Culture { get; set; }
    public ICollection<LocalizationEntity> Localizations { get; set; }
}