using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Shared.Common;

/// <summary>
/// Base class for entities that have creation and update date and time.
/// </summary>
/// <typeparam name="TEntityId">The type of the ID.</typeparam>
public class BaseDateTimeEntity<TEntityId> : BaseIdEntity<TEntityId>, ICreatedBaseDateTimeEntity, IUpdatedBaseDateTimeEntity
where TEntityId : struct
{
    /// <summary>
    /// Gets or sets the date and time when the entity was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the entity was last updated.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}