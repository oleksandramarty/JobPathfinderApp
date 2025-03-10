namespace CommonModule.Core.Exceptions;

public class BusinessException: BaseException
{
    public BusinessException(string message, int code): base(message, code)
    {
    }
    
}