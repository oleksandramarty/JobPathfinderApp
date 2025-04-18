using AutoMapper;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Profile.Profile;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UserProfileItemByIdRequestHandler(
    IMapper mapper,
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> userProfileItemRepository)
    : UserProfileGenericItemHandler<UserProfileItemByIdRequest, UserProfileItemEntity, UserProfileItemResponse>(mapper, currentUserRepository,
        userProfileItemRepository);