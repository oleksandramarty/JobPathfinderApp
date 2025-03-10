using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Requests.Base;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Core.Extensions;

public static class FilterExtension
{
    public static void CheckBaseFilter(this BaseFilterRequest filter)
    {
        if (filter == null)
        {
            throw new ArgumentNullException(nameof(filter));
        }

        if (string.IsNullOrEmpty(filter.Query))
        {
            filter.Query = null;
        }

        if (filter.DateRange != null &&
            !filter.DateRange.StartDate.HasValue &&
            !filter.DateRange.EndDate.HasValue)
        {
            filter.DateRange = null;
        }
        
        filter.DateRange.CheckOrApplyDefaultExpenseFilter();
        
        if (filter.AmountRange != null &&
            !filter.AmountRange.AmountFrom.HasValue &&
            !filter.AmountRange.AmountTo.HasValue)
        {
            filter.AmountRange = null;
        }
        
        filter.AmountRange.CheckAmountRange();
        
        filter.Paginator.CheckPaginator();
    }
    
    public static void CheckOrApplyDefaultExpenseFilter(this BaseDateRangeFilterRequest? range)
    {
        if (range == null)
        {
            range = new BaseDateRangeFilterRequest()
            {
                StartDate = DateTimeExtension.GetStartOfCurrentMonth()
            };
        }
        else
        {
            range.StartDate ??= new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
        }

        range.StartDate.SetMidnight();
        range.EndDate.SetMidnight();
    }
    
    /// <summary>
    /// Checks or applies the default filter to the date range filter request.
    /// </summary>
    /// <param name="range">The date range filter request to check or apply the default filter.</param>
    public static void CheckAmountRange(this BaseAmountRangeFilterRequest? range)
    {
        if (range == null)
        {
            return;
        }
        
        if (range.AmountFrom < 0.0m)
        {
            range.AmountFrom = 0.0m;
        }
    }

    public static void CheckIds<T>(this BaseFilterIdsRequest<T>? ids)
    {
        if (ids == null)
        {
            return;
        }

        if (ids.Ids == null)
        {
            ids.Ids = new List<T>();
        }
    }

    public static void CheckPaginator(this PaginatorEntity? paginator)
    {
        if (paginator == null)
        {
            paginator = new PaginatorEntity(1, 10, false);
        }
        
        if (paginator.PageNumber < 1)
        {
            paginator.PageNumber = 1;
        }
        
        if (paginator.PageSize < 1)
        {
            paginator.PageSize = 10;
        }
        
        if (paginator.PageSize > 150 || paginator.IsFull)
        {
            paginator.PageSize = 150;
        }
    }
    
    /// <summary>
    /// Sorts the query by the title field.
    /// </summary>
    /// <param name="query">Query to be sorted</param>
    /// <param name="direction">Direction of the sorting</param>
    /// <typeparam name="TEntity">Type of the entity</typeparam>
    public static void SortByCreatedAt<TEntity>(this IQueryable<TEntity> query, OrderDirectionEnum? direction)
        where TEntity : ICreatedBaseDateTimeEntity
    {
        if (direction == null)
        {
            return;
        }
        
        query = direction == OrderDirectionEnum.Asc ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt);
    }
    
    /// <summary>
    /// Sorts the query by the updated at field.
    /// </summary>
    /// <param name="query">Query to be sorted</param>
    /// <param name="direction">Direction of the sorting</param>
    /// <typeparam name="TEntity">Type of the entity</typeparam>
    public static void SortByUpdatedAt<TEntity>(this IQueryable<TEntity> query, OrderDirectionEnum? direction)
        where TEntity : IUpdatedBaseDateTimeEntity
    {
        if (direction == null)
        {
            return;
        }
        
        query = direction == OrderDirectionEnum.Asc ? query.OrderBy(x => x.UpdatedAt) : query.OrderByDescending(x => x.UpdatedAt);
    }
}