using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace Monolith.GraphQL;

public class MonolithGraphQLSchema: Schema
{
    public MonolithGraphQLSchema(IServiceProvider serviceProvider) : base(serviceProvider)
    {
        Query = serviceProvider.GetRequiredService<MonolithRootQuery>();
        Mutation = serviceProvider.GetRequiredService<MonolithRootMutation>();
    }
}