using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Shared.Common;

public class BaseIdEntity<TEntityId>: IBaseIdEntity<TEntityId>
where TEntityId : struct
{
    public TEntityId Id { get; set; }
}