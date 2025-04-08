using CommonModule.Shared.Core;
using Localizations.Domain.Models.Locales;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Localizations.Domain;

public class LocalizationsDataContext : DbSaveChangeContext
{
    public DbSet<LocaleEntity> Locales { get; set; }
    public DbSet<LocalizationEntity> Localizations { get; set; }


    public LocalizationsDataContext(DbContextOptions<LocalizationsDataContext> options)
        : base(options)
    {
    }

    // Overriding the OnModelCreating method to configure the model
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuring the Contact entity to map to the "Contacts.Contact" table
        modelBuilder.Entity<LocaleEntity>(entity =>
        {
            entity.ToTable("Locales", "Locales");

            entity.Property(e => e.IsoCode)
                .IsRequired()
                .HasMaxLength(2)
                .IsFixedLength();

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.TitleEn)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.TitleNormalized)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.TitleEnNormalized)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Culture)
                .IsRequired()
                .HasMaxLength(8);

            entity.Property(e => e.IsDefault)
                .IsRequired();

            entity.Property(e => e.Status)
                .IsRequired();

            entity.Property(e => e.LocaleEnum)
                .IsRequired();

            entity.HasMany(e => e.Localizations)
                .WithOne()
                .HasForeignKey("LocaleId")
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<LocalizationEntity>(entity =>
        {
            entity.ToTable("Localizations", "Locales");

            entity.Property(e => e.Key)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(e => e.Value)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.ValueEn)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.LocaleId)
                .IsRequired();

            entity.Property(e => e.IsPublic)
                .IsRequired();
        });

        modelBuilder.Entity<LocalizationEntity>()
            .HasIndex(l => new { l.LocaleId, l.Key })
            .IsUnique();

        // Changing cascade delete behavior to restrict delete for all foreign keys
        var cascadeFKs = modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetForeignKeys())
            .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

        foreach (var fk in cascadeFKs)
            fk.DeleteBehavior = DeleteBehavior.Restrict;

        base.OnModelCreating(modelBuilder);
    }
}

public class LocalizationsDataContextFactory : IDesignTimeDbContextFactory<LocalizationsDataContext>
{
    public LocalizationsDataContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        var configurationBuilder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment}.json", optional: true);

        var configuration = configurationBuilder.Build();
        var optionsBuilder = new DbContextOptionsBuilder<LocalizationsDataContext>();
        var connectionString = configuration.GetConnectionString("Database");
        optionsBuilder.UseNpgsql(connectionString);

        return new LocalizationsDataContext(optionsBuilder.Options);
    }
}