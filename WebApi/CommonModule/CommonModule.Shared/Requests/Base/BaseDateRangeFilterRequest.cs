namespace CommonModule.Shared.Requests.Base;

public class BaseDateRangeFilterRequest: IBaseDateRangeFilterRequest
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public interface IBaseDateRangeFilterRequest
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}