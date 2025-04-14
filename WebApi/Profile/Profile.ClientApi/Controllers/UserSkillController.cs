using CommonModule.Core;
using CommonModule.Shared.Responses.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Profile.Mediatr.Mediatr.Profile.Commands;

namespace Profile.ClientApi.Controllers;

[Authorize]
[ApiController]
public class UserSkillController: BaseController
{
    private readonly IMediator _mediator;
    
    public UserSkillController(IMediator mediator) : base(mediator)
    {
        _mediator = mediator;
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> AddserSkill([FromBody] AddUserSkillCommand command, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }
    
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> UpdateUserSkill([FromBody] UpdateUserSkillCommand command, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }
    
    
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseBoolResponse))]
    public async Task<IActionResult> RemoveUserSkill([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new RemoveUserSkillCommand { Id = id }, cancellationToken));
    }
}
