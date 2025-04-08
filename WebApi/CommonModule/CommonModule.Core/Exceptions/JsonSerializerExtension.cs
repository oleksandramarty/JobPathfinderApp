using System.Text.Json;
using System.Text.Json.Serialization;
using CommonModule.Shared.JsonConvertors;

namespace CommonModule.Core.Exceptions;

public static class JsonSerializerExtension
{
    public static string ToString<T>(T? model)
    {
        if (model == null)
        {
            return string.Empty;
        }

        var options = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        options.Converters.Add(new JsonStringEnumConverter());
        options.Converters.Add(new BooleanJsonConverter());
        options.Converters.Add(new Int32JsonConverter());
        options.IgnoreReadOnlyProperties = true;
        options.IgnoreReadOnlyFields = true;

        return JsonSerializer.Serialize(model, options);
    }

    public static T? FromString<T>(string jsonString)
    {
        if (string.IsNullOrEmpty(jsonString))
        {
            return default(T?);
        }

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        options.Converters.Add(new JsonStringEnumConverter());
        options.Converters.Add(new BooleanJsonConverter());
        options.Converters.Add(new Int32JsonConverter());

        return JsonSerializer.Deserialize<T>(jsonString, options);
    }
}