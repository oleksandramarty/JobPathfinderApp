namespace CommonModule.Core.Extensions;

public static class DateTimeExtension
{
    public static DateTime GetStartOfCurrentMonth()
    {
        return new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).ToUniversalTime();
    }

    public static DateTime GetEndOfCurrentMonth()
    {
        return new DateTime(DateTime.Now.Year, DateTime.Now.Month,
            DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month), 23, 59, 59).ToUniversalTime();
    }

    public static DateTime GetStartOfCurrentDay()
    {
        return DateTime.Today.ToUniversalTime();
    }

    public static DateTime GetEndOfCurrentDay()
    {
        return DateTime.Today.AddDays(1).AddTicks(-1).ToUniversalTime();
    }

    public static DateTime GetStartOfCurrentHour()
    {
        var now = DateTime.Now;
        return new DateTime(now.Year, now.Month, now.Day, now.Hour, 0, 0).ToUniversalTime();
    }

    public static DateTime GetEndOfCurrentHour()
    {
        var now = DateTime.Now;
        return new DateTime(now.Year, now.Month, now.Day, now.Hour, 59, 59).ToUniversalTime();
    }

    public static DateTime GetStartOfCurrentYear()
    {
        return new DateTime(DateTime.Now.Year, 1, 1).ToUniversalTime();
    }

    public static DateTime GetEndOfCurrentYear()
    {
        return new DateTime(DateTime.Now.Year, 12, 31, 23, 59, 59).ToUniversalTime();
    }

    public static void SetMidnight(this DateTime? date)
    {
        if (date.HasValue)
        {
            date = new DateTime(date.Value.Year, date.Value.Month, date.Value.Day, 0, 0, 0).ToUniversalTime();
        }
    }
}