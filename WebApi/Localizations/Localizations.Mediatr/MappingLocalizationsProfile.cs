using AutoMapper;
using CommonModule.Shared.Responses.Localizations.Models.Locales;
using Localizations.Domain.Models.Locales;

namespace Localizations.Mediatr;

public class MappingLocalizationsProfile: Profile
{
    public MappingLocalizationsProfile()
    {
        CreateMap<LocaleEntity, LocaleResponse>();
        CreateMap<LocalizationEntity, LocalizationResponse>();
    }
}