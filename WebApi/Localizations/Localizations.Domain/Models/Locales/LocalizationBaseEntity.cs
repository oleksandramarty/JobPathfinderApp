using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;

namespace Localizations.Domain.Models.Locales;

public class LocalizationBaseEntity: BaseIdEntity<Guid>, IPublicableEntity
{
    [Required] [MaxLength(80)] public required string Key { get; set; }
    [Required] [MaxLength(500)] public required string Value { get; set; }
    [Required] [MaxLength(500)] public required string ValueEn { get; set; }
    
    public int LocaleId { get; set; }
    public LocaleEntity? Locale { get; set; }
    
    public bool IsPublic { get; set; }
}