using CommonModule.GraphQL.MutationResolver;

namespace Profile.GraphQL;

public class ProfileRootMutation: GraphQlMutationHelper
{
    public ProfileRootMutation()
    {
        Name = "Mutation";
        AddProfileMutations();
    }
}