using CommonModule.Shared.Common;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Localizations.Models.Locales;
using MediatR;

namespace Localizations.Mediatr.Mediatr.Localizations.Requests;

public class LocalesRequest: BaseVersionEntity, IRequest<VersionedListResponse<LocaleResponse>>
{
    
}