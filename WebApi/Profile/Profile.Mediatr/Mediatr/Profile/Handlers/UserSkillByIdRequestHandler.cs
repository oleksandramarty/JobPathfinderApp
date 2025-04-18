using AutoMapper;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Profile.Profile;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UserSkillByIdRequestHandler(
    IMapper mapper,
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> userSkillRepository)
    : UserProfileGenericItemHandler<UserSkillByIdRequest, UserSkillEntity, UserSkillResponse>(mapper, currentUserRepository,
        userSkillRepository);