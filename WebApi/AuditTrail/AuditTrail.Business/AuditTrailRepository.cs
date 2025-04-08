using AuditTrail.Domain;
using AuditTrail.Domain.Models;
using CommonModule.Interfaces;
using CommonModule.Shared.Enums.AuditTrail;

namespace AuditTrail.Business;

/// <summary>
/// Repository for AuditTrail
/// </summary>
public class AuditTrailRepository : IAuditTrailRepository
{
    private readonly IGenericRepository<Guid, AuditTrailEntity, AuditTrailDataContext> _genericAuditTrailRepository;

    public AuditTrailRepository(
        IGenericRepository<Guid, AuditTrailEntity, AuditTrailDataContext> genericAuditTrailRepository
        )
    {
        _genericAuditTrailRepository = genericAuditTrailRepository;
    }

    /// <summary>
    /// Add log to the database
    /// </summary>
    /// <param name="auditLog">Audit log entity</param>
    /// <param name="cancellationToken">The cancellation token</param>
    /// <returns></returns>
    public async Task AddLogAsync(AuditTrailEntity auditLog, CancellationToken cancellationToken)
    {
        await _genericAuditTrailRepository.AddAsync(auditLog, cancellationToken);
    }

    /// <summary>
    /// Add log to the database
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="exception">Exception type</param>
    /// <param name="message">Exception message</param>
    /// <param name="payload">Request payload</param>
    /// <param name="cancellationToken">The cancellation token</param>
    /// <returns></returns>
    public async Task AddExceptionLogAsync(
        Guid? userId,
        ExceptionEnum exception,
        string? message,
        string? payload,
        CancellationToken cancellationToken)
    {
        AuditTrailEntity result = new AuditTrailEntity(
            null,
            AuditTrailActionEnum.ExceptionHandlingMiddleware,
            AuditTrailEnum.Error,
            exception,
            message,
            null,
            null,
            null,
            payload,
            null,
            userId
        );

        await _genericAuditTrailRepository.AddAsync(result, cancellationToken);
    }
}