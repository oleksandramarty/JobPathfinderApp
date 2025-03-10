using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CommonModule.Repositories;

public class JwtTokenFactory: IJwtTokenFactory
{
    private readonly IConfiguration _configuration;
    
    public JwtTokenFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public string GenerateSalt()
    {
        var rng = new RNGCryptoServiceProvider();
        var saltBytes = new byte[32]; // Increased salt size to 32 bytes
        rng.GetBytes(saltBytes);
        return Convert.ToBase64String(saltBytes);
    }

    public string HashPassword(string password, string salt)
    {
        var iterations = 50000; // Increased iterations to 50000
        using (var pbkdf2 = new Rfc2898DeriveBytes(password, Convert.FromBase64String(salt), iterations, HashAlgorithmName.SHA256))
        {
            return Convert.ToBase64String(pbkdf2.GetBytes(32)); // Increased hash size to 32 bytes
        }
    }
    
    public string GenerateJwtToken(
        Guid? userId,
        string login,
        string email,
        string roles,
        bool rememberMe = false,
        ClaimsIdentity? additionalClaims = null)
    {
        if (userId == null)
        {
            throw new EntityNotFoundException();
        }
        var tokenHandler = new JwtSecurityTokenHandler();
        string? secretKey = _configuration["Authentication:Jwt:SecretKey"];
        if (string.IsNullOrEmpty(secretKey) || secretKey.Length < 32)
        {
            throw new ArgumentException(ErrorMessages.JwtMinLength);
        }
        byte[] key = secretKey.StringToUtf8Bytes();

        var defaultClaims = new[]
        {
            new Claim(AuthClaims.Login, login),
            new Claim(AuthClaims.Email, email),
            new Claim(AuthClaims.UserId, userId.Value.ToString()),
            new Claim(AuthClaims.Role, roles),
            new Claim(AuthClaims.RememberMe, rememberMe.ToString())
        };

        var claimsIdentity = new ClaimsIdentity();

        if (additionalClaims != null)
        {
            claimsIdentity.AddClaims(additionalClaims.Claims);
        }

        foreach (var claim in defaultClaims)
        {
            if (!claimsIdentity.HasClaim(c => c.Type == claim.Type && c.Value == claim.Value))
            {
                claimsIdentity.AddClaim(claim);
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = claimsIdentity,
            Expires = rememberMe ? DateTime.UtcNow.AddMonths(1) : DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
    public string GenerateNewJwtToken(ClaimsPrincipal user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        var userId = user.FindFirst(AuthClaims.UserId)?.Value;
        var login = user.FindFirst(AuthClaims.Login)?.Value;
        var email = user.FindFirst(AuthClaims.Email)?.Value;
        var roles = user.FindFirst(AuthClaims.Role)?.Value;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(login) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(roles))
        {
            throw new InvalidOperationException(ErrorMessages.JwtUserClaimNotFound);
        }

        var newToken = GenerateJwtToken(
            userId.ConvertTo<Guid>(),
            login,
            email,
            roles,
            false,
            user.Identity as ClaimsIdentity
        );

        return newToken;
    }
    
    public Guid UserIdFromToken(string token)
    {
        var userIdClaim = ClaimValue(token, AuthClaims.UserId);

        if (userIdClaim == null)
        {
            throw new AuthException(ErrorMessages.JwtUserClaimInvalidConversion, StatusCodes.Status409Conflict);
        }

        return userIdClaim.Value.ConvertTo<Guid>();
    }
    
    public bool IsTokenRefreshable(string token)
    {
        var rememberMeClaim = ClaimValue(token, AuthClaims.RememberMe);
        if (!bool.TryParse(rememberMeClaim.Value, out var rememberMe))
        {
            throw new InvalidOperationException(ErrorMessages.JwtUserClaimInvalidConversion);
        }
        
        return rememberMe;
    }

    private Claim ClaimValue(string token, string claimName)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(token);

        var userClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == claimName);
        if (userClaim == null)
        {
            throw new InvalidOperationException(ErrorMessages.JwtUserClaimNotFound);
        }

        return userClaim;
    }
}