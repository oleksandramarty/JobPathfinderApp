using CommonModule.Core.Mediatr;
using CommonModule.Shared.Enums.AuditTrail;
using CommonModule.Shared.Requests.Base;
using CommonModule.Shared.Responses.AuditTrail;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuditTrail.Mediatr.Mediatr.Requests;

/// <summary>
/// Get Filtered AuditTrail Request
/// </summary>
public class FilteredAuditTrailRequest: MediatrBaseFilteredRequest<AuditTrailResponse>
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
    public AuditTrailEnum? Type { get; set; }
    
    /// <summary>
    /// ExceptionTypeEnum of the log
    /// </summary>
    public ExceptionEnum? ExceptionType { get; set; }
    
    /// <summary>
    /// EntityId of the entity
    /// </summary>
    public Guid? EntityId { get; set; }
    
    /// <summary>
    /// UserId of the entity
    /// </summary>
    public Guid? UserId { get; set; }
    
    /// <summary>
    /// Translation key
    /// </summary>
    public string? TranslationKey { get; set; }
}