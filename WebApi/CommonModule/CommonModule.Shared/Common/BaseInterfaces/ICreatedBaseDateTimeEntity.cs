namespace CommonModule.Shared.Common.BaseInterfaces;

/// <summary>
/// Interface for entities that have a creation date and time.
/// </summary>
public interface ICreatedBaseDateTimeEntity
{
    /// <summary>
    /// Gets the date and time when the entity was created.
    /// </summary>
    DateTime CreatedAt { get; set; }
}