using System.Linq.Expressions;
using CommonModule.Shared.Common.BaseInterfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Interfaces;

public interface IEntityValidator<TDataContext> where TDataContext : DbContext
{
    Task ValidateExistParamAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, string customErrorMessage,
        CancellationToken cancellationToken) where TEntity : class;
    void ValidateRequest<TCommand, TResult>(TCommand command, Func<IValidator<TCommand>> validatorFactory) where TCommand : IRequest<TResult>;
    void ValidateVoidRequest<TCommand>(TCommand command, Func<IValidator<TCommand>> validatorFactory) where TCommand : IRequest;
}