using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Responses.Dictionaries.Models.Currencies;

public class CurrencyResponse: BaseIdEntity<int>, IStatusEntity
{
    public string? Code { get; set; }
    public string?Symbol { get; set; }
    public string? Title { get; set; }
    public string? TitleEn { get; set; }

    public StatusEnum Status { get; set; }
}