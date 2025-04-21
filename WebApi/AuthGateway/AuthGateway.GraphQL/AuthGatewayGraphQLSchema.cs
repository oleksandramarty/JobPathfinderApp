using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace AuthGateway.GraphQL;

public class AuthGatewayGraphQLSchema: Schema
{
    public AuthGatewayGraphQLSchema(IServiceProvider serviceProvider) : base(serviceProvider)
    {
        Query = serviceProvider.GetRequiredService<AuthGatewayRootQuery>();
        Mutation = serviceProvider.GetRequiredService<AuthGatewayRootMutation>();
    }
}