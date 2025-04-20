using CommonModule.Shared.Enums.Users;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class CreateUserProfileItemCommand: IRequest<BaseEntityIdResponse<Guid>>
{
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