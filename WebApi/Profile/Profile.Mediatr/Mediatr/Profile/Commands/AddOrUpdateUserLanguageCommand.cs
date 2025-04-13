namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class AddOrUpdateUserLanguageCommand
{
    public Guid? Id { get; set; }
    
    public int LanguageId { get; set; }
    public int LanguageLevelId { get; set; }
}