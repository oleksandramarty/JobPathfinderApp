namespace CommonModule.Shared.Common.BaseInterfaces;

public interface IAuditableNonNullableKey
{
    string? Key { get; set; }
}