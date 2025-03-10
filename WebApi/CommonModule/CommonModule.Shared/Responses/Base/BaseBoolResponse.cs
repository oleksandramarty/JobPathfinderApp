namespace CommonModule.Shared.Responses.Base;

/// <summary>
/// Base response for boolean responses
/// </summary>
public class BaseBoolResponse
{
    public BaseBoolResponse()
    {
        Success = true;
    }
    
    /// <summary>
    /// Success flag
    /// </summary>
    public bool Success { get; set; }
}