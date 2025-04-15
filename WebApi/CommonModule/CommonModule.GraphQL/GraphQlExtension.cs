using CommonModule.Core.Exceptions;
using CommonModule.Shared.Common;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Requests.Base;
using GraphQL;
using GraphQL.Types;

namespace CommonModule.GraphQL;

public static class GraphQlExtension
{
    public static IEnumerable<QueryArgument> PageableQueryArguments()
    {
        return new QueryArguments(new QueryArgument<BooleanGraphType> { Name = "isFull" },
            new QueryArgument<IntGraphType> { Name = "pageNumber" },
            new QueryArgument<IntGraphType> { Name = "pageSize" },
            new QueryArgument<DateTimeGraphType> { Name = "dateFrom" },
            new QueryArgument<DateTimeGraphType> { Name = "dateTo" },
            new QueryArgument<StringGraphType> { Name = "query" },
            new QueryArgument<StringGraphType> { Name = "column" },
            new QueryArgument<StringGraphType> { Name = "direction" },
            new QueryArgument<DecimalGraphType> { Name = "amountFrom" },
            new QueryArgument<DecimalGraphType> { Name = "amountTo" },
            new QueryArgument<IdGraphType> { Name = "entityId" },
            new QueryArgument<IdGraphType> { Name = "userId" }
        );
    }

    public static TFilter FilterQuery<TFilter>(this IResolveFieldContext<object?> context)
        where TFilter: IBaseFilterRequest, new ()
    {
        TFilter query = new TFilter();
        query.Paginator = new PaginatorEntity(
            context.GetArgument<int?>("pageNumber") ?? 1,
            context.GetArgument<int?>("pageSize") ?? 5,
            context.GetArgument<bool?>("isFull") ?? false);

        query.Sort = new BaseSortableRequest
        {
            Column = context.GetArgument<ColumnEnum?>("column") ?? ColumnEnum.CreatedAt,
            Direction = context.GetArgument<OrderDirectionEnum?>("direction") ?? OrderDirectionEnum.Desc
        };

        var startDate = context.GetArgument<DateTime?>("dateFrom");
        var endDate = context.GetArgument<DateTime?>("dateTo");

        if (startDate.HasValue || endDate.HasValue)
        {
            query.DateRange = new BaseDateRangeFilterRequest
            {
                StartDate = startDate,
                EndDate = endDate
            };
        }
        else
        {
            query.DateRange = null;
        }

        var amountFrom = context.GetArgument<decimal?>("amountFrom");
        var amountTo = context.GetArgument<decimal?>("amountTo");

        if (amountFrom.HasValue || amountTo.HasValue)
        {
            query.AmountRange = new BaseAmountRangeFilterRequest()
            {
                AmountFrom = amountFrom,
                AmountTo = amountTo
            };
        }
        else
        {
            query.AmountRange = null;
        }

        query.Query = context.GetArgument<string?>("query");
        
        // if (query is FilteredExpensesRequest expensesRequest)
        // {
        //     expensesRequest.UserProjectId = context.GetArgument<Guid>("userProjectId");
        //     expensesRequest.CategoryIds = new BaseFilterIdsRequest<int>
        //     {
        //         Ids = context.GetArgument<List<int>>("categoryIds")
        //     };
        //
        //     return (TFilter)(object)expensesRequest;
        // }

        return query;
    }

    public static void IsAuthenticated(this IResolveFieldContext<object?> context, bool isAuthenticated = true)
    {
        if (context?.User?.Identity?.IsAuthenticated != true && isAuthenticated)
        {
            throw new ForbiddenException();
        }
    }
}