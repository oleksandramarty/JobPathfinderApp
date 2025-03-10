using CommonModule.Shared.Common;

namespace AuthGateway.Domain.Models.Users;

public class UserRoleEntity: BaseIdEntity<Guid>
{
    public Guid UserId { get; set; }
    public UserEntity? User { get; set; }
    public int RoleId { get; set; }
    public RoleEntity? Role { get; set; }
}