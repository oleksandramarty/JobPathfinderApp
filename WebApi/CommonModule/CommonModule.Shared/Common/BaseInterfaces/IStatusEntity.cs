using System.Text.Json.Serialization;
using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Common.BaseInterfaces;

public interface IStatusEntity
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    StatusEnum Status { get; set; }
}