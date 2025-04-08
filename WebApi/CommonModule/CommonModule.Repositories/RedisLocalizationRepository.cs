using CommonModule.Interfaces;
using CommonModule.Shared.Common;
using CommonModule.Shared.Core;
using CommonModule.Shared.Responses.Localizations;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace CommonModule.Repositories;

public class RedisLocalizationRepository : AuditableNonNullableKey, ILocalizationRepository
{
    private readonly IDatabase _database;
    private readonly IConnectionMultiplexer _connectionMultiplexer;
    
    public RedisLocalizationRepository(
        IConnectionMultiplexer connectionMultiplexer,
        IConfiguration configuration)
    {
        _connectionMultiplexer = connectionMultiplexer;
        _database = connectionMultiplexer.GetDatabase();

        Key = configuration["Redis:InstanceNameLocalization"];
    }
    
    public async Task<LocalizationsResponse> LocalizationDataAllAsync(bool isPublic)
    {
        var server = _connectionMultiplexer.GetServer(_connectionMultiplexer.GetEndPoints().First());
        var keys = isPublic
            ? server.Keys(pattern: $"{Key}:*:*:{1}")
            : server.Keys(pattern: $"{Key}:*:*:{0}");

        var data = new Dictionary<string, Dictionary<string, string>>();
        foreach (var key in keys)
        {
            var parts = key.ToString().Split(':');
            string locale = parts[1];
            string subKey = parts[2];
            var value = await _database.StringGetAsync(key);

            if (!data.ContainsKey(locale))
            {
                data[locale] = new Dictionary<string, string>();
            }

            data[locale][subKey] = value.ToString();
        }
        
        LocalizationsResponse response = new LocalizationsResponse();

        foreach (var localeData in data)
        {
            var localizationResponse = new LocalizationResponse(localeData.Key);
            foreach (var item in localeData.Value)
            {
                localizationResponse.Items.Add(new LocalizationItemResponse(item.Key, item.Value));
            }
            response.Data.Add(localizationResponse);
        }
        
        return response;
    }
    
    public async Task ReinitializeLocalizationDataAsync(LocalizationsResponse model, bool isPublic)
    {
        string isPublicString = isPublic ? "1" : "0";
        await _database.KeyDeleteAsync( $"{Key}:*:*:{isPublicString}");

        var tasks = model.Data.SelectMany(value =>
            value.Items.Select(item =>
            {
                var redisKey = $"{Key}:{value.Locale}:{item.Key}:{isPublicString}";
                return _database.StringSetAsync(redisKey, item.Value);
            })
        );

        await Task.WhenAll(tasks);
    }

    public async Task<string> LocalizationVersionAsync(bool isPublic)
    {
        var redisKey = $"version:localization" + (isPublic ? "_public" : string.Empty);
        string? version = await _database.StringGetAsync(redisKey);

        // TODO Warning log about nullable version
        
        return string.IsNullOrEmpty(version) ? VersionExtension.GenerateVersion() : version;
    }
    
    public async Task SetLocalizationVersionAsync(bool isPublic)
    {
        string redisKey = $"version:localization" + (isPublic ? "_public" : string.Empty);
        await _database.StringSetAsync(redisKey, VersionExtension.GenerateVersion());
    }
}