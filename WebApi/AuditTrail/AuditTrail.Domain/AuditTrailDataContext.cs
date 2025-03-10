using AuditTrail.Domain.Models;
using CommonModule.Shared.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace AuditTrail.Domain;

public class AuditTrailDataContext : DbSaveChangeContext
{
    public DbSet<AuditTrailEntity> AuditTrail { get; set; }
    public DbSet<AuditTrailArchiveEntity> AuditTrailArchive { get; set; }

    public AuditTrailDataContext(DbContextOptions<AuditTrailDataContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditTrailEntity>(entity =>
        {
            entity.ToTable("AuditTrail", "Logs");
            entity.Property(e => e.EntityType).HasColumnName("EntityType");
            entity.Property(e => e.Action).HasColumnName("Action");
            entity.Property(e => e.Type).HasColumnName("Type");
            entity.Property(e => e.ExceptionType).HasColumnName("ExceptionType");
            entity.Property(e => e.Message).HasMaxLength(500).HasColumnName("Message");
            entity.Property(e => e.EntityId).HasColumnName("EntityId");
            entity.Property(e => e.OldValue).HasMaxLength(1000).HasColumnName("OldValue");
            entity.Property(e => e.NewValue).HasMaxLength(1000).HasColumnName("NewValue");
            entity.Property(e => e.Payload).HasMaxLength(1000).HasColumnName("Payload");
            entity.Property(e => e.Uri).HasMaxLength(200).HasColumnName("Uri");
            entity.Property(e => e.UserId).HasColumnName("UserId");
        });

        modelBuilder.Entity<AuditTrailArchiveEntity>(entity =>
        {
            entity.ToTable("AuditTrailArchive", "Logs");
            entity.Property(e => e.EntityType).HasColumnName("EntityType");
            entity.Property(e => e.Action).HasColumnName("Action");
            entity.Property(e => e.Type).HasColumnName("Type");
            entity.Property(e => e.ExceptionType).HasColumnName("ExceptionType");
            entity.Property(e => e.Message).HasMaxLength(2000).HasColumnName("Message");
            entity.Property(e => e.EntityId).HasColumnName("EntityId");
            entity.Property(e => e.OldValue).HasMaxLength(1000).HasColumnName("OldValue");
            entity.Property(e => e.NewValue).HasMaxLength(1000).HasColumnName("NewValue");
            entity.Property(e => e.Payload).HasMaxLength(1000).HasColumnName("Payload");
            entity.Property(e => e.Uri).HasMaxLength(200).HasColumnName("Uri");
            entity.Property(e => e.UserId).HasColumnName("UserId");
        });

        var cascadeFKs = modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetForeignKeys())
            .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

        foreach (var fk in cascadeFKs)
            fk.DeleteBehavior = DeleteBehavior.Restrict;

        base.OnModelCreating(modelBuilder);
    }
}

public class AuditTrailDataContextFactory : IDesignTimeDbContextFactory<AuditTrailDataContext>
{
    public AuditTrailDataContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        var configurationBuilder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment}.json", optional: true);

        var configuration = configurationBuilder.Build();
        var optionsBuilder = new DbContextOptionsBuilder<AuditTrailDataContext>();
        var connectionString = configuration.GetConnectionString("Database");
        optionsBuilder.UseNpgsql(connectionString);

        return new AuditTrailDataContext(optionsBuilder.Options);
    }
}