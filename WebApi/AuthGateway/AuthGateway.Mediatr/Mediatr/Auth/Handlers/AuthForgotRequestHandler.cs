using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Core.Mediatr;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class AuthForgotRequestHandler : MediatrAuthBase, IRequestHandler<AuthForgotRequest>
{
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IEntityValidator<AuthGatewayDataContext> _entityValidator;
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;

    public AuthForgotRequestHandler(
        ICurrentUserRepository currentUserRepository,
        IEntityValidator<AuthGatewayDataContext> entityValidator,
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository
    ) : base(currentUserRepository)
    {
        _entityValidator = entityValidator;
        _genericUserRepository = genericUserRepository;
    }

    public async Task Handle(AuthForgotRequest request, CancellationToken cancellationToken)
    {
        Guid userId = await CurrentUserIdAsync();
        UserEntity? user = await _genericUserRepository.ByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new EntityNotFoundException();
        }

        user.CheckInvalidStatus();

        if (user.LastForgotPasswordRequest.HasValue &&
            user.LastForgotPasswordRequest.Value.AddMinutes(30) > DateTime.UtcNow)
        {
            throw new BusinessException(ErrorMessages.ForgotPasswordRequestTooSoon, StatusCodes.Status409Conflict);
        }

        user.LastForgotPasswordRequest = DateTime.UtcNow;
        await _genericUserRepository.UpdateAsync(user, cancellationToken);

        // TODO Send email
        string restoreLink =
            $"{StringExtension.InterleaveStrings(userId.ToString("N"), Guid.NewGuid().ToString("N"))}" +
            $"&honkler={StringExtension.InterleaveStrings(
                (new DateTimeOffset(user.LastForgotPasswordRequest.Value).ToUnixTimeSeconds()).ToString(),
                (new DateTimeOffset(user.CreatedAt).ToUnixTimeSeconds()).ToString())}";
    }
}