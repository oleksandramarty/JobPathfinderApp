using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AuthGateway.Mediatr.Validators.Auth;
using AutoMapper;
using CommonModule.Interfaces;
using CommonModule.Shared.Constants;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class AuthSignUpCommandHandler: IRequestHandler<AuthSignUpCommand, BaseEntityIdResponse<Guid>>
{
    private readonly IMapper _mapper;
    private readonly IEntityValidator<AuthGatewayDataContext> _entityValidator;
    private readonly IJwtTokenFactory _jwtTokenFactory;
    private readonly IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> _genericUserRepository;
    private readonly IGenericRepository<Guid, UserRoleEntity, AuthGatewayDataContext> _genericUserRoleRepository;
    private readonly IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> _genericUserSettingRepository;

    public AuthSignUpCommandHandler(
        IMapper mapper,
        IEntityValidator<AuthGatewayDataContext> entityValidator,
        IJwtTokenFactory jwtTokenFactory,
        IGenericRepository<Guid, UserEntity, AuthGatewayDataContext> genericUserRepository,
        IGenericRepository<Guid, UserRoleEntity, AuthGatewayDataContext> genericUserRoleRepository,
        IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> genericUserSettingRepository)
    {
        _mapper = mapper;
        _entityValidator = entityValidator;
        _jwtTokenFactory = jwtTokenFactory;
        _genericUserRepository = genericUserRepository;
        _genericUserRoleRepository = genericUserRoleRepository;
        _genericUserSettingRepository = genericUserSettingRepository;
    }

    public async Task<BaseEntityIdResponse<Guid>> Handle(AuthSignUpCommand command, CancellationToken cancellationToken)
    {
        _entityValidator.ValidateRequest<AuthSignUpCommand, BaseEntityIdResponse<Guid>>(command, () => new AuthSignUpCommandValidator());
        
        await _entityValidator.ValidateExistParamAsync<UserEntity>(
            u => u.Email == command.Email, 
            ErrorMessages.EntityWithEmailAlreadyExists, 
            cancellationToken);
        
        await _entityValidator.ValidateExistParamAsync<UserEntity>(
            u => u.Login == command.Login, 
            ErrorMessages.EntityWithLoginAlreadyExists, 
            cancellationToken);

        UserEntity userEntity = _mapper.Map<AuthSignUpCommand, UserEntity>(command);
        
        userEntity.Id = Guid.NewGuid();
        userEntity.Salt = _jwtTokenFactory.GenerateSalt();
        userEntity.PasswordHash = _jwtTokenFactory.HashPassword(command.Password, userEntity.Salt);
        
        await _genericUserRepository.AddAsync(userEntity, cancellationToken);
        
        await _genericUserRoleRepository.AddAsync(new UserRoleEntity
        {
            RoleId = (int)UserRoleEnum.User,
            UserId = userEntity.Id
        }, cancellationToken);

        await _genericUserSettingRepository.AddAsync(new UserSettingEntity
        {
            DefaultLocale = "en",
            UserId = userEntity.Id,
            ApplicationAiPrompt = false
        }, cancellationToken);

        return new BaseEntityIdResponse<Guid> { Id = userEntity.Id };
    }
}