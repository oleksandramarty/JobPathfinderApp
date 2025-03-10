using CommonModule.Shared.Core;
using Dictionaries.Domain.Models.Countries;
using Dictionaries.Domain.Models.Skills;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Dictionaries.Domain;

public class DictionariesDataContext : DbSaveChangeContext
{
    public DbSet<CountryEntity> Countries { get; set; }
    public DbSet<SkillEntity> Skills { get; set; }

    public DictionariesDataContext(DbContextOptions<DictionariesDataContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CountryEntity>(entity =>
        {
            entity.ToTable("Countries", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(50);
            entity.Property(c => c.Code).IsRequired().HasMaxLength(2).IsFixedLength();
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
        });
        
        modelBuilder.Entity<SkillEntity>(entity =>
        {
            entity.ToTable("Skills", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(100);
        });

        var cascadeFKs = modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetForeignKeys())
            .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

        foreach (var fk in cascadeFKs)
            fk.DeleteBehavior = DeleteBehavior.Restrict;

        base.OnModelCreating(modelBuilder);
    }
}

public class DictionariesDataContextFactory : IDesignTimeDbContextFactory<DictionariesDataContext>
{
    public DictionariesDataContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        var configurationBuilder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment}.json", optional: true);

        var configuration = configurationBuilder.Build();
        var optionsBuilder = new DbContextOptionsBuilder<DictionariesDataContext>();
        var connectionString = configuration.GetConnectionString("Database");
        optionsBuilder.UseNpgsql(connectionString);

        return new DictionariesDataContext(optionsBuilder.Options);
    }
}