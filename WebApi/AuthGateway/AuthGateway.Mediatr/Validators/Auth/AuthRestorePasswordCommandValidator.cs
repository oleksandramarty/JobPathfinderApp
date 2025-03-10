using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using FluentValidation;

namespace AuthGateway.Mediatr.Validators.Auth;

public class AuthRestorePasswordCommandValidator: AbstractValidator<AuthRestorePasswordCommand>
{
    public AuthRestorePasswordCommandValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$")
            .WithMessage("Password must be at least 10 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special symbol.");
        
        RuleFor(x => x.PasswordAgain)
            .NotEmpty().WithMessage("Password is required.")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$")
            .WithMessage("Password must be at least 10 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special symbol.");
    }
}