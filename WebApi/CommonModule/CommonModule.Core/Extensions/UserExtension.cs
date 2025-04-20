using CommonModule.Shared.Enums;

namespace CommonModule.Core.Extensions;

public static class UserExtension
{
    public static int GetRoleId(this UserRoleEnum userRole)
    {
        return (int)userRole;
    }

    public static string FormatUserPhone(this string? phone)
    {
        if (string.IsNullOrEmpty(phone))
            return string.Empty;

        // Remove all non-digit characters
        var digitsOnly = new string(phone.Where(char.IsDigit).ToArray());

        return digitsOnly; // Return the original string if it doesn't match the expected format
    }
}