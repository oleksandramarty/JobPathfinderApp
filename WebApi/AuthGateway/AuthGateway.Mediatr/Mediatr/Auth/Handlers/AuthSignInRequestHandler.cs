using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using AuthGateway.Mediatr.Validators.Auth;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Responses.AuthGateway;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class AuthSignInRequestHandler : IRequestHandler<AuthSignInRequest, JwtTokenResponse>
{
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;
    private readonly IEntityValidator<AuthGatewayDataContext> _entityValidator;
    private readonly ITokenRepository _tokenRepository;
    private readonly IJwtTokenFactory _jwtTokenFactory;

    public AuthSignInRequestHandler(
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository,
        IEntityValidator<AuthGatewayDataContext> entityValidator,
        ITokenRepository tokenRepository,
        IJwtTokenFactory jwtTokenFactory)
    {
        _genericUserRepository = genericUserRepository;
        _entityValidator = entityValidator;
        _tokenRepository = tokenRepository;
        _jwtTokenFactory = jwtTokenFactory;
    }

    public async Task<JwtTokenResponse> Handle(AuthSignInRequest request, CancellationToken cancellationToken)
    {
        _entityValidator.ValidateRequest<AuthSignInRequest, JwtTokenResponse>(request,
            () => new AuthSignInRequestValidator());

        UserEntity user = await _genericUserRepository.Async(u =>
                u.Email == request.Login ||
                u.Login == request.Login,
            cancellationToken,
            user => user.Include(u => u.Roles).ThenInclude(ur => ur.Role));
        if (user == null)
        {
            throw new EntityNotFoundException();
        }
        
        user.CheckInvalidStatus();

        var hashedPassword = _jwtTokenFactory.HashPassword(request.Password, user.Salt);
        if (hashedPassword != user.PasswordHash)
        {
            throw new AuthException(ErrorMessages.WrongAuth, StatusCodes.Status403Forbidden);
        }

        var token = _jwtTokenFactory.GenerateJwtToken(
            user.Id,
            user.Login,
            user.Email,
            string.Join(",", user.Roles.Select(r => r.Role?.Title)),
            request.RememberMe);

        await _tokenRepository.AddTokenAsync(token,
            request.RememberMe ? TimeSpan.FromDays(30) : TimeSpan.FromDays(1));

        return new JwtTokenResponse
        {
            Token = token
        };
    }
}