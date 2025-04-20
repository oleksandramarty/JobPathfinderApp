using CommonModule.GraphQL.Types.EnumType;
using CommonModule.Shared.Enums;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.InputTypes.AuthGateway;

public sealed class AuthSignUpInputType : InputObjectGraphType
{
    public AuthSignUpInputType()
    {
        Name = "AuthSignUpInputType";
        Field<StringGraphType>("firstName");
        Field<StringGraphType>("lastName");
        Field<NonNullGraphType<StringGraphType>>("login");
        Field<NonNullGraphType<StringGraphType>>("email");
        Field<NonNullGraphType<StringGraphType>>("password");
        Field<NonNullGraphType<StringGraphType>>("passwordAgain");
    }
}