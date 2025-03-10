namespace CommonModule.Shared.Responses.Base;

public class BaseEntityIdResponse<TEntityId> where TEntityId : struct
{
    public TEntityId Id { get; set; }
}