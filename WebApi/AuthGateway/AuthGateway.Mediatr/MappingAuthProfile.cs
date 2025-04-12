using AuthGateway.Domain.Models.Profile;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AutoMapper;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.AuthGateway.Users;

namespace AuthGateway.Mediatr;

public class MappingAuthProfile: Profile
{
    public MappingAuthProfile()
    {
        CreateMap<UserEntity, UserResponse>()
            .ForMember(dest => 
                dest.Roles, 
                opt => 
                    opt.MapFrom(src => 
                        src.Roles != null ? 
                            src.Roles.Select(r => 
                                new RoleResponse
                                {
                                    Id = r.Role.Id,
                                    Title = r.Role.Title,
                                    UserRole = r.Role.UserRole
                                }).ToList() : new List<RoleResponse>()));
        CreateMap<RoleEntity, RoleResponse>();
        CreateMap<UserSettingEntity, UserSettingResponse>();
        
        CreateMap<AuthSignUpCommand, UserEntity>()
            .AfterMap((src, dest) =>
            {
                dest.Id = Guid.NewGuid();
                dest.LoginNormalized = src.Login.ToUpper();
                dest.EmailNormalized = src.Email.ToUpper();
                dest.Status = StatusEnum.New;
                dest.IsTemporaryPassword = true;
                dest.AuthType = UserAuthMethodEnum.Base;
            });

        CreateMap<AddOrUpdateUserSkillCommand, UserSkillEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active));
        CreateMap<AddOrUpdateUserLanguageCommand, UserLanguageEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active));
        CreateMap<AddOrUpdateUserProfileItemCommand, UserProfileItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusEnum.Active));

        CreateMap<CreateUserSettingCommand, UserSettingEntity>();
        CreateMap<UpdateUserPreferencesCommand, UserSettingEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore());

    }
}