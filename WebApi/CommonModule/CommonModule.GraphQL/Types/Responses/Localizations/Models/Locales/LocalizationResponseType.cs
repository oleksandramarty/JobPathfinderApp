using CommonModule.Shared.Responses.Localizations.Models.Locales;
using GraphQL.Types;

namespace CommonModule.GraphQL.Types.Responses.Localizations.Models.Locales;

public sealed class LocalizationResponseType : ObjectGraphType<LocalizationResponse>
{
    public LocalizationResponseType()
    {
        Field(x => x.Id);
        Field(x => x.Key);
        Field(x => x.Value);
        Field(x => x.ValueEn);
        Field(x => x.LocaleId);
        Field(x => x.IsPublic);
    }
}