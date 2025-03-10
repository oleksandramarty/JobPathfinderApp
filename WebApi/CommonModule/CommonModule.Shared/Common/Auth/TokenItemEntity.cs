namespace CommonModule.Shared.Common.Auth;

public class TokenItemEntity
{
    public Guid UserId { get; set; }
    public string? Token { get; set; }
    public DateTime Expiration { get; set; }
}