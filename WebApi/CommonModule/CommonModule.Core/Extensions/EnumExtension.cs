using CommonModule.Shared.Enums;

namespace CommonModule.Core.Extensions;

public static class EnumExtension
{
    public static List<StatusEnum> UserStatuses()
    {
        return [
            StatusEnum.New,
            StatusEnum.Active,
            StatusEnum.Inactive,
            StatusEnum.Blocked,
            StatusEnum.Deleted,
            StatusEnum.Archived
        ];
    }
}