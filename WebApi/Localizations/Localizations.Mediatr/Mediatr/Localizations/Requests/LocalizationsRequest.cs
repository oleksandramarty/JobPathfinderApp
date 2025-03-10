using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Localizations;
using MediatR;

namespace Localizations.Mediatr.Mediatr.Localizations.Requests;

public class LocalizationsRequest: BaseVersionEntity, IPublicableEntity, IRequest<LocalizationsResponse>
{
    public bool IsPublic { get; set; }
}