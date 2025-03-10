using CommonModule.Shared.Common;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class UpdateUserSettingCommand: BaseIdEntity<Guid>, IRequest
{
    public string DefaultLocale { get; set; }
    public int TimeZone { get; set; }
    public int CountryId { get; set; }
    public int DefaultUserProjectCurrencyId { get; set; }
    public Guid DefaultUserProjectId { get; set; }
}