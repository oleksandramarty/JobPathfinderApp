using CommonModule.GraphQL.QueryResolver;

namespace AuthGateway.GraphQL;

public class AuthGatewayRootQuery : GraphQlQueryHelper
{
    public AuthGatewayRootQuery()
    {
        AddAuthGatewayQueries();
    }
}