using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.AuthGateway.Users;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class UserByLoginRequestHandler: IRequestHandler<UserByLoginRequest, UserResponse>
{
    private readonly IMapper _mapper;
    private readonly IReadGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _readGenericUserRepository;

    public UserByLoginRequestHandler(
        IMapper mapper,
        IReadGenericRepository<Guid, UserEntity, AuthGatewayDataContext> readGenericUserRepository
    )
    {
        _mapper = mapper;
        _readGenericUserRepository = readGenericUserRepository;
    }

    public async Task<UserResponse> Handle(UserByLoginRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Login))
        {
            throw new EntityNotFoundException();
        }
        
        UserEntity? user = await _readGenericUserRepository.Async(x => x.Login == request.Login, cancellationToken);

        if (user == null)
        {
            throw new EntityNotFoundException();
        }
        
        return _mapper.Map<UserResponse>(user);
    }
}