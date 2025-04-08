using CommonModule.Core.Mediatr.Requests;
using CommonModule.Interfaces;
using MediatR;

namespace CommonModule.Core.Mediatr.Handlers;

public class GetUserIdRequestHandler: IRequestHandler<GetUserIdRequest, Guid?>
{
    private readonly ICurrentUserRepository _currentUserRepository;
    
    public GetUserIdRequestHandler(ICurrentUserRepository currentUserRepository)
    {
        _currentUserRepository = currentUserRepository;
    }
    
    public async Task<Guid?> Handle(GetUserIdRequest request, CancellationToken cancellationToken)
    {
        return await _currentUserRepository.CurrentUserIdAsync();
    }
}