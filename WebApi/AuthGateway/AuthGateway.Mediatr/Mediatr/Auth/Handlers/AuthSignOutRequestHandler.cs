using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Core.Mediatr;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class AuthSignOutRequestHandler: MediatrAuthBase, IRequestHandler<AuthSignOutRequest, BaseBoolResponse>
{
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;
    private readonly ITokenRepository _tokenRepository;
    
    public AuthSignOutRequestHandler(
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository,
        ITokenRepository tokenRepository): base(currentUserRepository)
    {
        _genericUserRepository = genericUserRepository;
        _tokenRepository = tokenRepository;
    }
    
    
    public async Task<BaseBoolResponse> Handle(AuthSignOutRequest request, CancellationToken cancellationToken)
    {
        Guid userId = await CurrentUserIdAsync();
        UserEntity? user = await _genericUserRepository.ByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new EntityNotFoundException();
        }

        user.CheckInvalidStatus();

        await _tokenRepository.DeleteUserTokenAsync(user.Id);

        return new BaseBoolResponse();
    }
}