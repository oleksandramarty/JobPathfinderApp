using CommonModule.Shared.Common;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Common;

public sealed class PaginatorEntityType: ObjectGraphType<PaginatorEntity>
{
    public PaginatorEntityType()
    {
        Field(x => x.PageNumber);
        Field(x => x.PageSize);
        Field(x => x.IsFull);
    }
}