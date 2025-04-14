using AutoMapper;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Profile.Profile;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr;

public class MappingProfileProfile: AutoMapper.Profile
{
    public MappingProfileProfile()
    {
        CreateMap<UserSkillEntity, UserSkillResponse>();
        CreateMap<UserLanguageEntity, UserLanguageResponse>();
        CreateMap<UserProfileItemEntity, UserProfileItemResponse>();
        
        CreateMap<AddUserSkillCommand, UserSkillEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active))
            .AfterMap((src, dest) =>
            {
                dest.Id = Guid.NewGuid();
                dest.Status = StatusEnum.Active;
            });
        CreateMap<AddUserLanguageCommand, UserLanguageEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active))
            .AfterMap((src, dest) =>
            {
                dest.Id = Guid.NewGuid();
                dest.Status = StatusEnum.Active;
            });
        CreateMap<AddUserProfileItemCommand, UserProfileItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active))
            .AfterMap((src, dest) =>
            {
                dest.Id = Guid.NewGuid();
                dest.Status = StatusEnum.Active;
            });

        CreateMap<UpdateUserSkillCommand, UserSkillEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<UpdateUserLanguageCommand, UserLanguageEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<UpdateUserProfileItemCommand, UserProfileItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());
    }
}