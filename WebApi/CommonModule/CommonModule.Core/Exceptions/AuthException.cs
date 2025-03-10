namespace CommonModule.Core.Exceptions;

public class AuthException: BaseException
{
    public AuthException(string message, int code) : base(message, code)
    {
    }
}