namespace CommonModule.Shared.Requests.Base;

public class BaseAmountRangeFilterRequest: IBaseAmountRangeFilterRequest
{
    public decimal? AmountFrom { get; set; }
    public decimal? AmountTo { get; set; }
}

public interface IBaseAmountRangeFilterRequest
{
    public decimal? AmountFrom { get; set; }
    public decimal? AmountTo { get; set; }
}