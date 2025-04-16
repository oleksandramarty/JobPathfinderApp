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

    [HttpPut("preferences")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateUserPreferencesCommand command,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);
        return Ok(true);
    }
}