using CommonModule.Shared.Common.BaseInterfaces;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class UpdateUserProfileItemCommand: AddUserProfileItemCommand, IBaseIdEntity<Guid>
{
    public Guid Id { get; set; }
}