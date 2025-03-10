using AuditTrail.Domain.Models;
using CommonModule.Shared.Enums.AuditTrail;

namespace AuditTrail.Business;

/// <summary>
/// Interface for AuditTrailRepository
/// </summary>
public interface IAuditTrailRepository
{
    /// <summary>
    /// Add log to the database
    /// </summary>
    /// <param name="auditLog">Audit log entity</param>
    /// <param name="cancellationToken">The cancellation token</param>
    /// <returns></returns>
    Task AddLogAsync(AuditTrailEntity auditLog, CancellationToken cancellationToken);
    
    /// <summary>
    /// Add log to the database
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="exception">Exception type</param>
    /// <param name="message">Exception message</param>
    /// <param name="payload">Request payload</param>
    /// <param name="cancellationToken">The cancellation token</param>
    /// <returns></returns>
    Task  AddExceptionLogAsync(
        Guid? userId,
        ExceptionEnum exception,
        string? message,
        string? payload,
        CancellationToken cancellationToken);
}