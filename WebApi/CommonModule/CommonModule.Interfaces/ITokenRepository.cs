namespace CommonModule.Interfaces;

public interface ITokenRepository
{
    Task AddTokenAsync(string token, TimeSpan expiration);
    Task<bool> IsTokenValidAsync(string token);
    Task DeleteTokenAsync(string token);
    Task DeleteUserTokenAsync(Guid userId);
    Task DeleteAllTokensAsync(Guid userId);
    bool IsTokenExpired(string token);
}