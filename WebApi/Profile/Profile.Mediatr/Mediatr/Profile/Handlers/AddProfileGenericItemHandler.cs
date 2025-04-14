using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Profile.Domain;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class AddProfileGenericItemHandler<TAddCommand, TEntity>: IRequestHandler<TAddCommand, BaseBoolResponse>
where TAddCommand : IRequest<BaseBoolResponse>
where TEntity : class, IBaseIdEntity<Guid>, IUserIdEntity
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, TEntity, ProfileDataContext> _genericRepository;
    
    public AddProfileGenericItemHandler(
        IMapper mapper,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, TEntity, ProfileDataContext> genericRepository)
    {
        _mapper = mapper;
        _currentUserRepository = currentUserRepository;
        _genericRepository = genericRepository;
    }
    
    public async Task<BaseBoolResponse> Handle(TAddCommand command, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }
        
        TEntity userProfileGenericItem = _mapper.Map<TAddCommand, TEntity>(command);
        userProfileGenericItem.UserId = userId.Value;
        
        await _genericRepository.AddAsync(userProfileGenericItem, cancellationToken);

        return new BaseBoolResponse();
    }
}