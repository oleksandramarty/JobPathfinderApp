using AutoMapper;

namespace Profile.Mediatr;

public class MappingProfileProfile: AutoMapper.Profile
{
    public MappingProfileProfile()
    {
        // CreateMap<AddOrUpdateUserSkillCommand, UserSkillEntity>()
        //     .ForMember(dest => dest.Id, opt => opt.Ignore())
        //     .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active));
        // CreateMap<AddOrUpdateUserLanguageCommand, UserLanguageEntity>()
        //     .ForMember(dest => dest.Id, opt => opt.Ignore())
        //     .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active));
        // CreateMap<AddOrUpdateUserProfileItemCommand, UserProfileItemEntity>()
        //     .ForMember(dest => dest.Id, opt => opt.Ignore())
        //     .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active));

    }
}