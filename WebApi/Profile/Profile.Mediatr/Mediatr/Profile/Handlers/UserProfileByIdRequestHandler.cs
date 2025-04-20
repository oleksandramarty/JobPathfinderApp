using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Profile.Profile;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Profile.Domain;
using Profile.Domain.Models.Profile;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UserProfileByIdRequestHandler: IRequestHandler<UserProfileByIdRequest, UserProfileResponse>
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> _userSkillRepository;
    private readonly IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> _userLanguageRepository;
    private readonly IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> _userProfileItemRepository;
    
    public UserProfileByIdRequestHandler(
        IMapper mapper,
        IGenericRepository<Guid, UserSkillEntity, ProfileDataContext> userSkillRepository,
        IGenericRepository<Guid, UserLanguageEntity, ProfileDataContext> userLanguageRepository,
        IGenericRepository<Guid, UserProfileItemEntity, ProfileDataContext> userProfileItemRepository)
    {
        _mapper = mapper;
        _userSkillRepository = userSkillRepository;
        _userLanguageRepository = userLanguageRepository;
        _userProfileItemRepository = userProfileItemRepository;
    }
    
    public async Task<UserProfileResponse> Handle(UserProfileByIdRequest request, CancellationToken cancellationToken)
    {
        List<UserSkillEntity> userSkills = await _userSkillRepository.ListAsync(x => x.UserId == request.Id, cancellationToken);
        List<UserLanguageEntity> userLanguages = await _userLanguageRepository.ListAsync(x => x.UserId == request.Id, cancellationToken);
        List<UserProfileItemEntity> userProfileItems = await _userProfileItemRepository
            .Queryable(x => x.UserId == request.Id)
            .OrderByDescending(x => x.StartDate)
            .ToListAsync(cancellationToken);

        return new UserProfileResponse
        {
            Skills = userSkills.Select(s => _mapper.Map<UserSkillResponse>(s)).ToList(),
            Languages = userLanguages.Select(l => _mapper.Map<UserLanguageResponse>(l)).ToList(),
            Items = userProfileItems.Select(i => _mapper.Map<UserProfileItemResponse>(i)).ToList()
        };
    }
}
