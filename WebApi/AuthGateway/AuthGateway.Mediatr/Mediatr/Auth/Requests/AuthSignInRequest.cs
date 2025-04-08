using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Responses.AuthGateway;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Requests;

public class AuthSignInRequest: IRequest<JwtTokenResponse>
{
    [Required] [MaxLength(50)] public required string Login { get; set; }
    [Required] [MaxLength(50)] public required string Password { get; set; }
    public bool RememberMe { get; set; }
}