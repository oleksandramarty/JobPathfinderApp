using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AuthGateway.Mediatr.Validators.Auth;
using CommonModule.Core.Extensions;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using FluentAssertions;
using FluentValidation.Results;
using JobPathfinder.IntegrationTests.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace JobPathfinder.IntegrationTests.Mediatr.Auth;

[TestFixture]
public class AuthSignUpCommandHandlerTest() : CommonIntegrationTestSetup()
{
    [Test]
    public async Task Handle_ShouldReturnUserId_WhenAuthSignUpRequestIsValid()
    {
        // Arrange
        await SignOutUserIfExist();
        string password = StringExtension.GenerateRandomString(10, true) + "Aa!1";
        AuthSignUpCommand command = new AuthSignUpCommand
        {
            Email = StringExtension.GenerateRandomString(10) + "@gmail.com",
            Login = StringExtension.GenerateRandomString(10),
            Password = password,
            PasswordAgain = password
        };

        // Act
        using (var scope = TestApplicationFactory.Services.CreateScope())
        {
            AuthGatewayDataContext authGatewayDataContext = scope.ServiceProvider.GetRequiredService<AuthGatewayDataContext>();
            bool beforeSignIn = await IsCurrentUserAuthenticated();

            IMediator mediator = new Mediator(scope.ServiceProvider);
            BaseEntityIdResponse<Guid> response = await mediator.Send(command);

            UserEntity? user = await authGatewayDataContext.Users.FirstOrDefaultAsync(x => x.Id == response.Id);

            bool afterSignIn = await IsCurrentUserAuthenticated();

            // Assert
            beforeSignIn.Should().BeFalse();
            afterSignIn.Should().BeFalse();
            response.Should().NotBeNull();
            user.Should().NotBeNull();
            user.Email.Should().Be(command.Email);
            user.Login.Should().Be(command.Login);
            user.Id.Should().Be(response.Id);
            user.Status.Should().Be(StatusEnum.New);
        }
    }

    [Test]
    public void Validator_ShouldHaveErrors_WhenEmailIsInvalid()
    {
        // Arrange
        var validator = new AuthSignUpCommandValidator();
        var invalidCommand = new AuthSignUpCommand
        {
            Email = "invalid-email",
            Login = "ValidLogin",
            Password = "ValidPassword1!",
            PasswordAgain = "ValidPassword1!"
        };

        // Act
        ValidationResult result = validator.Validate(invalidCommand);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.PropertyName == "Email" && x.ErrorMessage == "A valid email is required.");
    }
    
    private static IEnumerable<TestCaseData> CreateInvalidValidatorForSignUp()
    {
        // Email, Login, Password, PasswordAgain
        yield return new TestCaseData(StringExtension.GenerateRandomString(10) + "@gmail.com", "", "ValidPassword1!", "ValidPassword1!").SetName("Empty Login");
        yield return new TestCaseData(StringExtension.GenerateRandomString(10) + "@gmail.com", "ValidLogin", "short", "short").SetName("Invalid Password");
        yield return new TestCaseData(StringExtension.GenerateRandomString(10) + "@gmail.com", "ValidLogin", "ValidPassword1!", "DifferentPassword1!").SetName("Different Passwords");
        yield return new TestCaseData("invalid-email", "ValidLogin", "ValidPassword1!", "ValidPassword1!").SetName("Invalid Email");
        yield return new TestCaseData("", "ValidLogin", "ValidPassword1!", "ValidPassword1!").SetName("Empty Email");
        yield return new TestCaseData(StringExtension.GenerateRandomString(10) + "@gmail.com", "ValidLogin", "", "ValidPassword1!").SetName("Empty Password");
        yield return new TestCaseData(StringExtension.GenerateRandomString(10) + "@gmail.com", "ValidLogin", "ValidPassword1!", "").SetName("Empty PasswordAgain");
    }

    [Test, TestCaseSource(nameof(CreateInvalidValidatorForSignUp))]
    public void Validator_ShouldHaveErrors_WhenSignUpRequestIsInvalid(string email, string login, string password, string passwordAgain)
    {
        // Arrange
        var validator = new AuthSignUpCommandValidator();
        var invalidCommand = new AuthSignUpCommand
        {
            Email = email,
            Login = login,
            Password = password,
            PasswordAgain = passwordAgain
        };

        // Act
        ValidationResult result = validator.Validate(invalidCommand);

        // Assert
        result.IsValid.Should().BeFalse();
    }
}