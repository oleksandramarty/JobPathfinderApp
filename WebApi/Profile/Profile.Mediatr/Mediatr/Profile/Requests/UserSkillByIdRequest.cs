using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Profile.Profile;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Requests;

public class UserSkillByIdRequest: BaseIdEntity<Guid>, IRequest<UserSkillResponse>
{
    
}