namespace CommonModule.Shared.Enums.AuditTrail;

/// <summary>
/// Enum for AuditTrailType
/// </summary>
public enum AuditTrailEnum
{
    /// <summary>
    /// Informational message
    /// </summary>
    Info = 1,

    /// <summary>
    /// Warning message
    /// </summary>
    Warning = 2,

    /// <summary>
    /// Error message
    /// </summary>
    Error = 3,

    /// <summary>
    /// Create action
    /// </summary>
    Create = 4,

    /// <summary>
    /// Update action
    /// </summary>
    Update = 5,

    /// <summary>
    /// Delete action
    /// </summary>
    Delete = 6,
    
    /// <summary>
    /// Job action
    /// </summary>
    Job = 7,
    
    /// <summary>
    /// Job manually action
    /// </summary>
    JobManually = 8
}