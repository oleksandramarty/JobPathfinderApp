using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class DeleteUserSkillCommand: BaseIdEntity<Guid>, IRequest<BaseBoolResponse>
{
}