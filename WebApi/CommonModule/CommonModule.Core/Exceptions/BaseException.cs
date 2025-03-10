using System.Text.Json.Serialization;
using CommonModule.Core.Exceptions.Errors;

namespace CommonModule.Core.Exceptions;

public class BaseException: Exception
{
    public BaseException(
        string message,
        int statusCode,
        IReadOnlyCollection<InvalidFieldInfoModel>? invalidFields = null) :
        base(message)
    {
        StatusCode = statusCode;
        InvalidFields = invalidFields;
    }
    
    public int StatusCode { get; set; }
    public IReadOnlyCollection<InvalidFieldInfoModel>? InvalidFields { get; set; }
    
    public ErrorMessageModel ToErrorMessage()
    {
        return new ErrorMessageModel(Message, StatusCode, InvalidFields);
    }
}