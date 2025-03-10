using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Repositories;

public class RedisCacheRepository<TEntityId, TEntity> : ICacheRepository<TEntityId, TEntity>
    where TEntityId : notnull
    where TEntity : class, IBaseIdEntity<TEntityId>
{
    private readonly ICacheBaseRepository<TEntityId> _cacheBaseRepository;
    private readonly string _dictionaryName;

    public RedisCacheRepository(
        ICacheBaseRepository<TEntityId> cacheBaseRepository
        )
    {
        _cacheBaseRepository = cacheBaseRepository;
        _dictionaryName = typeof(TEntity).Name.Replace("Entity", "").ToLower();
    }

    public async Task<List<TEntity>?> ItemsFromCacheAsync()
    {
        IEnumerable<string> items = await _cacheBaseRepository.ItemsFromCacheAsync(_dictionaryName);

        return items
            .Select(result => JsonSerializerExtension.FromString<TEntity?>(result))
            .Where(entity => entity != null)
            .ToList();
    }

    private IEnumerable<RedisKey> AllKeys()
    {
        return _cacheBaseRepository.AllKeys(_dictionaryName);
    }

    public async Task ReinitializeDictionaryAsync(List<TEntity> values)
    {
        await _cacheBaseRepository.ReinitializeDictionaryAsync(_dictionaryName, values.ToDictionary(item => item.Id, item => JsonSerializerExtension.ToString(item)));
    }

    public async Task<string> CacheVersionAsync()
    {
        string? version = await _cacheBaseRepository.CacheVersionAsync(_dictionaryName);

        if (string.IsNullOrEmpty(version))
        {
            await _cacheBaseRepository.SetCacheVersionAsync(_dictionaryName);
        }
        
        version = await _cacheBaseRepository.CacheVersionAsync(_dictionaryName);

        if (string.IsNullOrEmpty(version))
        {
            throw new VersionException();
        }

        return version;
    }

    public async Task SetCacheVersionAsync()
    {
        await _cacheBaseRepository.SetCacheVersionAsync(_dictionaryName);
    }
}