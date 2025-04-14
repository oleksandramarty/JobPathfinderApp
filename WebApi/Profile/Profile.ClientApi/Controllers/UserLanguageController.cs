using CommonModule.Core;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.ClientApi.Controllers;

[Authorize]
[ApiController]
public class UserLanguageController: BaseController
{
    private readonly IMediator _mediator;
    
    public UserLanguageController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> AddserLanguage([FromBody] AddUserLanguageCommand command, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }
    
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> UpdateUserLanguage([FromBody] UpdateUserLanguageCommand command, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }
    
    
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> RemoveUserLanguage([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new RemoveUserLanguageCommand { Id = id }, cancellationToken));
    }
}
