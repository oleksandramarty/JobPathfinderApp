using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class CreateUserSettingCommandHandler: IRequestHandler<CreateUserSettingCommand, BaseEntityIdResponse<Guid>>
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IEntityValidator<AuthGatewayDataContext> _entityValidator;
    private readonly IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> _genericUserSettingRepository;
    
    public CreateUserSettingCommandHandler(
        IMapper mapper,
        ICurrentUserRepository currentUserRepository, 
        IEntityValidator<AuthGatewayDataContext> entityValidator,
        IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> genericUserSettingRepository
        )
    {
        _mapper = mapper;
        _currentUserRepository = currentUserRepository;
        _entityValidator = entityValidator;
        _genericUserSettingRepository = genericUserSettingRepository;
    }
    
    public async Task<BaseEntityIdResponse<Guid>> Handle(CreateUserSettingCommand command, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }
        
        UserSettingEntity toAdd = _mapper.Map<UserSettingEntity>(command);
        
        await _genericUserSettingRepository.AddAsync(
            toAdd,
            cancellationToken
        );

        return new BaseEntityIdResponse<Guid>
        {
            Id = toAdd.Id
        };
    }
}