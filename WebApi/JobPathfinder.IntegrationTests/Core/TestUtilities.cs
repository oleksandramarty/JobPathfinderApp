using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace JobPathfinder.IntegrationTests.Core;

/// <summary>
/// Utility class for testing MediatR commands
/// </summary>
public static class TestUtilities
{
    /// <summary>
    /// Asserts that a command is invalid
    /// </summary>
    /// <param name="mediatr"></param>
    /// <param name="command"></param>
    /// <param name="errorMessage"></param>
    /// <param name="additionalAction"></param>
    /// <typeparam name="TCommand"></typeparam>
    /// <typeparam name="TResult"></typeparam>
    /// <typeparam name="TException"></typeparam>
    public static async Task Handle_InvalidCommand<TCommand, TResult, TException>(
        IMediator mediatr, TCommand command, string errorMessage,
        Func<Task>? additionalAction = null)
        where TCommand : IRequest<TResult>
        where TException : Exception
    {
        var exception = await Assert.ThrowsExceptionAsync<TException>(async () =>
        {
            await mediatr.Send(command, CancellationToken.None);
        });
        StringAssert.Contains(exception.Message, errorMessage);

        if (additionalAction != null)
        {
            await additionalAction.Invoke();
        }
    }

    /// <summary>
    /// Asserts that a command is invalid
    /// </summary>
    /// <param name="mediatr"></param>
    /// <param name="command"></param>
    /// <param name="errorMessage"></param>
    /// <param name="additionalAction"></param>
    /// <typeparam name="TCommand"></typeparam>
    /// <typeparam name="TException"></typeparam>
    public static async Task Handle_InvalidCommand<TCommand, TException>(
        IMediator mediatr, TCommand command, string errorMessage,
        Func<Task>? additionalAction = null)
        where TCommand : IRequest
        where TException : Exception
    {
        var exception = await Assert.ThrowsExceptionAsync<TException>(async () =>
        {
            await mediatr.Send(command, CancellationToken.None);
        });
        StringAssert.Contains(exception.Message, errorMessage);

        if (additionalAction != null)
        {
            await additionalAction.Invoke();
        }
    }

    /// <summary>
    /// Asserts that a command is valid
    /// </summary>
    /// <param name="command"></param>
    /// <param name="validatorFactory"></param>
    /// <param name="expectedErrors"></param>
    /// <typeparam name="TCommand"></typeparam>
    /// <typeparam name="TResult"></typeparam>
    public static void Validate_Command<TCommand, TResult>(
        TCommand command, Func<IValidator<TCommand>> validatorFactory, string[]? expectedErrors)
        where TCommand : IRequest<TResult>
    {
        IValidator<TCommand> validator = validatorFactory.Invoke();
        ValidationResult validationResult = validator.Validate(command);

        validationResult.FluentValidation(expectedErrors);
    }

    /// <summary>
    /// Asserts that a command is valid
    /// </summary>
    /// <param name="command"></param>
    /// <param name="validatorFactory"></param>
    /// <param name="expectedErrors"></param>
    /// <typeparam name="TCommand"></typeparam>
    public static void Validate_Command<TCommand>(
        TCommand command, Func<IValidator<TCommand>> validatorFactory, string[]? expectedErrors)
        where TCommand : IRequest
    {
        IValidator<TCommand> validator = validatorFactory.Invoke();
        ValidationResult validationResult = validator.Validate(command);

        validationResult.FluentValidation(expectedErrors);
    }

    /// <summary>
    /// Asserts that a command is valid
    /// </summary>
    /// <param name="validationResult"></param>
    /// <param name="expectedErrors"></param>
    private static void FluentValidation(this ValidationResult validationResult, string[]? expectedErrors)
    {
        if (expectedErrors == null)
        {
            Assert.IsTrue(validationResult.IsValid);
        }
        else
        {
            Assert.IsFalse(validationResult.IsValid);
            Assert.IsTrue(validationResult.Errors.All(item => expectedErrors.Contains(item.ErrorMessage)));
        }
    }
}