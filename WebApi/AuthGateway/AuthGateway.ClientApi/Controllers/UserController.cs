using AuthGateway.Mediatr.Mediatr.Auth.Commands;
using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core;
using CommonModule.Shared.Responses.AuthGateway.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthGateway.ClientApi.Controllers;

[Authorize]
[ApiController]
public class UserController: BaseController
{
    private readonly IMediator _mediator;
    
    public UserController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserResponse))]
    public async Task<ActionResult<UserResponse>> UserById([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new UserByIdRequest { Id = id }, cancellationToken));
    }
    
    [HttpGet("current")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserResponse))]    
    public async Task<IActionResult> Current(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new CurrentUserRequest(), cancellationToken));
    }

    [HttpPut("preferences")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateUserPreferencesCommand command,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);
        return Ok(true);
    }
}