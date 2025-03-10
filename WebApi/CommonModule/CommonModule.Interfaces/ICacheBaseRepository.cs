using CommonModule.Shared.Common.BaseInterfaces;
using StackExchange.Redis;

namespace CommonModule.Interfaces;

public interface ICacheBaseRepository<TEntityId> where TEntityId : notnull
{
    Task<IEnumerable<string>> ItemsFromCacheAsync(string dictionaryName);
    IEnumerable<RedisKey> AllKeys(string dictionaryName);
    Task ReinitializeDictionaryAsync(string dictionaryName, Dictionary<TEntityId, string> dictionary);
    Task<string?> CacheVersionAsync(string dictionaryName);
    Task SetCacheVersionAsync(string dictionaryName);
    Task<string?> ItemFromCacheAsync(string dictionaryName, TEntityId key);
}