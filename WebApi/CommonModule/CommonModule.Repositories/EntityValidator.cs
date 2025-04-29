using System.Linq.Expressions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Repositories;

public class EntityValidator<TDataContext> : IEntityValidator<TDataContext> where TDataContext : DbContext
{
    private readonly TDataContext _dataContext;

    public EntityValidator(TDataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task ValidateExistParamAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, string customErrorMessage, CancellationToken cancellationToken) where TEntity : class
    {
        TEntity? entity = await _dataContext.Set<TEntity>().FirstOrDefaultAsync(predicate, cancellationToken);

        if (entity != null)
        {
            throw new Exception(!string.IsNullOrEmpty(customErrorMessage) ? customErrorMessage : ErrorMessages.EntityAlreadyExists);
        }
    }

    public void ValidateRequest<TCommand, TResult>(TCommand command, Func<IValidator<TCommand>> validatorFactory) where TCommand : IRequest<TResult>
    {
        FluentValidation(validatorFactory.Invoke(), command);
    }
    
    public void ValidateVoidRequest<TCommand>(TCommand command, Func<IValidator<TCommand>> validatorFactory) where TCommand : IRequest
    {
        FluentValidation(validatorFactory.Invoke(), command);
    }

    private void FluentValidation<TCommand>(IValidator<TCommand> validator, TCommand command)
    {
        ValidationResult validationResult = validator.Validate(command);

        if (validationResult.IsValid)
        {
            return;
        }

        throw new Exception(ErrorMessages.ValidationError);
    }
}