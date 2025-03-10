using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Core.Mediatr;

public class MediatrDictionaryBase<TRequest, TEntityId, TEntity, TResponse, TDataContext>: IRequestHandler<TRequest, VersionedListResponse<TResponse>>
    where TEntityId : struct
    where TRequest : IBaseVersionEntity, IRequest<VersionedListResponse<TResponse>>
    where TEntity : class, IBaseIdEntity<TEntityId>, IStatusEntity
    where TResponse : class, IBaseIdEntity<TEntityId>
    where TDataContext : DbContext
{
    private readonly IDictionaryRepository<TEntityId, TEntity, TResponse, TDataContext> _dictionaryRepository;
    
    public MediatrDictionaryBase(IDictionaryRepository<TEntityId, TEntity, TResponse, TDataContext> dictionaryRepository)
    {
        _dictionaryRepository = dictionaryRepository;
    }
    
    public async Task<VersionedListResponse<TResponse>> Handle(TRequest request, CancellationToken cancellationToken)
    {
        return await _dictionaryRepository.DictionaryAsync(request.Version, cancellationToken);
    }
}