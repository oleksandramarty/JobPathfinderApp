using CommonModule.Core;
using CommonModule.Shared.Responses.Base;
using CommonModule.Shared.Responses.Profile.Profile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Profile.Mediatr.Mediatr.Profile.Commands;
using Profile.Mediatr.Mediatr.Profile.Requests;

namespace Profile.ClientApi.Controllers;

[Authorize]
[ApiController]
public class ProfileController: BaseController
{
    private readonly IMediator _mediator;
    
    public ProfileController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserProfileResponse))]
    public async Task<IActionResult> CurrentUserProfile(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new UserProfileRequest(), cancellationToken));
    }
}
