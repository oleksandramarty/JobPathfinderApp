using CommonModule.Shared.Common.BaseInterfaces;

namespace Profile.Mediatr.Mediatr.Profile.Commands;

public class UpdateUserSkillCommand: AddUserSkillCommand, IBaseIdEntity<Guid>
{
    public Guid Id { get; set; }
}