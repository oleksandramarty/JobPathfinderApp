using System.Security.Claims;
using CommonModule.Shared.Enums;

namespace CommonModule.Interfaces;

public interface ICurrentUserRepository
{
    string CurrentToken();
    IEnumerable<Claim>? CurrentClaims();
    Guid? CurrentUserId();
    UserRoleEnum CurrentUserRole();

    Task<string> CurrentTokenAsync();
    Task<IEnumerable<Claim>?> CurrentClaimsAsync();
    Task<Guid?> CurrentUserIdAsync();
    Task<UserRoleEnum> CurrentUserRoleAsync();
        
    bool IsAuthenticated();

    Task<bool> HasUserInRoleAsync(UserRoleEnum role);
}