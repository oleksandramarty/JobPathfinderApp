using System.Security.Claims;

namespace CommonModule.Interfaces;

public interface IJwtTokenFactory
{
    string GenerateSalt();
    string HashPassword(string password, string salt);
    string GenerateJwtToken(
        Guid? userId,
        string login,
        string email,
        string roles,
        bool rememberMe = false, 
        ClaimsIdentity? additionalClaims = null);

    string GenerateNewJwtToken(ClaimsPrincipal user);

    Guid UserIdFromToken(string token);
    bool IsTokenRefreshable(string token);
}