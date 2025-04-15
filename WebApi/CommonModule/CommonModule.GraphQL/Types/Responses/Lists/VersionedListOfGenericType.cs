using CommonModule.Shared.Responses.Base;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Lists;

public sealed class VersionedListOfGenericType<TEntityResponse, TEntityResponseType>: ObjectGraphType<VersionedListResponse<TEntityResponse>>
    where TEntityResponseType: ObjectGraphType<TEntityResponse>
{
    public VersionedListOfGenericType()
    {
        Field<ListGraphType<TEntityResponseType>>("items", resolve: context => context.Source.Items);
        Field(x => x.Version);
    }
}