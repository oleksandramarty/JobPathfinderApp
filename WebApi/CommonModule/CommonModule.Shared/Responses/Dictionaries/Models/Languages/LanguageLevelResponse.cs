using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Responses.Dictionaries.Models.Languages;

public class LanguageLevelResponse: BaseIdEntity<int>, IStatusEntity
{
    public string? Title { get; set; }
    public string? TitleEn { get; set; }
    
    public StatusEnum Status { get; set; }
}