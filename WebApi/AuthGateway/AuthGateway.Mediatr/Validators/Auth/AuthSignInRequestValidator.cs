using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using FluentValidation;

namespace AuthGateway.Mediatr.Validators.Auth;

public class AuthSignInRequestValidator : AbstractValidator<AuthSignInRequest>
{
    public AuthSignInRequestValidator()
    {
        RuleFor(x => x.Login)
            .NotEmpty().WithMessage("Login is required.")
            .MaximumLength(50).WithMessage("Login must not exceed 50 characters.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MaximumLength(50).WithMessage("Password must not exceed 50 characters.");
    }
}