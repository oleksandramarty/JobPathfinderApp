using CommonModule.Shared.Enums;

namespace CommonModule.Core.Extensions;

public static class UserExtension
{
    public static int GetRoleId(this UserRoleEnum userRole)
    {
        return (int)userRole;
    }
}