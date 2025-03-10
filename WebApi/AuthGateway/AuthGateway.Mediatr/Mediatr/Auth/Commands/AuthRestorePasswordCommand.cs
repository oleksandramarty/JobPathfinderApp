using System.ComponentModel.DataAnnotations;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class AuthRestorePasswordCommand: IRequest
{
    [Required] [MaxLength(50)] public required string Url { get; set; }
    [Required] [MaxLength(50)] public required string Password { get; set; }
    [Required] [MaxLength(50)] public required string PasswordAgain { get; set; }
}