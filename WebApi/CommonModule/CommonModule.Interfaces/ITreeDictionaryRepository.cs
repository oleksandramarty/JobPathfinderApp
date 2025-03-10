using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Interfaces;

public interface ITreeDictionaryRepository<TEntityId, TEntityParentId, TEntity, TResponse, TDataContext>
    where TEntity : class, ITreeEntityEntity<TEntityId, TEntityParentId>, IStatusEntity
    where TResponse : class, ITreeChildrenEntity<TResponse>
    where TDataContext : DbContext
{
    Task<VersionedListResponse<TResponse>> TreeDictionaryAsync(string? version, CancellationToken cancellationToken);
}