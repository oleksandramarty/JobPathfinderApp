using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.AuthGateway.Users;

public class UserLoginInputType: InputObjectGraphType
{
    public UserLoginInputType()
    {
        Name = "UserLoginInputType";
        Field<NonNullGraphType<StringGraphType>>("login");
    }
}