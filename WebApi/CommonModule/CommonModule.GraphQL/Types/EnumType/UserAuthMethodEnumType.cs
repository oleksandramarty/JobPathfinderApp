using CommonModule.Shared.Enums;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.EnumType;

public class UserAuthMethodEnumType: EnumerationGraphType<UserAuthMethodEnum>
{
    public UserAuthMethodEnumType()
    {
        Name = "UserAuthMethodEnum";
        Description = "Enumeration for user auth method types.";
    }
}
