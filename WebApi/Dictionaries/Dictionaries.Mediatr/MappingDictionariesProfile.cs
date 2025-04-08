using AutoMapper;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using CommonModule.Shared.Responses.Dictionaries.Models.Skills;
using Dictionaries.Domain.Models.Countries;
using Dictionaries.Domain.Models.Skills;

namespace Dictionaries.Mediatr;

public class MappingDictionariesProfile : Profile
{
    public MappingDictionariesProfile()
    {
        CreateMap<CountryEntity, CountryResponse>();
        CreateMap<SkillEntity, SkillResponse>();
    }
}