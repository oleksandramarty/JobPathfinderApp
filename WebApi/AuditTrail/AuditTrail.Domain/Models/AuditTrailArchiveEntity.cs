using CommonModule.Shared.Enums.AuditTrail;

namespace AuditTrail.Domain.Models;

/// <summary>
/// Entity for AuditTrail
/// </summary>
public class AuditTrailArchiveEntity: AuditTrailEntity
{
    public AuditTrailArchiveEntity(
        AuditTrailEntityEnum? entityType,
        AuditTrailActionEnum? action,
        AuditTrailEnum type,
        ExceptionEnum? exceptionType,
        string? message,
        Guid? entityId,
        string? oldValue,
        string? newValue,
        string? payload,
        string? uri,
        Guid? userId): base (entityType, action, type, exceptionType, message, entityId, oldValue, newValue, payload, uri, userId)
    {
        ArchiveDate = DateTime.UtcNow;
    }
    
    /// <summary>
    /// ArchiveDate of the entity
    /// </summary>
    public DateTime ArchiveDate { get; set; }
}