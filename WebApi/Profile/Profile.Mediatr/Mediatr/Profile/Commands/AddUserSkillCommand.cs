using CommonModule.Shared.Responses.Base;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class AddUserSkillCommand: IRequest<BaseBoolResponse>
{
    public int SkillId { get; set; }
    public int SkillLevelId { get; set; }
}