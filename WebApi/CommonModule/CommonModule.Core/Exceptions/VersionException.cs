using CommonModule.Shared.Constants;

namespace CommonModule.Core.Exceptions;

public class VersionException: BaseException
{
    public VersionException() : base(ErrorMessages.VersionNotSpecified, 404)
    {
    }
}