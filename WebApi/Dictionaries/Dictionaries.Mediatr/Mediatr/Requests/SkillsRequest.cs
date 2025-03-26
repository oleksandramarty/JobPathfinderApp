using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using CommonModule.Shared.Responses.Dictionaries.Models.Skills;
using MediatR;

namespace Dictionaries.Mediatr.Mediatr.Requests;

public class SkillsRequest: BaseVersionEntity, IRequest<VersionedListResponse<SkillResponse>>
{
    
}