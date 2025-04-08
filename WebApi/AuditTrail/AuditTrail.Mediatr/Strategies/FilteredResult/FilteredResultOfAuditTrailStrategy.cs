using AuditTrail.Domain;
using AuditTrail.Domain.Models;
using AuditTrail.Mediatr.Mediatr.Requests;
using AutoMapper;
using CommonModule.Core.Extensions;
using CommonModule.Core.Strategies.FilteredResult;
using CommonModule.Interfaces;
using CommonModule.Shared.Enums;
using CommonModule.Shared.Responses.AuditTrail;
using CommonModule.Shared.Responses.Base;
using Microsoft.EntityFrameworkCore;

namespace AuditTrail.Mediatr.Strategies.FilteredResult;

public class FilteredResultOfAuditTrailStrategy :
    FilteredResultStrategyResponseContext<FilteredAuditTrailRequest, AuditTrailEntity, AuditTrailResponse>,
    IFilteredResultStrategy<FilteredAuditTrailRequest, AuditTrailResponse>
{
    private readonly IReadGenericRepository<Guid, AuditTrailEntity, AuditTrailDataContext> _readGenericAuditTrailRepository;

    public FilteredResultOfAuditTrailStrategy(
        IMapper mapper,
        IReadGenericRepository<Guid, AuditTrailEntity, AuditTrailDataContext> readGenericAuditTrailRepository
    ) : base(mapper)
    {
        _readGenericAuditTrailRepository = readGenericAuditTrailRepository;
    }


    public async Task<FilteredListResponse<AuditTrailResponse>> FilteredResultAsync(
        FilteredAuditTrailRequest request, CancellationToken cancellationToken)
    {
        var query = _readGenericAuditTrailRepository.Queryable(e =>
            (
                string.IsNullOrEmpty(request.Query) ||
                (
                    e.Message != null && (
                        EF.Functions.Like(e.Message, $"{request.Query}%") ||
                        EF.Functions.Like(e.Message, $"%{request.Query}%") ||
                        EF.Functions.Like(e.Message, $"%{request.Query}")
                    ) ||
                    e.Uri != null && (
                        EF.Functions.Like(e.Uri, $"{request.Query}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.Query}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.Query}")
                    )
                )
            ) &&
            (
                string.IsNullOrEmpty(request.TranslationKey) ||
                (
                    e.Message != null && (
                        EF.Functions.Like(e.Message, $"{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Message, $"%{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Message, $"%{request.TranslationKey}")
                    ) ||
                    e.OldValue != null && (
                        EF.Functions.Like(e.Uri, $"{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.TranslationKey}")
                    ) ||
                    e.NewValue != null && (
                        EF.Functions.Like(e.Uri, $"{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.TranslationKey}")
                    ) ||
                    e.Payload != null && (
                        EF.Functions.Like(e.Uri, $"{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.TranslationKey}%") ||
                        EF.Functions.Like(e.Uri, $"%{request.TranslationKey}")
                    )
                )
            ) &&
            (request.EntityType == null || e.EntityType != null && e.EntityType == request.EntityType) &&
            (request.Action == null || e.Action != null && e.Action == request.Action) &&
            (request.Type == null || e.Type == request.Type) &&
            (request.ExceptionType == null || e.ExceptionType != null && e.ExceptionType == request.ExceptionType) &&
            (request.EntityId == null || e.EntityId != null && e.EntityId == request.EntityId) &&
            (request.UserId == null || e.UserId != null && e.UserId == request.UserId) &&
            (request.DateRange == null || (
                    request.DateRange.StartDate.HasValue && !request.DateRange.EndDate.HasValue &&
                    e.CreatedAt >= request.DateRange.StartDate ||
                    !request.DateRange.StartDate.HasValue && request.DateRange.EndDate.HasValue &&
                    e.CreatedAt <= request.DateRange.EndDate ||
                    request.DateRange.StartDate.HasValue && request.DateRange.EndDate.HasValue &&
                    e.CreatedAt >= request.DateRange.StartDate && e.CreatedAt <= request.DateRange.EndDate
                )
            )
        );

        if (request.Sort != null && request.Sort.Column.HasValue)
        {
            switch (request.Sort.Column.Value)
            {
                case ColumnEnum.CreatedAt:
                    query.SortByCreatedAt(request.Sort.Direction);
                    break;
            }
        }

        return await FilteredResultAsync(request, query, cancellationToken);
    }
}