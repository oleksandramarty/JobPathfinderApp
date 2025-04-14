using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.AuthGateway.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class UserByIdRequestHandler: IRequestHandler<UserByIdRequest, UserResponse>
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;

    public UserByIdRequestHandler(
        ICurrentUserRepository currentUserRepository,
        IMapper mapper, 
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository)
    {
        _mapper = mapper;
        _genericUserRepository = genericUserRepository;
    }
    
    public async Task<UserResponse> Handle(UserByIdRequest request, CancellationToken cancellationToken)
    {
        UserEntity? user = await _genericUserRepository.ByIdAsync(request.Id, cancellationToken, 
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

        user.CheckInvalidStatus();
        
        UserResponse response = _mapper.Map<UserEntity, UserResponse>(user);

        return response;
    }
}