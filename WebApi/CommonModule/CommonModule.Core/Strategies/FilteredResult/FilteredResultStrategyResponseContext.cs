using AutoMapper;
using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Core.Strategies.FilteredResult;

public class FilteredResultStrategyResponseContext<TFilteredRequest, TEntity, TResponse>
    where TFilteredRequest : IBaseFilterRequest
{
    private readonly IMapper _mapper;

    public FilteredResultStrategyResponseContext(IMapper mapper)
    {
        _mapper = mapper;
    }

    protected async Task<FilteredListResponse<TResponse>> FilteredResultAsync(
        TFilteredRequest request,
        IQueryable<TEntity> query,
        CancellationToken cancellationToken)
    {
        var total = await query.CountAsync(cancellationToken);

        List<TEntity> entities;

        if (request.Paginator != null)
        {
            if (request.Paginator.IsFull && total > 150)
            {
                request.Paginator.PageSize = 150;
            }
            
            entities = await query
                .Skip((request.Paginator.PageNumber - 1) * request.Paginator.PageSize)
                .Take(request.Paginator.PageSize)
                .ToListAsync(cancellationToken);
        }
        else
        {
            entities = await query.ToListAsync(cancellationToken);
        }

        return new FilteredListResponse<TResponse>(
            entities.Select(x => _mapper.Map<TEntity, TResponse>(x)).ToList(),
            request.Paginator,
            total);
    }
}