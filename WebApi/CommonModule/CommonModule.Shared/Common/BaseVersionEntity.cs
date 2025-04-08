using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common.BaseInterfaces;
using CommonModule.Shared.Core;

namespace CommonModule.Shared.Common;

public class BaseVersionEntity : IBaseVersionEntity
{
    [Required]
    [StringLength(32, MinimumLength = 32)]
    public string Version { get; set; } = VersionExtension.GenerateVersion();
}