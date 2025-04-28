using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class AuthRestoreCommandHandler: IRequestHandler<AuthRestoreCommand, BaseBoolResponse>
{
    public async Task<BaseBoolResponse> Handle(AuthRestoreCommand request, CancellationToken cancellationToken)
    {
        return new BaseBoolResponse();
    }
}