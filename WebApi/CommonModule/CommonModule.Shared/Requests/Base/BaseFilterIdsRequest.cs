namespace CommonModule.Shared.Requests.Base;

public class BaseFilterIdsRequest<T>: IBaseFilterIdsRequest<T>
{
    public BaseFilterIdsRequest()
    {
        Ids = new List<T>();
    }
    public List<T> Ids { get; set; }
}

public interface IBaseFilterIdsRequest<T>
{
    List<T> Ids { get; set; }
}