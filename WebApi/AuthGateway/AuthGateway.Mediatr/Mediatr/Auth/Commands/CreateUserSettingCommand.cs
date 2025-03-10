using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Base;
using MediatR;

namespace AuthGateway.Mediatr.Mediatr.Auth.Commands;

public class CreateUserSettingCommand: IRequest<BaseEntityIdResponse<Guid>>
{
    [Required] [MaxLength(50)] public required string DefaultLocale { get; set; }
    public int? TimeZone { get; set; }
    public int? CountryId { get; set; }
    public int? DefaultUserProjectCurrencyId { get; set; }
    public Guid? DefaultUserProjectId { get; set; }
}