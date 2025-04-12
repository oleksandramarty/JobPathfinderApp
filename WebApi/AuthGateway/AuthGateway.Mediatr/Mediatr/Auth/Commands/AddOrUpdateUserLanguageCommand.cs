namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class AddOrUpdateUserLanguageCommand
{
    public Guid? Id { get; set; }
    
    public int LanguageId { get; set; }
    public int LanguageLevelId { get; set; }
}