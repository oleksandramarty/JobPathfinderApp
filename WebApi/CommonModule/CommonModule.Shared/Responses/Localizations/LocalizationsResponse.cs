using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Shared.Responses.Localizations;

public class LocalizationsResponse: BaseVersionEntity
{
    public LocalizationsResponse()
    {
        Data = new List<LocalizationResponse>();
    }
    public ICollection<LocalizationResponse> Data { get; set; }
}

public class LocalizationResponse
{
    public LocalizationResponse()
    {
        Items = new List<LocalizationItemResponse>();
    }
    
    public LocalizationResponse(string locale)
    {
        Locale = locale;
        Items = new List<LocalizationItemResponse>();
    }
    public string? Locale { get; set; }
    public List<string> ShortMonths { get; set; }
    public List<string> ShortDays { get; set; }
    public ICollection<LocalizationItemResponse> Items { get; set; }
}

public class LocalizationItemResponse
{
    public LocalizationItemResponse(string? key, string? value)
    {
        Key = key;
        Value = value;
    }
    
    public string? Key { get; set; }
    public string? Value { get; set; }
}