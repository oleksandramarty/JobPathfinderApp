using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class RemoveUserSkillCommandHandler(
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> userSkillRepository)
    : RemoveProfileGenericItemHandler<RemoveUserSkillCommand, UserSkillEntity>(currentUserRepository,
        userSkillRepository);