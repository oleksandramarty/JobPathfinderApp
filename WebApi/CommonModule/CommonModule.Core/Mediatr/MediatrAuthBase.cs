using CommonModule.Core.Exceptions;
using CommonModule.Interfaces;

namespace CommonModule.Core.Mediatr;

public class MediatrAuthBase
{
    private readonly ICurrentUserRepository _currentUserRepository;
    
    public MediatrAuthBase(ICurrentUserRepository currentUserRepository)
    {
        _currentUserRepository = currentUserRepository;
    }

    protected async Task<Guid> CurrentUserIdAsync()
    {
        Guid? userId = await _currentUserRepository.CurrentUserIdAsync();

        if (!userId.HasValue)
        {
            throw new EntityNotFoundException();
        }

        return userId.Value;
    }
}