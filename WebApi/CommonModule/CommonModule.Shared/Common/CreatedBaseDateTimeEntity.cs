using CommonModule.Shared.Common.BaseInterfaces;

namespace CommonModule.Shared.Common;

/// <summary>
/// Base class for entities that have a creation date and time.
/// </summary>
/// <typeparam name="TEntityId">The type of the ID.</typeparam>
public class CreatedBaseDateTimeEntity<TEntityId> : BaseIdEntity<TEntityId>, ICreatedBaseDateTimeEntity
where TEntityId : struct
{
    
    /// <summary>
    /// Gets or sets the date and time when the entity was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}