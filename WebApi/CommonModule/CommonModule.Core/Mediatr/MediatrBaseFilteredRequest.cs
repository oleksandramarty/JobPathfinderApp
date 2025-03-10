using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace CommonModule.Core.Mediatr
{
    /// <summary>
    /// Base class for Mediatr requests that include filtering capabilities.
    /// </summary>
    /// <typeparam name="TEntityResponse">The type of the response entity.</typeparam>
    public class MediatrBaseFilteredRequest<TEntityResponse> : BaseFilterRequest, IRequest<FilteredListResponse<TEntityResponse>>
    {
    }
}