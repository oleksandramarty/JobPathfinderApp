using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Profile.Domain;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UpdateProfileGenericItemHandler<TUpdateCommand, TEntity>: IRequestHandler<TUpdateCommand, BaseBoolResponse>
where TUpdateCommand : IBaseIdEntity<Guid>, IRequest<BaseBoolResponse>
where TEntity : class, IBaseIdEntity<Guid>, IUserIdEntity
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, TEntity, ProfileDataContext> _genericRepository;
    
    public UpdateProfileGenericItemHandler(
        IMapper mapper,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, TEntity, ProfileDataContext> genericRepository)
    {
        _mapper = mapper;
        _currentUserRepository = currentUserRepository;
        _genericRepository = genericRepository;
    }
    
    public async Task<BaseBoolResponse> Handle(TUpdateCommand command, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }
        
        TEntity? userProfileGenericItem = await _genericRepository.ByIdAsync(command.Id, cancellationToken);
        
        if (userProfileGenericItem == null)
        {
            throw new EntityNotFoundException();
        }
        
        if (userProfileGenericItem.UserId != userId.Value)
        {
            throw new ForbiddenException();
        }
        
        TEntity updatedUserProfileGenericItem = _mapper.Map(command, userProfileGenericItem);
        
        await _genericRepository.UpdateAsync(updatedUserProfileGenericItem, cancellationToken);

        return new BaseBoolResponse();
    }
}