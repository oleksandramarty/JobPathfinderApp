using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Core.Mediatr;

public class MediatrTreeDictionaryBase<TRequest, TEntityId, TParentId, TEntity, TResponse, TDataContext>: IRequestHandler<TRequest, VersionedListResponse<TResponse>>
    where TEntityId : struct
    where TRequest : IBaseVersionEntity, IRequest<VersionedListResponse<TResponse>>
    where TEntity : class, ITreeEntityEntity<TEntityId, TParentId>, IStatusEntity
    where TResponse : class, ITreeChildrenEntity<TResponse>
    where TDataContext : DbContext
{
    private readonly ITreeDictionaryRepository<TEntityId, TParentId, TEntity, TResponse, TDataContext> _treeDictionaryRepository;
    
    public MediatrTreeDictionaryBase(ITreeDictionaryRepository<TEntityId, TParentId, TEntity, TResponse, TDataContext> treeDictionaryRepository)
    {
        _treeDictionaryRepository = treeDictionaryRepository;
    }
    
    public async Task<VersionedListResponse<TResponse>> Handle(TRequest request, CancellationToken cancellationToken)
    {
        return await _treeDictionaryRepository.TreeDictionaryAsync(request.Version, cancellationToken);
    }
}