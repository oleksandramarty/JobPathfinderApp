using AutoMapper;
using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UpdateUserSkillCommandHandler(
    IMapper mapper,
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> userSkillRepository)
    : UpdateProfileGenericItemHandler<UpdateUserSkillCommand, UserSkillEntity>(mapper, currentUserRepository,
        userSkillRepository);