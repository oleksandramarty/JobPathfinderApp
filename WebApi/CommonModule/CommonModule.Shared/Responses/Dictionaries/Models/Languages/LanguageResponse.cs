using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Responses.Dictionaries.Models.Languages;

public class LanguageResponse: BaseIdEntity<int>, IStatusEntity
{
    public string? IsoCode { get; set; }
    public string? Title { get; set; }
    public string? TitleEn { get; set; }
    public StatusEnum Status { get; set; }
}
