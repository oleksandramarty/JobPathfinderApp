using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using MediatR;

namespace Dictionaries.Mediatr.Mediatr.Requests;

public class CountriesRequest: BaseVersionEntity, IRequest<VersionedListResponse<CountryResponse>>
{
    
}