using CommonModule.Shared.Common;
using CommonModule.Shared.Common.BaseInterfaces;
using Microsoft.EntityFrameworkCore;

namespace CommonModule.Shared.Core;

/// <summary>
/// The database save change context.
/// </summary>
public class DbSaveChangeContext : DbContext
{
    public DbSaveChangeContext(DbContextOptions options)
        : base(options)
    {
    }
    
    /// <summary>
    /// Saves the changes made to the database.
    /// </summary>
    /// <returns></returns>
    public override int SaveChanges()
    {
        SetAuditProperties();
        return base.SaveChanges();
    }

    /// <summary>
    /// Saves the changes async made to the database.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns></returns>
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetAuditProperties();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void SetAuditProperties()
    {
        foreach (var entry in ChangeTracker.Entries<ICreatedBaseDateTimeEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
        }

        foreach (var entry in ChangeTracker.Entries<IUpdatedBaseDateTimeEntity>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        foreach (var entry in ChangeTracker.Entries<IBaseVersionEntity>())
        {
            if (entry.State == EntityState.Modified || entry.State == EntityState.Added)
            {
                entry.Entity.Version = VersionExtension.GenerateVersion();
            }
        }
    }
}