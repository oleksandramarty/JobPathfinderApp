using AuthGateway.Mediatr.Mediatr.Auth.Requests;
using CommonModule.Core;
using CommonModule.Shared.Responses.AuthGateway;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AuthGateway.ClientApi.Controllers;

[ApiController]
public class AuthController: BaseController
{
    private readonly IMediator _mediator;
    
    public AuthController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpPost("sign-in")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(JwtTokenResponse))]    
    public async Task<IActionResult> SignIn([FromBody] AuthSignInRequest request, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(request, cancellationToken));
    }
}