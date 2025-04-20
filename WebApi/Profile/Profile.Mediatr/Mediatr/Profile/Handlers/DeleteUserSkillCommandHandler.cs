using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class DeleteUserSkillCommandHandler(
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> userSkillRepository)
    : DeleteProfileGenericItemHandler<DeleteUserSkillCommand, UserSkillEntity>(currentUserRepository,
        userSkillRepository);