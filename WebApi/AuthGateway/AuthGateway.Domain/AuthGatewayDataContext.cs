using AuthGateway.Domain.Models.Users;
using CommonModule.Shared.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace AuthGateway.Domain;

public class AuthGatewayDataContext : DbSaveChangeContext
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<RoleEntity> Roles { get; set; }
    public DbSet<UserRoleEntity> UserRoles { get; set; }
    public DbSet<UserSettingEntity> UserSettings { get; set; }

    public AuthGatewayDataContext(DbContextOptions<AuthGatewayDataContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.ToTable("Users", "Users");
            entity.HasMany(u => u.Roles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId);
            entity.HasOne(u => u.UserSetting)
                .WithOne(us => us.User)
                .HasForeignKey<UserSettingEntity>(us => us.UserId);
            entity.Property(u => u.Login).IsRequired().HasMaxLength(50);
            entity.Property(u => u.LoginNormalized).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(50);
            entity.Property(u => u.EmailNormalized).IsRequired().HasMaxLength(50);
            entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(120);
            entity.Property(u => u.Salt).IsRequired().HasMaxLength(64);
            entity.Property(u => u.Version).IsRequired().HasMaxLength(32).IsFixedLength();
        });

        modelBuilder.Entity<RoleEntity>(entity =>
        {
            entity.ToTable("Roles", "Users");
            entity.HasMany(r => r.Users)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId);
            entity.Property(r => r.Title).IsRequired().HasMaxLength(25);
        });

        modelBuilder.Entity<UserRoleEntity>(entity =>
        {
            entity.ToTable("UserRoles", "Users");
            entity.HasKey(ur => new { ur.UserId, ur.RoleId });
        });

        modelBuilder.Entity<UserSettingEntity>(entity =>
        {
            entity.ToTable("UserSettings", "Users");
            entity.Property(v => v.DefaultLocale).IsRequired().HasMaxLength(2).IsFixedLength().HasDefaultValue("en");
            entity.Property(v => v.Version).IsRequired().HasMaxLength(32).IsFixedLength();
        });

        var cascadeFKs = modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetForeignKeys())
            .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

        foreach (var fk in cascadeFKs)
            fk.DeleteBehavior = DeleteBehavior.Restrict;

        base.OnModelCreating(modelBuilder);
    }
}

public class AuthGatewayDataContextFactory : IDesignTimeDbContextFactory<AuthGatewayDataContext>
{
    public AuthGatewayDataContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        var configurationBuilder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment}.json", optional: true);

        var configuration = configurationBuilder.Build();
        var optionsBuilder = new DbContextOptionsBuilder<AuthGatewayDataContext>();
        var connectionString = configuration.GetConnectionString("Database");
        optionsBuilder.UseNpgsql(connectionString);

        return new AuthGatewayDataContext(optionsBuilder.Options);
    }
}
