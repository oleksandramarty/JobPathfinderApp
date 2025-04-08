using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Enums;

namespace Dictionaries.Domain.Models.Currencies;

public class CurrencyEntity: BaseIdEntity<int>, IStatusEntity
{
    [Required] [MaxLength(50)] public required string Title { get; set; }
    [Required] [MaxLength(3)] public required string Code { get; set; }
    [Required] [MaxLength(5)] public required string Symbol { get; set; }
    [Required] [MaxLength(50)] public required string TitleEn { get; set; }

    public StatusEnum Status { get; set; }
}