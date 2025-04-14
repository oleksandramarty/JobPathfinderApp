using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class RemoveUserLanguageCommandHandler(
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> userLanguageRepository)
    : RemoveProfileGenericItemHandler<RemoveUserLanguageCommand, UserLanguageEntity>(currentUserRepository,
        userLanguageRepository);