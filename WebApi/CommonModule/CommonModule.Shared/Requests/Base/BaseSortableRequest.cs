using CommonModule.Shared.Enums;

namespace CommonModule.Shared.Requests.Base;

public class BaseSortableRequest: IBaseSortableRequest
{
    public BaseSortableRequest()
    {
        
    }
    public BaseSortableRequest(ColumnEnum column, OrderDirectionEnum direction)
    {
        Column = column;
        Direction = direction;
    }

    public ColumnEnum? Column { get; set; }
    public OrderDirectionEnum? Direction { get; set; }
}

public interface IBaseSortableRequest
{
    public ColumnEnum? Column { get; set; }
    public OrderDirectionEnum? Direction { get; set; }
}