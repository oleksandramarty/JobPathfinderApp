using System.Linq.Expressions;
using CommonModule.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Repositories;

public class GenericRepository<TEntityId, TEntity, TDataContext> : IGenericRepository<TEntityId, TEntity, TDataContext>
    where TEntity : class
    where TDataContext : DbContext
{
    private readonly TDataContext _dataContext;
    private readonly DbSet<TEntity> _dbSet;

    public GenericRepository(
        TDataContext dataContext
    )
    {
        _dataContext = dataContext ?? throw new ArgumentNullException(nameof(dataContext));
        _dbSet = _dataContext.Set<TEntity>();
    }

    public async Task<TEntity> ByIdAsync(TEntityId id, CancellationToken cancellationToken,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs)
    {
        IQueryable<TEntity> query = _dbSet;

        if (includeFuncs != null)
        {
            foreach (var includeFunc in includeFuncs)
            {
                query = includeFunc(query);
            }
        }

        TEntity entity = await query.FirstOrDefaultAsync(e => EF.Property<TEntity>(e, "Id").Equals(id), cancellationToken);
        return entity;
    }

    public async Task<TEntity> Async(Expression<Func<TEntity, bool>> condition, CancellationToken cancellationToken,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs)
    {
        IQueryable<TEntity> query = _dbSet;

        if (includeFuncs != null)
        {
            foreach (var includeFunc in includeFuncs)
            {
                query = includeFunc(query);
            }
        }

        TEntity entity = await query.FirstOrDefaultAsync(condition, cancellationToken);
        return entity;
    }

    public async Task<List<TEntity>> ListAsync(
        Expression<Func<TEntity, bool>>? condition,
        CancellationToken cancellationToken,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs)
    {
        IQueryable<TEntity> query = _dbSet;

        if (includeFuncs != null)
        {
            foreach (var includeFunc in includeFuncs)
            {
                query = includeFunc(query);
            }
        }

        List<TEntity> entities = await (condition == null ? query : query.Where(condition)).ToListAsync(cancellationToken);
        return entities;
    }

    public IQueryable<TEntity> Queryable(
        Expression<Func<TEntity, bool>>? condition,
        params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includeFuncs)
    {
        IQueryable<TEntity> query = _dbSet;

        if (includeFuncs != null)
        {
            foreach (var includeFunc in includeFuncs)
            {
                query = includeFunc(query);
            }
        }

        return condition == null ? query : query.Where(condition);
    }

    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(TEntity entity, CancellationToken cancellationToken)
    {
        _dataContext.Entry(entity).State = EntityState.Modified;
        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(TEntity entity, CancellationToken cancellationToken)
    {
        _dataContext.Entry(entity).State = EntityState.Deleted;
        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken)
    {
        await _dbSet.AddRangeAsync(entities, cancellationToken);
        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken)
    {
        foreach (var entity in entities)
        {
            _dataContext.Entry(entity).State = EntityState.Modified;
        }

        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken)
    {
        _dbSet.RemoveRange(entities);
        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteByIdAsync(TEntityId id, CancellationToken cancellationToken)
    {
        var entity = await ByIdAsync(id, cancellationToken);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _dataContext.SaveChangesAsync(cancellationToken);
        }
    }
}