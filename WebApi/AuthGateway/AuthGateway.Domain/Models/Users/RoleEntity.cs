using System.ComponentModel.DataAnnotations;
using CommonModule.Shared.Common;
using CommonModule.Shared.Enums;

namespace AuthGateway.Domain.Models.Users;

public class RoleEntity: BaseIdEntity<int>
{
    [Required] [MaxLength(25)] public required string Title { get; set; }
    public UserRoleEnum UserRole { get; set; }
    
    public ICollection<UserRoleEntity> Users { get; set; }
}