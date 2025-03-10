using CommonModule.Shared.Responses.Base;

namespace CommonModule.Shared.Common.BaseInterfaces;

public interface ITreeChildrenEntity<TResponse>
{
    ICollection<TResponse> Children { get; set; }
}