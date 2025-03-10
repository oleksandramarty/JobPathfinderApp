using System.Security.Claims;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using Microsoft.AspNetCore.Http;

namespace CommonModule.Repositories;

public class CurrentUserRepository : ICurrentUserRepository
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserRepository(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string CurrentToken()
    {
        string? authorizationHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
        return !string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith($"{AuthSchema.Schema} ") ?
            authorizationHeader.Substring($"{AuthSchema.Schema} ".Length).Trim()
            : string.Empty;
    }

    public IEnumerable<Claim>? CurrentClaims()
    {
        return _httpContextAccessor.HttpContext?.User.Claims;
    }

    public Guid? CurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(AuthClaims.UserId);
        if (userIdClaim == null)
        {
            return null;
        }

        if (Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return userId;
        }

        return null;
    }

    public UserRoleEnum CurrentUserRole()
    {
        string? roleString = _httpContextAccessor.HttpContext?.User.FindFirst(AuthClaims.Role)?.Value;
        if (Enum.TryParse<UserRoleEnum>(roleString, out var role))
        {
            return role;
        }

        throw new EntityNotFoundException();
    }

    public Task<string> CurrentTokenAsync()
    {
        var token = CurrentToken();
        return Task.FromResult(token);
    }

    public Task<IEnumerable<Claim>?> CurrentClaimsAsync()
    {
        var claims = CurrentClaims();
        return Task.FromResult(claims);
    }

    public Task<Guid?> CurrentUserIdAsync()
    {
        return Task.FromResult(CurrentUserId());
    }

    public Task<UserRoleEnum> CurrentUserRoleAsync()
    {
        return Task.FromResult(CurrentUserRole());
    }

    public bool IsAuthenticated()
    {
        var currentUserId = CurrentUserId();
        return currentUserId != null;
    }

    public async Task<bool> HasUserInRoleAsync(UserRoleEnum role)
    {
        UserRoleEnum currentUserRole = await CurrentUserRoleAsync();
        return currentUserRole == role;
    }
}