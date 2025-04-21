using CommonModule.GraphQL.QueryResolver;

namespace Monolith.GraphQL;

public class MonolithRootQuery : GraphQlQueryHelper
{
    public MonolithRootQuery()
    {
        AddMonolithQueries();
    }
}