using CommonModule.Shared.Responses.Dictionaries;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Dictionaries;

public sealed class SiteSettingsResponseType : ObjectGraphType<SiteSettingsResponse>
{
    public SiteSettingsResponseType()
    {
        Field<CacheVersionResponseType>(
            name: "version",
            resolve: context => context.Source.Version
        );
    }
}

public sealed class CacheVersionResponseType : ObjectGraphType<CacheVersionResponse>
{
    public CacheVersionResponseType()
    {
        Field(x => x.LocalizationPublic, nullable: true);
        Field(x => x.Localization, nullable: true);
    }
}