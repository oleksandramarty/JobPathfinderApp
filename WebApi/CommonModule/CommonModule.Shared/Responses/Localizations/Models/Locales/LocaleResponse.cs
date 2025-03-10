using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Responses.Localizations.Models.Locales;

public class LocaleResponse: BaseIdEntity<int>, IStatusEntity
{
    public string? IsoCode { get; set; }
    public string? Title { get; set; }
    public string? TitleEn { get; set; }
    public string? TitleNormalized { get; set; }
    public string? TitleEnNormalized { get; set; }
    public bool IsDefault { get; set; }
    public StatusEnum Status { get; set; }
    public LocaleEnum LocaleEnum { get; set; }
    public string? Culture { get; set; }
}