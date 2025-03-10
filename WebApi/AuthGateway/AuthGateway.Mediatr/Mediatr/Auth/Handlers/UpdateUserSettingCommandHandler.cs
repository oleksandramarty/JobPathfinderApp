using AuthGateway.Domain;
using AuthGateway.Domain.Models.Users;
using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Handlers;

public class UpdateUserSettingCommandHandler: IRequestHandler<UpdateUserSettingCommand>
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> _genericUserSettingRepository;
    
    public UpdateUserSettingCommandHandler(
        IMapper mapper,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, UserSettingEntity, AuthGatewayDataContext> genericUserSettingRepository
        )
    {
        _mapper = mapper;
        _currentUserRepository = currentUserRepository;
        _genericUserSettingRepository = genericUserSettingRepository;
    }
    
    public async Task Handle(UpdateUserSettingCommand command, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }

        UserSettingEntity? userSetting = await _genericUserSettingRepository.ByIdAsync(command.Id, cancellationToken);
        if (userSetting == null)
        {
            throw new EntityNotFoundException();
        }

        UserSettingEntity? updatedUserSettingEntity = _mapper.Map(command, userSetting);
        if (updatedUserSettingEntity == null)
        {
            throw new InvalidOperationException("User can update only own settings");
        }
            
        await _genericUserSettingRepository.UpdateAsync(
            updatedUserSettingEntity,
            cancellationToken
        );
    }
}