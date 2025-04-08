using CommonModule.Shared.Responses.Base;
using MediatR;

namespace CommonModule.Core.Strategies.FilteredResult;

public interface IFilteredResultStrategy<in TCommand, TEntityResponse>
    where TCommand: IRequest<FilteredListResponse<TEntityResponse>>
{
    Task<FilteredListResponse<TEntityResponse>> FilteredResultAsync(TCommand request ,CancellationToken cancellationToken);
}