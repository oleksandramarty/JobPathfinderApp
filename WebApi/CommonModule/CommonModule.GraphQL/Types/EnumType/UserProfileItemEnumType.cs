using CommonModule.Shared.Enums.Users;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.EnumType;

public class UserProfileItemEnumType: EnumerationGraphType<UserProfileItemEnum>
{
    public UserProfileItemEnumType()
    {
        Name = "UserProfileItemEnum";
        Description = "Enumeration for user profile types.";
    }
}
