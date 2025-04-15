using CommonModule.Shared.Responses.Localizations;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Localizations;

public sealed class LocalizationsResponseType : ObjectGraphType<LocalizationsResponse>
{
    public LocalizationsResponseType()
    {
        Field(x => x.Version);
        Field<ListGraphType<LocalizationResponseType>>(
            name: "data",
            resolve: context => context.Source.Data
        );
    }
}

public sealed class LocalizationResponseType : ObjectGraphType<LocalizationResponse>
{
    public LocalizationResponseType()
    {
        Field(x => x.Locale);
        Field<ListGraphType<LocalizationItemResponseType>>(
            name: "items",
            resolve: context => context.Source.Items
        );
    }
}

public sealed class LocalizationItemResponseType : ObjectGraphType<LocalizationItemResponse>
{
    public LocalizationItemResponseType()
    {
        Field(x => x.Key);
        Field(x => x.Value);
    }
}