using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;
using CommonModule.Shared.JsonConvertors;

namespace Dictionaries.Domain.Models.Countries;

public class CountryEntity : BaseIdEntity<int>, IStatusEntity
{
    [Required] [MaxLength(50)] public required string Title { get; set; }
    [Required] [MaxLength(2)] public required string Code { get; set; }
    [Required] [MaxLength(50)] public required string TitleEn { get; set; }

    public StatusEnum Status { get; set; }
}