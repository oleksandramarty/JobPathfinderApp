using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class DeleteUserProfileItemCommandHandler(
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> userProfileItemRepository)
    : DeleteProfileGenericItemHandler<DeleteUserProfileItemCommand, UserProfileItemEntity>(currentUserRepository,
        userProfileItemRepository);