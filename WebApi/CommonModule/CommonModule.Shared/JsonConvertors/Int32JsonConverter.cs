using System.Text.Json;
using System.Text.Json.Serialization;

namespace CommonModule.Shared.JsonConvertors;

public class Int32JsonConverter : JsonConverter<int>
{
    public override int Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            if (int.TryParse(reader.GetString(), out int value))
            {
                return value;
            }
            throw new JsonException($"Unable to convert \"{reader.GetString()}\" to {typeToConvert}.");
        }
        return reader.GetInt32();
    }

    public override void Write(Utf8JsonWriter writer, int value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(value);
    }
}