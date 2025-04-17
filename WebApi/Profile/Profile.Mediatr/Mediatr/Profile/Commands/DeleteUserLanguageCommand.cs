using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class DeleteUserLanguageCommand: BaseIdEntity<Guid>, IRequest<BaseBoolResponse>
{
}