using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Enums.AuditTrail;

namespace AuditTrail.Domain.Models;

/// <summary>
/// Entity for AuditTrail
/// </summary>
public class AuditTrailEntity: CreatedBaseDateTimeEntity<Guid>
{
    public AuditTrailEntity(
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
        Guid? userId)
    {
        EntityType = entityType;
        Action = action;
        Type = type;
        ExceptionType = exceptionType;
        EntityId = entityId;
        UserId = userId;
        
        if (message?.Length > 2000) {
            Message = message.Substring(0, 2000);
        } else {
            Message = message;
        }
        
        if (oldValue?.Length > 1000) {
            OldValue = oldValue.Substring(0, 1000);
        } else {
            OldValue = oldValue;
        }
        
        if (newValue?.Length > 1000) {
            NewValue = newValue.Substring(0, 1000);
        } else {
            NewValue = newValue;
        }
        
        if (payload?.Length > 1000) {
            Payload = payload.Substring(0, 1000);
        } else {
            Payload = payload;
        }
        
        if (uri?.Length > 200) {
            Uri = uri.Substring(0, 200);
        } else {
            Uri = uri;
        }
    }
    
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
    [MaxLength(2000)] public string? Message { get; set; }
    
    /// <summary>
    /// EntityId of the entity
    /// </summary>
    public Guid? EntityId { get; set; }
    
    /// <summary>
    /// PropertyName of the entity
    /// </summary>
    [MaxLength(1000)] public string? OldValue { get; set; }
    
    /// <summary>
    /// OldValue of the entity
    /// </summary>
    [MaxLength(1000)] public string? NewValue { get; set; }
    
    /// <summary>
    /// Payload of the entity
    /// </summary>
    [MaxLength(1000)] public string? Payload { get; set; }
    
    /// <summary>
    /// Uri
    /// </summary>
    [MaxLength(200)] public string? Uri { get; set; }
    
    /// <summary>
    /// UserId of the entity
    /// </summary>
    public Guid? UserId { get; set; }
}