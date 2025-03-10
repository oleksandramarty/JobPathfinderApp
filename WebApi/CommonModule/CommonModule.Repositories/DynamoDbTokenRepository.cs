using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CommonModule.Interfaces;
using CommonModule.Shared.Common.Auth;

namespace CommonModule.Repositories;

public class DynamoDbTokenRepository: ITokenRepository
{
    private readonly IDynamoDBContext _context;
    private readonly IAmazonDynamoDB _dynamoDbClient;
    private readonly IJwtTokenFactory _jwtTokenFactory;

    public DynamoDbTokenRepository(
        IAmazonDynamoDB dynamoDbClient, 
        IDynamoDBContext context,
        IJwtTokenFactory jwtTokenFactory)
    {
        _dynamoDbClient = dynamoDbClient;
        _context = context;
        _jwtTokenFactory = jwtTokenFactory;
    }

    public async Task AddTokenAsync(string token, TimeSpan expiration)
    {
        var userId = _jwtTokenFactory.UserIdFromToken(token);
        var tokenItem = new TokenItemEntity()
        {
            UserId = userId,
            Token = token,
            Expiration = DateTime.UtcNow.Add(expiration)
        };

        await _context.SaveAsync(tokenItem);
    }

    public async Task<bool> IsTokenValidAsync(string token)
    {
        var userId = _jwtTokenFactory.UserIdFromToken(token);
        var tokenItem = await _context.LoadAsync<TokenItemEntity>(userId, token);
        return tokenItem != null && tokenItem.Expiration > DateTime.UtcNow;
    }

    public async Task RemoveTokenAsync(string token)
    {
        var userId = _jwtTokenFactory.UserIdFromToken(token);
        await _context.DeleteAsync<TokenItemEntity>(userId, token);
    }

    public async Task RemoveUserTokenAsync(Guid userId)
    {
        var tokens = await _context.QueryAsync<TokenItemEntity>(userId.ToString()).GetRemainingAsync();
        foreach (var token in tokens)
        {
            await _context.DeleteAsync(token);
        }
    }

    public async Task RemoveAllTokensAsync(Guid userId)
    {
        await RemoveUserTokenAsync(userId);
    }

    public bool IsTokenExpired(string token)
    {
        var userId = _jwtTokenFactory.UserIdFromToken(token);
        var tokenItem = _context.LoadAsync<TokenItemEntity>(userId, token).Result;
        return tokenItem == null || tokenItem.Expiration <= DateTime.UtcNow;
    }
}