using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CommonModule.Core.Attributes;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
public class UserInRoleAttribute : Attribute, IAuthorizationFilter
{
    private readonly UserRoleEnum[] _roles;

    public UserInRoleAttribute(params UserRoleEnum[] roles)
    {
        _roles = roles;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (!user.Identity?.IsAuthenticated ?? false)
        {
            context.Result = new ForbidResult();
            return;
        }

        var roleString = user.FindFirst(AuthClaims.Role)?.Value;
        if (string.IsNullOrEmpty(roleString) || !Enum.TryParse<UserRoleEnum>(roleString, out var role) || !_roles.Contains(role))
        {
            context.Result = new ForbidResult();
        }
    }
}