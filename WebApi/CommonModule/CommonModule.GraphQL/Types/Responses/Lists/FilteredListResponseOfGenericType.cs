using CommonModule.GraphQL.Types.Common;
using CommonModule.Shared.Responses.Base;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Lists;

public sealed class FilteredListResponseOfGenericType<TEntityResponse, TEntityResponseType>: ObjectGraphType<FilteredListResponse<TEntityResponse>>
    where TEntityResponseType: ObjectGraphType<TEntityResponse>
{
    public FilteredListResponseOfGenericType()
    {
        Field<ListGraphType<TEntityResponseType>>("entities", resolve: context => context.Source.Entities);
        Field<PaginatorEntityType>("paginator", resolve: context => context.Source.Paginator);
        Field(x => x.TotalCount);
    }
}