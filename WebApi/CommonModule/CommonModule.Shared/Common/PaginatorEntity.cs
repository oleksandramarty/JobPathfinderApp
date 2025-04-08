namespace CommonModule.Shared.Common;

public class PaginatorEntity: IPaginatorEntity
{
    public PaginatorEntity(int pageNumber, int pageSize, bool isFull)
    {
        PageNumber = pageNumber;
        PageSize = pageSize;
        IsFull = isFull;
    }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool IsFull { get; set; } = false;
}

public interface IPaginatorEntity
{
    int PageNumber { get; set; }
    int PageSize { get; set; }
    bool IsFull { get; set; }
}