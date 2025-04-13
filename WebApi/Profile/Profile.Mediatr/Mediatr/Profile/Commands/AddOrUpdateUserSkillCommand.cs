namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class AddOrUpdateUserSkillCommand
{
    public Guid? Id { get; set; }
    
    public int SkillId { get; set; }
    public int SkillLevelId { get; set; }
}