using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CommonModule.Core.Exceptions.Errors;

public class ErrorMessageModel
{
    public ErrorMessageModel(string message, int statuscode)
    {
        Message = message;
        StatusCode = statuscode;
    }

    public ErrorMessageModel(string message, int statuscode, IReadOnlyCollection<InvalidFieldInfoModel>? invalidFields)
    {
        Message = message;
        StatusCode = statuscode;
        InvalidFields = invalidFields;
    }

    public IReadOnlyCollection<InvalidFieldInfoModel>? InvalidFields { get; set; }
    public string Message { get; set; }
    public int StatusCode { get; set; }

    public string ToJson()
    {
        var settings = new JsonSerializerSettings
        {
            Formatting = Formatting.Indented,
            NullValueHandling = NullValueHandling.Ignore,
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        return JsonConvert.SerializeObject(this, settings);
    }

    public static ErrorMessageModel FromJson(string data)
    {
        return JsonConvert.DeserializeObject<ErrorMessageModel>(data);
    }
}