using AutoMapper;
using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UpdateUserProfileItemCommandHandler(
    IMapper mapper,
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> userProfileItemRepository)
    : UpdateProfileGenericItemHandler<UpdateUserProfileItemCommand, UserProfileItemEntity>(mapper, currentUserRepository,
        userProfileItemRepository);