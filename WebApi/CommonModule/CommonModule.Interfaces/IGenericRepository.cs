using CommonModule.Shared.Common.BaseInterfaces;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Interfaces;

public interface IGenericRepository<TEntityId, TEntity, TDataContext> : IReadGenericRepository<TEntityId, TEntity, TDataContext>
    where TEntity : class, IBaseIdEntity<TEntityId>
    where TDataContext : DbContext
{
    Task AddAsync(TEntity entity, CancellationToken cancellationToken);
    Task UpdateAsync(TEntity entity, CancellationToken cancellationToken);
    Task DeleteAsync(TEntity entity, CancellationToken cancellationToken);
    Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken);
    Task UpdateRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken);
    Task DeleteRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken);
    Task DeleteByIdAsync(TEntityId id, CancellationToken cancellationToken);
    Task DeleteByIdsAsync(List<TEntityId> ids, CancellationToken cancellationToken);
}