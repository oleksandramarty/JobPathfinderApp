using CommonModule.Shared.Constants;

namespace CommonModule.Core.Exceptions;

public class ForbiddenException: BaseException
{
    public ForbiddenException() : base(ErrorMessages.Forbidden, 403)
    {
    }
}