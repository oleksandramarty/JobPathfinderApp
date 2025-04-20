using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Profile.Domain;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class CreateProfileGenericItemHandler<TAddCommand, TEntity>: IRequestHandler<TAddCommand, BaseEntityIdResponse<Guid>>
where TAddCommand : IRequest<BaseEntityIdResponse<Guid>>
where TEntity : class, IBaseIdEntity<Guid>, IUserIdEntity
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, TEntity, ProfileDataContext> _genericRepository;
    
    public CreateProfileGenericItemHandler(
        IMapper mapper,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, TEntity, ProfileDataContext> genericRepository)
    {
        _mapper = mapper;
        _currentUserRepository = currentUserRepository;
        _genericRepository = genericRepository;
    }
    
    public async Task<BaseEntityIdResponse<Guid>> Handle(TAddCommand command, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }
        
        TEntity userProfileGenericItem = _mapper.Map<TAddCommand, TEntity>(command);
        userProfileGenericItem.UserId = userId.Value;
        
        await _genericRepository.AddAsync(userProfileGenericItem, cancellationToken);

        return new BaseEntityIdResponse<Guid>
        {
            Id = userProfileGenericItem.Id
        };
    }
}