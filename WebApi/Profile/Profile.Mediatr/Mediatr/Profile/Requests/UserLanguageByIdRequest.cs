using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Profile.Profile;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Requests;

public class UserLanguageByIdRequest: BaseIdEntity<Guid>, IRequest<UserLanguageResponse>
{
    
}