using AutoMapper;
using CommonModule.Interfaces;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class AddUserLanguageCommandHandler(
    IMapper mapper,
    ICurrentUserRepository currentUserRepository,
    IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> userLanguageRepository)
    : AddProfileGenericItemHandler<AddUserLanguageCommand, UserLanguageEntity>(mapper, currentUserRepository,
        userLanguageRepository);