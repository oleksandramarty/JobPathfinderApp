using CommonModule.Shared.Enums;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.EnumType;

public class StatusEnumType: EnumerationGraphType<StatusEnum>
{
    public StatusEnumType()
    {
        Name = "StatusEnum";
        Description = "Enumeration for status types.";
    }
}