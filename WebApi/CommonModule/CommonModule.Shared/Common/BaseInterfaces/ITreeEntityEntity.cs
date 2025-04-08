namespace CommonModule.Shared.Common.BaseInterfaces;

public interface ITreeEntityEntity<TEntityId, TEntityIdParentId>: IBaseIdEntity<TEntityId>
{
    TEntityIdParentId ParentId { get; set; }
}