using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.Profile;

public class UserProfileInputType: InputObjectGraphType
{
    public UserProfileInputType()
    {
        Name = "UserProfileInputType";
        Field<NonNullGraphType<StringGraphType>>("login");
    }
}