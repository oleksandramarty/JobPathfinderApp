using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class AuthSignUpCommand: IRequest<BaseEntityIdResponse<Guid>>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    [Required] [MaxLength(50)] public required string Login { get; set; }
    [Required] [MaxLength(50)] public required string Email { get; set; }
    [Required] [MaxLength(50)] public required string Password { get; set; }
    [Required] [MaxLength(50)] public required string PasswordAgain { get; set; }
}