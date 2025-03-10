using CommonModule.Shared.Common;
using CommonModule.Shared.Enums.AuditTrail;
using CommonModule.Shared.Responses.AuthGateway.Users;

namespace CommonModule.Shared.Responses.AuditTrail;

/// <summary>
/// Audit Trail Log Response
/// </summary>
public class AuditTrailResponse: BaseDateTimeEntity<Guid>
{
    /// <summary>
    /// EntityType of the entity
    /// </summary>
    public AuditTrailEntityEnum? EntityType { get; set; }
    
    /// <summary>
    /// Action of the entity
    /// </summary>
    public AuditTrailActionEnum? Action { get; set; }
    
    /// <summary>
    /// Type of the entity
    /// </summary>
    public AuditTrailEnum Type { get; set; }
    
    /// <summary>
    /// ExceptionTypeEnum of the log
    /// </summary>
    public ExceptionEnum? ExceptionType { get; set; }
    
    /// <summary>
    /// Message of the log
    /// </summary>
    public string? Message { get; set; }
    
    /// <summary>
    /// EntityId of the entity
    /// </summary>
    public Guid? EntityId { get; set; }
    
    /// <summary>
    /// PropertyName of the entity
    /// </summary>
    public string? OldValue { get; set; }
    
    /// <summary>
    /// OldValue of the entity
    /// </summary>
    public string? NewValue { get; set; }
    
    /// <summary>
    /// Payload of the entity
    /// </summary>
    public string? Payload { get; set; }
    
    /// <summary>
    /// Uri
    /// </summary>
    public string? Uri { get; set; }
    
    /// <summary>
    /// UserId of the entity
    /// </summary>
    public Guid? UserId { get; set; }
    
    /// <summary>
    /// User of the entity
    /// </summary>
    public UserResponse? User { get; set; }
    
    /// <summary>
    /// ArchiveDate of the entity
    /// </summary>
    public DateTime? ArchiveDate { get; set; }
}