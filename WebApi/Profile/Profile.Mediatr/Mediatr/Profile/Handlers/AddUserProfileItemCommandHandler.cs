using AutoMapper;
using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class AddUserProfileItemCommandHandler(
    IMapper mapper,
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> userProfileItemRepository)
    : AddProfileGenericItemHandler<AddUserProfileItemCommand, UserProfileItemEntity>(mapper, currentUserRepository,
        userProfileItemRepository);