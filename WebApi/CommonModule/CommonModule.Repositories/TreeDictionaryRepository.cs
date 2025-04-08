using AutoMapper;
using CommonModule.Core.Exceptions;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Repositories;

public class TreeDictionaryRepository<TEntityId, TEntityIdParentId, TEntity, TResponse, TDataContext>: ITreeDictionaryRepository<TEntityId, TEntityIdParentId, TEntity, TResponse, TDataContext>
    where TEntity : class, ITreeEntityEntity<TEntityId, TEntityIdParentId>, IStatusEntity
    where TResponse : class, ITreeChildrenEntity<TResponse>
    where TDataContext : DbContext
{
    private readonly IMapper _mapper;
    private readonly IEntityValidator<TDataContext> _entityValidator;
    private readonly ICacheRepository<TEntityId, TEntity> _cacheRepository;
    private readonly IReadGenericRepository<TEntityId, TEntity, TDataContext> _readGenericDictionaryRepository;
    
    public TreeDictionaryRepository(
        IMapper mapper,
        IEntityValidator<TDataContext> entityValidator,
        ICacheRepository<TEntityId, TEntity> cacheRepository,
        IReadGenericRepository<TEntityId, TEntity, TDataContext> readGenericDictionaryRepository,
        IKafkaMessageService kafkaMessageService
        )
    {
        _mapper = mapper;
        _entityValidator = entityValidator;
        _cacheRepository = cacheRepository;
        _readGenericDictionaryRepository = readGenericDictionaryRepository;
    }
    
    public async Task<VersionedListResponse<TResponse>> TreeDictionaryAsync(string? version, CancellationToken cancellationToken)
    {
        string? currentVersion = await _cacheRepository.CacheVersionAsync();
        
        if (LocalizationExtension.IsDictionaryActual(version, currentVersion))
        {
            return new VersionedListResponse<TResponse>
            {
                Items = new List<TResponse>(),
                Version = currentVersion
            };
        }
        
        var items = await _cacheRepository.ItemsFromCacheAsync();
    
        if (items.Count == 0)
        {
            items = await _readGenericDictionaryRepository.ListAsync(null, cancellationToken);
            await _cacheRepository.ReinitializeDictionaryAsync(items);
            await _cacheRepository.SetCacheVersionAsync();
        }
        
        if (string.IsNullOrEmpty(currentVersion))
        {
            currentVersion = await _cacheRepository.CacheVersionAsync();
        }
    
        VersionedListResponse<TResponse> result = new VersionedListResponse<TResponse>
        {
            Items = await BuildSummitsTreeNode(
                items.Where(c => c.ParentId == null && c.Status == StatusEnum.Active), 
                items.Where(c => c.ParentId != null && c.Status == StatusEnum.Active), 
                cancellationToken),
            Version = currentVersion
        };

        return result;
    }

    private async Task<List<TResponse>> BuildSummitsTreeNode(
        IEnumerable<TEntity> mainEntities,
        IEnumerable<TEntity>? entities,
        CancellationToken cancellationToken)
    {
        var nodeList = new List<TResponse>();
    
        foreach (var entity in mainEntities)
        {
            var treeNode = await BuildSummitTreeNode(entity, entities, cancellationToken);
            nodeList.Add(treeNode);
        }
    
        return nodeList;
    }
    
    private async Task<TResponse> BuildSummitTreeNode(
        TEntity entity,
        IEnumerable<TEntity>? entities,
        CancellationToken cancellationToken)
    {
        if (entity == null)
        {
            throw new EntityNotFoundException();
        }
    
        var childNodes = await ChildNodes(entity, entities, cancellationToken);
        TResponse? node = _mapper.Map<TEntity, TResponse>(entity);
    
        if (node != null)
        {
            node.Children = childNodes;
        }

        return node;
    }
    
    private async Task<List<TResponse>> ChildNodes(
        TEntity entity,
        IEnumerable<TEntity>? entities,
        CancellationToken cancellationToken)
    {
        IEnumerable<TEntity> children = Children(entities, entity.Id);
        var childNodes = new List<TResponse>();
    
        var remainingEntities = entities?.Where(e => !children.Contains(e)).ToList();
    
        foreach (var child in children)
        {
            var childNode = await BuildSummitTreeNode(child, remainingEntities, cancellationToken);
            childNodes.Add(childNode);
        }
    
        return childNodes;
    }
    
    private IEnumerable<TEntity> Children(IEnumerable<TEntity>? entities, TEntityId parentId)
    {
        return entities?.Where(c => c.ParentId != null && c.ParentId.Equals(parentId)).ToList() ?? 
               _readGenericDictionaryRepository.Queryable(c => c.ParentId != null && c.ParentId.Equals(parentId)).AsEnumerable();
    }
}