using System.Text.Json;
using System.Text.Json.Serialization;

namespace CommonModule.Shared.JsonConvertors;

public class BooleanJsonConverter : JsonConverter<bool>
{
    public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            return reader.GetInt32() != 0;
        }
        else if (reader.TokenType == JsonTokenType.String)
        {
            if (bool.TryParse(reader.GetString(), out bool result))
            {
                return result;
            }
            else if (int.TryParse(reader.GetString(), out int intResult))
            {
                return intResult != 0;
            }
        }
        return reader.GetBoolean();
    }

    public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
    {
        writer.WriteBooleanValue(value);
    }
}