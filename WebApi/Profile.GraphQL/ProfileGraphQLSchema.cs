using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace Profile.GraphQL;

public class ProfileGraphQLSchema: Schema
{
    public ProfileGraphQLSchema(IServiceProvider serviceProvider) : base(serviceProvider)
    {
        Query = serviceProvider.GetRequiredService<ProfileRootQuery>();
        Mutation = serviceProvider.GetRequiredService<ProfileRootMutation>();
    }
}