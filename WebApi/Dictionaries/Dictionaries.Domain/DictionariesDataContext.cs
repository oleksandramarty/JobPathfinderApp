using CommonModule.Shared.Core;
using Dictionaries.Domain.Models.Countries;
using Dictionaries.Domain.Models.Currencies;
using Dictionaries.Domain.Models.ExperienceLevels;
using Dictionaries.Domain.Models.JobSources;
using Dictionaries.Domain.Models.JobTypes;
using Dictionaries.Domain.Models.Languages;
using Dictionaries.Domain.Models.Skills;
using Dictionaries.Domain.Models.WorkArrangements;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Dictionaries.Domain;

public class DictionariesDataContext : DbSaveChangeContext
{
    public DbSet<CountryEntity> Countries { get; set; }
    public DbSet<SkillEntity> Skills { get; set; }
    public DbSet<SkillLevelEntity> SkillLevels { get; set; }
    
    public DbSet<LanguageEntity> Languages { get; set; }
    public DbSet<LanguageLevelEntity> LanguageLevels { get; set; }
    
    public DbSet<CurrencyEntity> Currencies { get; set; }
    public DbSet<ExperienceLevelEntity> ExperienceLevels { get; set; }
    public DbSet<JobSourceEntity> JobSources { get; set; }
    public DbSet<JobTypeEntity> JobTypes { get; set; }
    public DbSet<WorkArrangementEntity> WorkArrangements { get; set; }
    

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
        
        modelBuilder.Entity<SkillLevelEntity>(entity =>
        {
            entity.ToTable("SkillLevels", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(50);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
        });
        
        modelBuilder.Entity<LanguageEntity>(entity =>
        {
            entity.ToTable("Languages", "Dictionaries");
            entity.Property(c => c.IsoCode).IsRequired().HasMaxLength(3);
            entity.Property(c => c.Title).IsRequired().HasMaxLength(50);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
            entity.Property(c => c.Status).IsRequired();
        });
        
        modelBuilder.Entity<LanguageLevelEntity>(entity =>
        {
            entity.ToTable("LanguageLevels", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(50);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
            entity.Property(c => c.Status).IsRequired();
        });
        
        modelBuilder.Entity<CurrencyEntity>(entity =>
        {
            entity.ToTable("Currencies", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(50);
            entity.Property(c => c.Code).IsRequired().HasMaxLength(3);
            entity.Property(c => c.Symbol).IsRequired().HasMaxLength(5);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
            entity.Property(c => c.Status).IsRequired();
        });
        
        modelBuilder.Entity<ExperienceLevelEntity>(entity =>
        {
            entity.ToTable("ExperienceLevels", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(100);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(100);
        });
        modelBuilder.Entity<JobSourceEntity>(entity =>
        {
            entity.ToTable("JobSources", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(100);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
        });
        modelBuilder.Entity<JobTypeEntity>(entity =>
        {
            entity.ToTable("JobTypes", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(100);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
        });
        modelBuilder.Entity<WorkArrangementEntity>(entity =>
        {
            entity.ToTable("WorkArrangements", "Dictionaries");
            entity.Property(c => c.Title).IsRequired().HasMaxLength(100);
            entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(50);
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