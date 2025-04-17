using CommonModule.Interfaces;
using CommonModule.Shared.Common;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace CommonModule.Repositories;

public class RedisTokenRepository : AuditableNonNullableKey, ITokenRepository
{
    private readonly IDatabase _database;
    private readonly IJwtTokenFactory _jwtTokenFactory;

    public RedisTokenRepository(
        IConnectionMultiplexer connectionMultiplexer,
        IConfiguration configuration,
        IJwtTokenFactory jwtTokenFactory)
    {
        _database = connectionMultiplexer.GetDatabase();
        _jwtTokenFactory = jwtTokenFactory;

        Key = configuration["Redis:InstanceNameToken"] ?? string.Empty;
    }

    public async Task AddTokenAsync(string token, TimeSpan expiration)
    {
        string key = $"{Key}:{_jwtTokenFactory.UserIdFromToken(token)}:{token}";
        await _database.StringSetAsync(key, "valid", expiration);
    }

    public async Task<bool> IsTokenValidAsync(string token)
    {
        string key = $"{Key}:{_jwtTokenFactory.UserIdFromToken(token)}:{token}";
        return await _database.KeyExistsAsync(key);
    }

    public async Task DeleteTokenAsync(string token)
    {
        string key = $"{Key}:{_jwtTokenFactory.UserIdFromToken(token)}:{token}";
        await _database.KeyDeleteAsync(key);
    }

    public async Task DeleteUserTokenAsync(Guid userId)
    {
        string pattern = $"{Key}:{userId.ToString()}:*";
        var keys = _database.Multiplexer.GetServer(_database.Multiplexer.GetEndPoints()[0]).Keys(pattern: pattern);
        foreach (var key in keys)
        {
            await _database.KeyDeleteAsync(key);
        }
    }

    public async Task DeleteAllTokensAsync(Guid userId)
    {
        string key = $"{Key}:{userId.ToString()}:*";
        var keys = _database.Multiplexer.GetServer(_database.Multiplexer.GetEndPoints()[0]).Keys(pattern: key);
        foreach (var redisKey in keys)
        {
            await _database.KeyDeleteAsync(redisKey);
        }
    }

    public bool IsTokenExpired(string token)
    {
        string key = $"{Key}:{_jwtTokenFactory.UserIdFromToken(token)}:{token}";
        return !_database.KeyExists(key);
    }
}