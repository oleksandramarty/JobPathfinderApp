using CommonModule.Shared.Enums;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.EnumType;

public class UserRoleEnumType : EnumerationGraphType<UserRoleEnum>
{
    public UserRoleEnumType()
    {
        Name = "UserRole";
        Description = "The roles available for a user.";
    }
}