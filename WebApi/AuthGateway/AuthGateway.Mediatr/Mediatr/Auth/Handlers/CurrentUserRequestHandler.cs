using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Core.Mediatr;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.AuthGateway.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class CurrentUserRequestHandler: MediatrAuthBase, IRequestHandler<CurrentUserRequest, UserResponse>
{
    private readonly IMapper _mapper;
    private readonly IReadGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _readGenericUserRepository;
    private readonly IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> _genericUserSettingRepository;

    public CurrentUserRequestHandler(
        ICurrentUserRepository currentUserRepository,
        IMapper mapper,
        IReadGenericRepository<Guid, UserEntity, AuthGatewayDataContext> readGenericUserRepository,
        IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> genericUserSettingRepository        
        ): base(currentUserRepository)
    {
        _mapper = mapper;
        _readGenericUserRepository = readGenericUserRepository;
        _genericUserSettingRepository = genericUserSettingRepository;
    }
    
    public async Task<UserResponse> Handle(CurrentUserRequest request, CancellationToken cancellationToken)
    {
        Guid userId = await CurrentUserIdAsync();
        
        UserEntity? user = await _readGenericUserRepository.ByIdAsync(userId, cancellationToken, 
            user => 
                user
                    .Include(u => u.Roles)
                    .ThenInclude(ur => ur.Role)
                    .Include(u => u.UserSetting)
                );
        
        if (user == null)
        {
            throw new EntityNotFoundException();
        }
        
        if (user.UserSetting == null)
        {
            UserSettingEntity userSetting = new UserSettingEntity
            {
                DefaultLocale = "en",
                ApplicationAiPrompt = false,
                UserId = userId,
                ShowCurrentPosition = false,
                ShowHighestEducation = false
            };
            
            await _genericUserSettingRepository.AddAsync(
                userSetting,
                cancellationToken
            );
            
            user.UserSetting = userSetting;
        }

        user.CheckInvalidStatus();
        
        UserResponse response = _mapper.Map<UserEntity, UserResponse>(user);

        return response;
    }
}
