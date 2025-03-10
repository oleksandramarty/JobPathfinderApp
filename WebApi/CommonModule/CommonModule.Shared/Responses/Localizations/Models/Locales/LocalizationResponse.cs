using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Shared.Responses.Localizations.Models.Locales;

public class LocalizationResponse: BaseIdEntity<Guid>, IPublicableEntity
{
    public string? Key { get; set; }
    public string? Value { get; set; }
    public string? ValueEn { get; set; }
    
    public int LocaleId { get; set; }
    
    public bool IsPublic { get; set; }
}