using AutoMapper;
using CommonModule.Core.Extensions;
using CommonModule.Interfaces;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Repositories;

public class DictionaryRepository<TEntityId, TEntity, TResponse, TDataContext>: IDictionaryRepository<TEntityId, TEntity, TResponse, TDataContext>
    where TEntityId : struct
    where TEntity : class, IBaseIdEntity<TEntityId>, IStatusEntity
    where TResponse : class, IBaseIdEntity<TEntityId>
    where TDataContext : DbContext
{
    private readonly IMapper _mapper;
    private readonly ICacheRepository<TEntityId, TEntity> _cacheRepository;
    private readonly IReadGenericRepository<TEntityId, TEntity, TDataContext> _readGenericDictionaryRepository;
    
    public DictionaryRepository(
        IMapper mapper,
        ICacheRepository<TEntityId, TEntity> cacheRepository,
        IReadGenericRepository<TEntityId, TEntity, TDataContext> readGenericDictionaryRepository
        )
    {
        _mapper = mapper;
        _cacheRepository = cacheRepository;
        _readGenericDictionaryRepository = readGenericDictionaryRepository;
    }

    public async Task<VersionedListResponse<TResponse>> DictionaryAsync(
        string? version, 
        CancellationToken cancellationToken, 
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs)
    {
        string currentVersion = await _cacheRepository.CacheVersionAsync();
        
        if (LocalizationExtension.IsDictionaryActual(version, currentVersion))
        {
            return new VersionedListResponse<TResponse>
            {
                Items = new List<TResponse>(),
                Version = currentVersion
            };
        }
        
        var items = await _cacheRepository.ItemsFromCacheAsync();
    
        if (items == null || items.Count == 0)
        {
            items = await _readGenericDictionaryRepository.ListAsync(null, cancellationToken, includeFuncs);
            await _cacheRepository.ReinitializeDictionaryAsync(items);
            await _cacheRepository.SetCacheVersionAsync();
        }
        
        if (string.IsNullOrEmpty(currentVersion))
        {
            currentVersion = await _cacheRepository.CacheVersionAsync();
        }
    
        VersionedListResponse<TResponse> result = new VersionedListResponse<TResponse>
        {
            Items = items.Where(i => i.Status == StatusEnum.Active).Select(r => _mapper.Map<TEntity, TResponse>(r)).ToList(),
            Version = currentVersion
        };

        return result;
    }
}