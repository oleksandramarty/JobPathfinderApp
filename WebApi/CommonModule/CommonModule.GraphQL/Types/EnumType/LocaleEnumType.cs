using CommonModule.Shared.Enums;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.EnumType;

public class LocaleEnumType : EnumerationGraphType<LocaleEnum>
{
    public LocaleEnumType()
    {
        Name = "LocaleEnum";
        Description = "Enumeration for locale types.";
    }
}