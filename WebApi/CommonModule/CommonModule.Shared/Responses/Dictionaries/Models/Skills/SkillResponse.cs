using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Responses.Dictionaries.Models.Skills;

public class SkillResponse: BaseIdEntity<int>, IStatusEntity
{
    public string? Title { get; set; }
    public StatusEnum Status { get; set; }
}