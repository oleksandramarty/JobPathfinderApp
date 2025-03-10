using CommonModule.Shared.Responses.Base;
using MediatR;

namespace CommonModule.Core.Strategies.FilteredResult;

public class FilteredResultStrategyContext<TCommand, TEntityResponse>
    where TCommand: IRequest<FilteredListResponse<TEntityResponse>>
{
    private IFilteredResultStrategy<TCommand, TEntityResponse> _strategy;

    public FilteredResultStrategyContext(IFilteredResultStrategy<TCommand, TEntityResponse> strategy)
    {
        _strategy = strategy;
    }

    public void SetStrategy(IFilteredResultStrategy<TCommand, TEntityResponse> strategy)
    {
        _strategy = strategy;
    }

    public async Task<FilteredListResponse<TEntityResponse>> ExecuteStrategyAsync(TCommand command, CancellationToken cancellationToken)
    {
        return await _strategy.FilteredResultAsync(command, cancellationToken);
    }
}