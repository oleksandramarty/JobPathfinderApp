using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.AuthGateway.Users;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Requests;

public class UserByIdRequest: BaseIdEntity<Guid>, IRequest<UserResponse>
{
    
}