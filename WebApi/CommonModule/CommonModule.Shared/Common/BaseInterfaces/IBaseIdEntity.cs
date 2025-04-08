namespace CommonModule.Shared.Common.BaseInterfaces;

public interface IBaseIdEntity<TEntityId>
{
    TEntityId Id { get; set; }
}