using CommonModule.Shared.Enums.Users;

namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class AddOrUpdateUserProfileItemCommand
{
    public Guid? Id { get; set; }
    
    public UserProfileItemEnum ProfileItemType { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    public required string Position { get; set; }
    public string? Description { get; set; }
    public string? Company { get; set; }
    public string? Location { get; set; }
    
    public int? CountryId { get; set; }
    public int? JobTypeId { get; set; }
    public int? WorkArrangementId { get; set; }
}