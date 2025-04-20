using CommonModule.Shared.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Profile.Domain.Models.Profile;

namespace Profile.Domain;

public class ProfileDataContext: DbSaveChangeContext
{
    public DbSet<UserSkillEntity> UserSkills { get; set; }
    public DbSet<UserLanguageEntity> UserLanguages { get; set; }
    public DbSet<UserProfileItemEntity> UserProfileItems { get; set; }
    public DbSet<UserProfileItemLanguageEntity> UserProfileItemLanguages { get; set; }
    public DbSet<UserProfileItemSkillEntity> UserProfileItemSkills { get; set; }

    public ProfileDataContext(DbContextOptions<ProfileDataContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserSkillEntity>(entity =>
        {
            entity.ToTable("UserSkills", "Profile");
            entity.Property(us => us.Version).IsRequired().HasMaxLength(32).IsFixedLength();
            entity.Property(us => us.SkillId).IsRequired();
            entity.Property(us => us.SkillLevelId).IsRequired();
        });

        modelBuilder.Entity<UserLanguageEntity>(entity =>
        {
            entity.ToTable("UserLanguages", "Profile");
            entity.Property(ul => ul.Version).IsRequired().HasMaxLength(32).IsFixedLength();
            entity.Property(ul => ul.LanguageId).IsRequired();
            entity.Property(ul => ul.LanguageLevelId).IsRequired();
        });

        modelBuilder.Entity<UserProfileItemEntity>(entity =>
        {
            entity.ToTable("UserProfileItems", "Profile");
            entity.Property(upi => upi.Position).IsRequired().HasMaxLength(100);
            entity.Property(upi => upi.Description).HasMaxLength(1000);
            entity.Property(upi => upi.Company).HasMaxLength(100);
            entity.Property(upi => upi.Location).HasMaxLength(50);
            entity.Property(upi => upi.Version).IsRequired().HasMaxLength(32).IsFixedLength();
            entity.Property(upi => upi.ProfileItemType).IsRequired();
            entity.Property(upi => upi.StartDate).IsRequired();
        });

        modelBuilder.Entity<UserProfileItemLanguageEntity>(entity =>
        {
            entity.ToTable("UserProfileItemLanguages", "Profile");
            entity.HasOne(upl => upl.UserProfileItem)
                .WithMany(upi => upi.Languages)
                .HasForeignKey(upl => upl.UserProfileItemId);
            entity.HasOne(upl => upl.UserLanguage)
                .WithMany(ul => ul.UserProfileItems)
                .HasForeignKey(upl => upl.UserProfileItemId);
        });

        modelBuilder.Entity<UserProfileItemSkillEntity>(entity =>
        {
            entity.ToTable("UserProfileItemSkills", "Profile");
            entity.HasOne(upl => upl.UserProfileItem)
                .WithMany(upi => upi.Skills)
                .HasForeignKey(upl => upl.UserProfileItemId);
            entity.HasOne(upl => upl.UserSkill)
                .WithMany(ul => ul.UserProfileItems)
                .HasForeignKey(upl => upl.UserProfileItemId);
        });

        var cascadeFKs = modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetForeignKeys())
            .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

        foreach (var fk in cascadeFKs)
            fk.DeleteBehavior = DeleteBehavior.Restrict;

        base.OnModelCreating(modelBuilder);
    }
}

public class ProfileDataContextFactory : IDesignTimeDbContextFactory<ProfileDataContext>
{
    public ProfileDataContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        var configurationBuilder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment}.json", optional: true);

        var configuration = configurationBuilder.Build();
        var optionsBuilder = new DbContextOptionsBuilder<ProfileDataContext>();
        var connectionString = configuration.GetConnectionString("Database");
        optionsBuilder.UseNpgsql(connectionString);

        return new ProfileDataContext(optionsBuilder.Options);
    }
} 