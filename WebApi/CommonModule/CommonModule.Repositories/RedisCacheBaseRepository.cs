using CommonModule.Interfaces;
using CommonModule.Shared.Common;
using CommonModule.Shared.Core;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace CommonModule.Repositories;

public class RedisCacheBaseRepository<TEntity>: AuditableNonNullableKey, ICacheBaseRepository<TEntity> 
    where TEntity : notnull
{
    private readonly IConnectionMultiplexer _connectionMultiplexer;
    private readonly IDatabase _database;

    public RedisCacheBaseRepository(
        IConnectionMultiplexer connectionMultiplexer,
        IConfiguration configuration
        )
    {
        _connectionMultiplexer = connectionMultiplexer;
        _database = connectionMultiplexer.GetDatabase();
        Key = configuration["Redis:InstanceNameDictionary"];
    }

    public async Task<IEnumerable<string>> ItemsFromCacheAsync(string dictionaryName)
    {
        var keys = AllKeys(dictionaryName);
        var tasks = keys.Select(key => _database.StringGetAsync(key)).ToList();
        var results = await Task.WhenAll(tasks);
        
        return results
            .Where(result => !result.IsNullOrEmpty)
            .Select(r => r.ToString());
    }

    public IEnumerable<RedisKey> AllKeys(string dictionaryName)
    {
        var endpoints = _connectionMultiplexer.GetEndPoints();
        var keys = new List<RedisKey>();

        foreach (var endpoint in endpoints)
        {
            var server = _connectionMultiplexer.GetServer(endpoint);
            keys.AddRange(server.Keys(_database.Database, $"{Key}:{dictionaryName}:*"));
        }

        return keys;
    }

    public async Task ReinitializeDictionaryAsync(string dictionaryName, Dictionary<TEntity, string> dictionary)
    {
        await _database.KeyDeleteAsync($"{Key}:{dictionaryName}:*");

        var tasks = dictionary.Select(item =>
        {
            var redisKey = $"{Key}:{dictionaryName}:{item.Key}";
            return _database.StringSetAsync(redisKey, item.Value);
        });

        await Task.WhenAll(tasks);
    }

    public async Task<string?> CacheVersionAsync(string dictionaryName)
    {
        var redisKey = $"version:{dictionaryName.ToLower()}";
        string? version = await _database.StringGetAsync(redisKey);

        return version;
    }

    public async Task SetCacheVersionAsync(string dictionaryName)
    {
        var redisKey = $"version:{dictionaryName.ToLower()}";
        await _database.StringSetAsync(redisKey, VersionExtension.GenerateVersion());
    }

    public async Task<string?> ItemFromCacheAsync(string dictionaryName, TEntity key)
    {
        var redisKey = $"{Key}:{dictionaryName}:{key}";
        return await _database.StringGetAsync(redisKey);
    }
}