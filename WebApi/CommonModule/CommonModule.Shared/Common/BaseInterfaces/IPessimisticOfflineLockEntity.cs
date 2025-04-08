namespace CommonModule.Shared.Common.BaseInterfaces;

public interface IPessimisticOfflineLockEntity: IBaseVersionEntity
{
    bool IsLocked { get; set; }
    Guid? LockedBy { get; set; }
    DateTime? LockedAt { get; set; }
}