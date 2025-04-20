using CommonModule.Shared.Responses.Base;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Base;

public sealed class BaseEntityIdOfGuidResponseType: ObjectGraphType<BaseEntityIdResponse<Guid>>
{
    public BaseEntityIdOfGuidResponseType()
    {
        Field(x => x.Id);
    }
}