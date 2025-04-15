using CommonModule.GraphQL.MutationResolver;

namespace AuthGateway.GraphQL;

public class AuthGatewayRootMutation: GraphQlMutationHelper
{
    public AuthGatewayRootMutation()
    {
        Name = "Mutation";
        AddAuthGatewayMutations();
    }
}