using CommonModule.Core;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.ClientApi.Controllers;

[Authorize]
[ApiController]
public class UserProfileItemController: BaseController
{
    private readonly IMediator _mediator;
    
    public UserProfileItemController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> AddserProfileItem([FromBody] AddUserProfileItemCommand command, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }
    
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> UpdateUserProfileItem([FromBody] UpdateUserProfileItemCommand command, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }
    
    
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> RemoveUserProfileItem([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new RemoveUserProfileItemCommand { Id = id }, cancellationToken));
    }
}
