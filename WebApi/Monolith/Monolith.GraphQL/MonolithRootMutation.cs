using CommonModule.GraphQL.MutationResolver;

namespace Monolith.GraphQL;

public class MonolithRootMutation: GraphQlMutationHelper
{
    public MonolithRootMutation()
    {
        Name = "Mutation";
        AddMonolithMutations();
    }
}