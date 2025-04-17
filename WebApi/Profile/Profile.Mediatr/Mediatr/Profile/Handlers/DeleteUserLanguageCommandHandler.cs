using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class DeleteUserLanguageCommandHandler(
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> userLanguageRepository)
    : DeleteProfileGenericItemHandler<DeleteUserLanguageCommand, UserLanguageEntity>(currentUserRepository,
        userLanguageRepository);