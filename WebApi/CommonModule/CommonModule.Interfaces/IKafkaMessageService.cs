namespace CommonModule.Interfaces;

/// <summary>
/// Interface for KafkaMessageService
/// </summary>
public interface IKafkaMessageService
{
    /// <summary>
    /// Log audit trail
    /// </summary>
    /// <param name="log">AuditTrailEntity</param>
    /// <returns></returns>
    Task LogAuditTrailAsync(object log);
}