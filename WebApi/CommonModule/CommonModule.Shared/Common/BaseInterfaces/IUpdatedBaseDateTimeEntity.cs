namespace CommonModule.Shared.Common.BaseInterfaces;

/// <summary>
/// Interface for entities that have creation and update date and time.
/// </summary>
public interface IUpdatedBaseDateTimeEntity: ICreatedBaseDateTimeEntity
{
    /// <summary>
    /// Gets or sets the date and time when the entity was last updated.
    /// </summary>
     DateTime? UpdatedAt { get; set; }
}