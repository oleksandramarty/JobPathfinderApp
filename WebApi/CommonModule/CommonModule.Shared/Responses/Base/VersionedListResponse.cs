using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Shared.Responses.Base;

public class VersionedListResponse<TResponse>: BaseVersionEntity
{
    public List<TResponse> Items { get; set; } = new List<TResponse>();
}