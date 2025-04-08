using AuditTrail.Mediatr.Mediatr.Requests;
using CommonModule.Core.Mediatr;
using CommonModule.Core.Strategies.FilteredResult;
using CommonModule.Shared.Responses.AuditTrail;

namespace AuditTrail.Mediatr.Mediatr.Handlers;

/// <summary>
/// Get filtered audit trail request handler.
/// </summary>
public class FilteredAuditTrailRequestHandler: MediatrBaseFilteredRequestHandler<FilteredAuditTrailRequest, AuditTrailResponse>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="FilteredAuditTrailRequestHandler"/> class.
    /// </summary>
    /// <param name="strategy">The strategy for getting filtered results.</param>
    public FilteredAuditTrailRequestHandler(
        IFilteredResultStrategy<FilteredAuditTrailRequest, AuditTrailResponse> strategy)
        : base(strategy)
    {
    }
}