using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class RemoveUserProfileItemCommandHandler(
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> userProfileItemRepository)
    : RemoveProfileGenericItemHandler<RemoveUserProfileItemCommand, UserProfileItemEntity>(currentUserRepository,
        userProfileItemRepository);