using CommonModule.Shared.Common;

namespace CommonModule.Shared.Requests.Base;

public class BaseFilterRequest: IBaseFilterRequest
{
    public PaginatorEntity? Paginator { get; set; }
    public BaseSortableRequest? Sort { get; set; }
    public BaseDateRangeFilterRequest? DateRange { get; set; }
    public BaseAmountRangeFilterRequest? AmountRange { get; set; }
    
    public string? Query { get; set; }
}

public interface IBaseFilterRequest
{
    PaginatorEntity? Paginator { get; set; }
    BaseSortableRequest? Sort { get; set; }
    BaseDateRangeFilterRequest? DateRange { get; set; }
    BaseAmountRangeFilterRequest? AmountRange { get; set; }
    string? Query { get; set; }
}