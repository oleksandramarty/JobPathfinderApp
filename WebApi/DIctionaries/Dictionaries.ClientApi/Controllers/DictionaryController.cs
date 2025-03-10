using CommonModule.Core;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using CommonModule.Shared.Responses.Dictionaries.Models.Skills;
using Dictionaries.Mediatr.Mediatr.Requests;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Dictionaries.ClientApi.Controllers;

[ApiController]
public class DictionaryController: BaseController
{
    private readonly IMediator _mediator;
    
    public DictionaryController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet("version")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SiteSettingsResponse))]    
    public async Task<IActionResult> DictionaryVersion(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new SiteSettingsRequest(), cancellationToken));
    }
    
    [HttpGet("countries")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(VersionedListResponse<CountryResponse>))]
    public async Task<IActionResult> GetCountries(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new CountriesRequest(), cancellationToken));
    }
    
    [HttpGet("skills")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(VersionedListResponse<SkillResponse>))]
    public async Task<IActionResult> GetSkills(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new SkillsRequest(), cancellationToken));
    }
}