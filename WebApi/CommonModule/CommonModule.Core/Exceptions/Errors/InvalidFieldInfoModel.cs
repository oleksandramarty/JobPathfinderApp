namespace CommonModule.Core.Exceptions.Errors;

public class InvalidFieldInfoModel
{
    public InvalidFieldInfoModel(string propertyName, string code, string errorMessage)
    {
        PropertyName = propertyName;
        Code = code;
        ErrorMessage = errorMessage;
    }

    public string PropertyName { get; }
    public string Code { get; }
    public string ErrorMessage { get; }
}