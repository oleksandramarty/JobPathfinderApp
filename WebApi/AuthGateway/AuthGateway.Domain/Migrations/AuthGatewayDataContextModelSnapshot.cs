﻿// <auto-generated />
using System;
using AuthGateway.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AuthGateway.Domain.Migrations
{
    [DbContext(typeof(AuthGatewayDataContext))]
    partial class AuthGatewayDataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserLanguageEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("LanguageId")
                        .HasColumnType("integer");

                    b.Property<int>("LanguageLevelId")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("UserEntityId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.HasKey("Id");

                    b.HasIndex("UserEntityId");

                    b.ToTable("UserLanguageEntity");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserProfileItemEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Company")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int?>("CountryId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("JobTypeId")
                        .HasColumnType("integer");

                    b.Property<string>("Location")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int>("ProfileItemType")
                        .HasColumnType("integer");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("UserEntityId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.Property<int?>("WorkArrangementId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserEntityId");

                    b.ToTable("UserProfileItemEntity");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserProfileItemLanguageEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("UserLanguageId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserProfileItemId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserSkillId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserLanguageId");

                    b.HasIndex("UserProfileItemId");

                    b.ToTable("UserProfileItemLanguageEntity");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserProfileItemSkillEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserProfileItemId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserSkillId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserProfileItemId");

                    b.HasIndex("UserSkillId");

                    b.ToTable("UserProfileItemSkillEntity");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserSkillEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("SkillId")
                        .HasColumnType("integer");

                    b.Property<int>("SkillLevelId")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("UserEntityId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character varying(32)");

                    b.HasKey("Id");

                    b.HasIndex("UserEntityId");

                    b.ToTable("UserSkillEntity");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.RoleEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(25)
                        .HasColumnType("character varying(25)");

                    b.Property<int>("UserRole")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("Roles", "Users");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.UserEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("AuthType")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("EmailNormalized")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("FirstName")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Headline")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<bool>("IsTemporaryPassword")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastForgotPassword")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("LastForgotPasswordRequest")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastName")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("LoginNormalized")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(120)
                        .HasColumnType("character varying(120)");

                    b.Property<string>("Phone")
                        .HasMaxLength(11)
                        .HasColumnType("character varying(11)");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("UserSettingId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character(32)")
                        .IsFixedLength();

                    b.HasKey("Id");

                    b.ToTable("Users", "Users");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.UserRoleEntity", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRoles", "Users");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.UserSettingEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("ApplicationAiPrompt")
                        .HasColumnType("boolean");

                    b.Property<int?>("CountryId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("CurrencyId")
                        .HasColumnType("integer");

                    b.Property<string>("DefaultLocale")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(2)
                        .HasColumnType("character(2)")
                        .HasDefaultValue("en")
                        .IsFixedLength();

                    b.Property<string>("GitHubUrl")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("LinkedInUrl")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("NpmUrl")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("PortfolioUrl")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int?>("TimeZone")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character(32)")
                        .IsFixedLength();

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserSettings", "Users");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserLanguageEntity", b =>
                {
                    b.HasOne("AuthGateway.Domain.Models.Users.UserEntity", null)
                        .WithMany("Languages")
                        .HasForeignKey("UserEntityId");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserProfileItemEntity", b =>
                {
                    b.HasOne("AuthGateway.Domain.Models.Users.UserEntity", null)
                        .WithMany("ProfileItems")
                        .HasForeignKey("UserEntityId");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserProfileItemLanguageEntity", b =>
                {
                    b.HasOne("AuthGateway.Domain.Models.Profile.UserLanguageEntity", "UserLanguage")
                        .WithMany("UserProfileItems")
                        .HasForeignKey("UserLanguageId");

                    b.HasOne("AuthGateway.Domain.Models.Profile.UserProfileItemEntity", "UserProfileItem")
                        .WithMany("Languages")
                        .HasForeignKey("UserProfileItemId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("UserLanguage");

                    b.Navigation("UserProfileItem");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserProfileItemSkillEntity", b =>
                {
                    b.HasOne("AuthGateway.Domain.Models.Profile.UserProfileItemEntity", "UserProfileItem")
                        .WithMany("Skills")
                        .HasForeignKey("UserProfileItemId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("AuthGateway.Domain.Models.Profile.UserSkillEntity", "UserSkill")
                        .WithMany("UserProfileItems")
                        .HasForeignKey("UserSkillId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("UserProfileItem");

                    b.Navigation("UserSkill");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserSkillEntity", b =>
                {
                    b.HasOne("AuthGateway.Domain.Models.Users.UserEntity", null)
                        .WithMany("Skills")
                        .HasForeignKey("UserEntityId");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.UserRoleEntity", b =>
                {
                    b.HasOne("AuthGateway.Domain.Models.Users.RoleEntity", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("AuthGateway.Domain.Models.Users.UserEntity", "User")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.UserSettingEntity", b =>
                {
                    b.HasOne("AuthGateway.Domain.Models.Users.UserEntity", "User")
                        .WithOne("UserSetting")
                        .HasForeignKey("AuthGateway.Domain.Models.Users.UserSettingEntity", "UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserLanguageEntity", b =>
                {
                    b.Navigation("UserProfileItems");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserProfileItemEntity", b =>
                {
                    b.Navigation("Languages");

                    b.Navigation("Skills");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Profile.UserSkillEntity", b =>
                {
                    b.Navigation("UserProfileItems");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.RoleEntity", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("AuthGateway.Domain.Models.Users.UserEntity", b =>
                {
                    b.Navigation("Languages");

                    b.Navigation("ProfileItems");

                    b.Navigation("Roles");

                    b.Navigation("Skills");

                    b.Navigation("UserSetting");
                });
#pragma warning restore 612, 618
        }
    }
}
