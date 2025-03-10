using System.Net;
using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Core.Mediatr;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Responses.AuthGateway.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class CurrentUserRequestHandler: MediatrAuthBase, IRequestHandler<CurrentUserRequest, UserResponse>
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;

    public CurrentUserRequestHandler(
        ICurrentUserRepository currentUserRepository,
        IMapper mapper, 
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository): base(currentUserRepository)
    {
        _mapper = mapper;
        _genericUserRepository = genericUserRepository;
    }
    
    public async Task<UserResponse> Handle(CurrentUserRequest request, CancellationToken cancellationToken)
    {
        Guid userId = await CurrentUserIdAsync();
        
        UserEntity? user = await _genericUserRepository.ByIdAsync(userId, cancellationToken, 
            user => 
                user
                    .Include(u => u.Roles)
                    .ThenInclude(ur => ur.Role)
                    .Include(u => u.UserSetting));
        if (user == null)
        {
            throw new EntityNotFoundException();
        }

        user.CheckInvalidStatus();
        
        UserResponse response = _mapper.Map<UserEntity, UserResponse>(user);

        return response;
    }
}