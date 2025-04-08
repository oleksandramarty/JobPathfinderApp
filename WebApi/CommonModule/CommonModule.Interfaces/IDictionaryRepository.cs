using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Interfaces;

public interface IDictionaryRepository<TEntityId, TEntity, TResponse, TDataContext>
    where TEntityId : struct
    where TEntity : class, IBaseIdEntity<TEntityId>, IStatusEntity
    where TResponse : class, IBaseIdEntity<TEntityId>
    where TDataContext : DbContext
{
    Task<VersionedListResponse<TResponse>> DictionaryAsync(
        string? version, 
        CancellationToken cancellationToken,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs);
}