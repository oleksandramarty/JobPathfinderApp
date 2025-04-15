using CommonModule.Shared.Responses.Base;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Base;

public sealed class BaseBoolResponseType: ObjectGraphType<BaseBoolResponse>
{
    public BaseBoolResponseType()
    {
        Field(x => x.Success);
    }
}