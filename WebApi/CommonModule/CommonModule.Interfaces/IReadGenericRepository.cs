using System.Linq.Expressions;
using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Interfaces;

public interface IReadGenericRepository<TEntityId, TEntity, TDataContext>
    where TEntity : class
    where TDataContext : DbContext
{
    Task<TEntity> ByIdAsync(TEntityId id, CancellationToken cancellationToken,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs);
    Task<TEntity> Async(Expression<Func<TEntity, bool>> condition,  CancellationToken cancellationToken,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs);
    Task<List<TEntity>> ListAsync(
        Expression<Func<TEntity, bool>>? condition,  
        CancellationToken cancellationToken,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs);
    
    IQueryable<TEntity> Queryable(
        Expression<Func<TEntity, bool>>? condition,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs);
}