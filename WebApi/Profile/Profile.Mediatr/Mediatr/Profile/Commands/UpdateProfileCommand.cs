using CommonModule.Shared.Common;
using MediatR;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class UpdateProfileCommand: BaseIdEntity<Guid>, IRequest
{
    public List<Guid> LanguageIdsToRemove { get; set; }
    public List<Guid> SkillIdsToRemove { get; set; }
    public List<Guid> ProfileItemIdsToRemove { get; set; }
    
    public List<AddOrUpdateUserSkillCommand> AddUserSkills { get; set; }
    public List<AddOrUpdateUserLanguageCommand> AddUserLanguages { get; set; }
    public List<AddOrUpdateUserProfileItemCommand> AddProfileItems { get; set; }
    
    public List<AddOrUpdateUserSkillCommand> UpdateUserSkills { get; set; }
    public List<AddOrUpdateUserLanguageCommand> UpdateUserLanguages { get; set; }
    public List<AddOrUpdateUserProfileItemCommand> UpdateProfileItems { get; set; }
}