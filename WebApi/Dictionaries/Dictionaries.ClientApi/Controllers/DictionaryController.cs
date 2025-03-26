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
public class LocalizationController: BaseController
{
    private readonly IMediator _mediator;
    
    public LocalizationController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet("version")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SiteSettingsResponse))]    
    public async Task<IActionResult> DictionaryVersion(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new SiteSettingsRequest(), cancellationToken));
    }
}