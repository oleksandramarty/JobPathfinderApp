using CommonModule.Shared.Responses.AuthGateway.Users;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Requests;

public class UserByLoginRequest: IRequest<UserResponse>
{
    public string? Login { get; set; }
}