using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Profile.Domain;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class RemoveProfileGenericItemHandler<TRemoveCommand, TEntity>: IRequestHandler<TRemoveCommand, BaseBoolResponse>
    where TRemoveCommand : IBaseIdEntity<Guid>, IRequest<BaseBoolResponse>
    where TEntity : class, IBaseIdEntity<Guid>, IUserIdEntity
{
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, TEntity, ProfileDataContext> _genericRepository;
    
    public RemoveProfileGenericItemHandler(
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, TEntity, ProfileDataContext> genericRepository)
    {
        _currentUserRepository = currentUserRepository;
        _genericRepository = genericRepository;
    }
    
    public async Task<BaseBoolResponse> Handle(TRemoveCommand command, CancellationToken cancellationToken)
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
        
        await _genericRepository.DeleteAsync(userProfileGenericItem, cancellationToken);

        return new BaseBoolResponse();
    }
}