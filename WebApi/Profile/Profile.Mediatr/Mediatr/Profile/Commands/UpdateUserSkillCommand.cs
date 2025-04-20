using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class UpdateUserSkillCommand: BaseIdEntity<Guid>, IRequest<BaseBoolResponse>
{
    public int SkillId { get; set; }
    public int SkillLevelId { get; set; }
}