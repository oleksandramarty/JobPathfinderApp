using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Interfaces;

public interface ICacheRepository<TEntityId, TEntity>
    where TEntityId : notnull
    where TEntity : class, IBaseIdEntity<TEntityId>
{
    Task<List<TEntity>?> ItemsFromCacheAsync();
    Task ReinitializeDictionaryAsync(List<TEntity> values);
    Task<string> CacheVersionAsync();
    Task SetCacheVersionAsync();
}