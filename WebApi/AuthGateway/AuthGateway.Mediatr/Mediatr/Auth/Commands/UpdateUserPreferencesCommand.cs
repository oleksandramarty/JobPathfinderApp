using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class UpdateUserPreferencesCommand: BaseIdEntity<Guid>, IRequest<BaseBoolResponse>
{
    public string? Login { get; set; }
    public string? Headline { get; set; }
    public string? Phone { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DefaultLocale { get; set; }
    public int? TimeZone { get; set; }
    public int? CountryId { get; set; }
    public int? CurrencyId { get; set; }
    public bool ApplicationAiPrompt { get; set; }
    
    public string? LinkedInUrl { get; set; }
    public string? NpmUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    
    public bool ShowCurrentPosition { get; set; }
    public bool ShowHighestEducation { get; set; }
}