using CommonModule.Shared.Common;

namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class AddOrUpdateUserSkillCommand
{
    public Guid? Id { get; set; }
    
    public int SkillId { get; set; }
    public int SkillLevelId { get; set; }
}