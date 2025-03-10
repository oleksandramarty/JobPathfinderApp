using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AuthGateway.Mediatr.Validators.Auth;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class AuthRestorePasswordCommandHandler: IRequestHandler<AuthRestorePasswordCommand>
{
    private readonly IMapper _mapper;
    private readonly IEntityValidator<AuthGatewayDataContext> _entityValidator;
    private readonly IJwtTokenFactory _jwtTokenFactory;
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;
    private readonly IGenericRepository<Guid, UserRoleEntity, AuthGatewayDataContext> _genericUserRoleRepository;

    public AuthRestorePasswordCommandHandler(
        IMediator mediator,
        IMapper mapper, 
        IEntityValidator<AuthGatewayDataContext> entityValidator,
        IJwtTokenFactory jwtTokenFactory,
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository,
        IGenericRepository<Guid, UserRoleEntity, AuthGatewayDataContext> genericUserRoleRepository)
    {
        _mapper = mapper;
        _entityValidator = entityValidator;
        _jwtTokenFactory = jwtTokenFactory;
        _genericUserRepository = genericUserRepository;
        _genericUserRoleRepository = genericUserRoleRepository;
    }

    public async Task Handle(AuthRestorePasswordCommand command, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(command.Url))
        {
            throw new AuthException(ErrorMessages.RestorePasswordProcessingIssue, 409);
        }
        
        _entityValidator.ValidateVoidRequest<AuthRestorePasswordCommand>(command, () => new AuthRestorePasswordCommandValidator());
        // TODO restore and check 3 questions
    }
}