using CommonModule.Core.Extensions;
using CommonModule.Core.Strategies.FilteredResult;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace CommonModule.Core.Mediatr
{
    /// <summary>
    /// Base handler for Mediatr requests that include filtering capabilities.
    /// </summary>
    /// <typeparam name="TFilteredRequest">The type of the filtered request.</typeparam>
    /// <typeparam name="TEntityResponse">The type of the response entity.</typeparam>
    public class MediatrBaseFilteredRequestHandler<TFilteredRequest, TEntityResponse> : IRequestHandler<TFilteredRequest, FilteredListResponse<TEntityResponse>>
        where TFilteredRequest : MediatrBaseFilteredRequest<TEntityResponse>
        where TEntityResponse : class
    {
        private readonly IFilteredResultStrategy<TFilteredRequest, TEntityResponse> _strategy;

        /// <summary>
        /// Initializes a new instance of the <see cref="MediatrBaseFilteredRequestHandler{TFilteredRequest, TEntityResponse}"/> class.
        /// </summary>
        /// <param name="strategy">The strategy for getting filtered results.</param>
        public MediatrBaseFilteredRequestHandler(
            IFilteredResultStrategy<TFilteredRequest, TEntityResponse> strategy
        )
        {
            _strategy = strategy;
        }

        /// <summary>
        /// Handles the filtered request asynchronously.
        /// </summary>
        /// <param name="request">The filtered request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the filtered list response.</returns>
        public async Task<FilteredListResponse<TEntityResponse>> Handle(TFilteredRequest request, CancellationToken cancellationToken)
        {
            request.CheckBaseFilter();

            return await _strategy.FilteredResultAsync(request, cancellationToken);
        }
    }
}