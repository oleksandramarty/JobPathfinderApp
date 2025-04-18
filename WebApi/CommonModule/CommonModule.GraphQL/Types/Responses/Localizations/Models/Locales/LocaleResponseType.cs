using CommonModule.GraphQL.Types.EnumType;
using CommonModule.Shared.Responses.Localizations.Models.Locales;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Localizations.Models.Locales;

public sealed class LocaleResponseType : ObjectGraphType<LocaleResponse>
{
    public LocaleResponseType()
    {
        Field(x => x.Id);
        Field(x => x.IsoCode);
        Field(x => x.Title, nullable: true);
        Field(x => x.TitleEn);
        Field(x => x.TitleNormalized);
        Field(x => x.TitleEnNormalized);
        Field(x => x.IsDefault);
        Field<IntGraphType>(
            nameof(LocaleResponse.Status),
            resolve: context => (int)context.Source.Status
        );
        Field<IntGraphType>(
            nameof(LocaleResponse.LocaleEnum),
            resolve: context => (int)context.Source.LocaleEnum
        );
        Field(x => x.Culture);
    }
}