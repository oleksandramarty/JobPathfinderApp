using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using MediatR;
using Profile.Domain;

namespace Profile.Mediatr.Mediatr.Profile.Handlers;

public class UserProfileGenericItemHandler<TProfileGenericItemByIdRequest, TEntity, TEntityResponse>: IRequestHandler<TProfileGenericItemByIdRequest, TEntityResponse>
    where TProfileGenericItemByIdRequest : IBaseIdEntity<Guid>, IRequest<TEntityResponse>
    where TEntity : class, IBaseIdEntity<Guid>, IUserIdEntity
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserRepository _currentUserRepository;
    private readonly IGenericRepository<Guid, TEntity, ProfileDataContext> _genericRepository;
    
    public UserProfileGenericItemHandler(
        IMapper mapper,
        ICurrentUserRepository currentUserRepository,
        IGenericRepository<Guid, TEntity, ProfileDataContext> genericRepository)
    {
        _mapper = mapper;
        _currentUserRepository = currentUserRepository;
        _genericRepository = genericRepository;
    }
    
    public async Task<TEntityResponse> Handle(TProfileGenericItemByIdRequest request, CancellationToken cancellationToken)
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();
        
        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }
        
        TEntity userProfileGenericItem = await _genericRepository.ByIdAsync(request.Id, cancellationToken);

        if (userProfileGenericItem == null)
        {
            throw new EntityNotFoundException();
        }

        if (userProfileGenericItem.UserId != userId)
        {
            throw new ForbiddenException();
        }
        
        return _mapper.Map<TEntity, TEntityResponse>(userProfileGenericItem);
    }
}