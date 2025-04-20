using CommonModule.GraphQL.QueryResolver;

namespace Profile.GraphQL;

public class ProfileRootQuery : GraphQlQueryHelper
{
    public ProfileRootQuery()
    {
        AddProfileQueries();
    }
}