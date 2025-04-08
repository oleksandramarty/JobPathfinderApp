using System.ComponentModel.DataAnnotations;

namespace CommonModule.Shared.Common.BaseInterfaces;

public interface IBaseVersionEntity
{
    string Version { get; set; }
}