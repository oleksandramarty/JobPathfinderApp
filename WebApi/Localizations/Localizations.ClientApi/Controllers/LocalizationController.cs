using CommonModule.Core;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Dictionaries;
using CommonModule.Shared.Responses.Dictionaries.Models.Countries;
using CommonModule.Shared.Responses.Dictionaries.Models.Skills;
using CommonModule.Shared.Responses.Localizations;
using Dictionaries.Mediatr.Mediatr.Requests;
using Localizations.Mediatr.Mediatr.Localizations.Requests;
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
        
    [HttpGet("{version}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LocalizationsResponse))]    
    public async Task<IActionResult> NonPublicLocalization([FromRoute] string version, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new LocalizationsRequest
        {
            Version = version,
            IsPublic = false
        }, cancellationToken));
    }
    
    [HttpGet("public/{version}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LocalizationsResponse))]    
    public async Task<IActionResult> PublicLocalizations([FromRoute] string version, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new LocalizationsRequest
        {
            Version = version,
            IsPublic = true
        }, cancellationToken));
    }
}