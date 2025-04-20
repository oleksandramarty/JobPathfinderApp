using AutoMapper;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Profile.Profile;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UserLanguageByIdRequestHandler(
    IMapper mapper,
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> userLanguageRepository)
    : UserProfileGenericItemHandler<UserLanguageByIdRequest, UserLanguageEntity, UserLanguageResponse>(mapper, currentUserRepository,
        userLanguageRepository);