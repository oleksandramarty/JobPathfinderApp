﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Profile.Domain;

#nullable disable

namespace Profile.Domain.Migrations
{
    [DbContext(typeof(ProfileDataContext))]
    [Migration("20250413053221_InitProfile")]
    partial class InitProfile
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserLanguageEntity", b =>
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

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character(32)")
                        .IsFixedLength();

                    b.HasKey("Id");

                    b.ToTable("UserLanguages", "Profile");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserProfileItemEntity", b =>
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

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character(32)")
                        .IsFixedLength();

                    b.Property<int?>("WorkArrangementId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("UserProfileItems", "Profile");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserProfileItemLanguageEntity", b =>
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

                    b.ToTable("UserProfileItemLanguages", "Profile");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserProfileItemSkillEntity", b =>
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

                    b.ToTable("UserProfileItemSkills", "Profile");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserSkillEntity", b =>
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

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("character(32)")
                        .IsFixedLength();

                    b.HasKey("Id");

                    b.ToTable("UserSkills", "Profile");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserProfileItemLanguageEntity", b =>
                {
                    b.HasOne("Profile.Domain.Models.Profile.UserLanguageEntity", "UserLanguage")
                        .WithMany("UserProfileItems")
                        .HasForeignKey("UserProfileItemId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Profile.Domain.Models.Profile.UserProfileItemEntity", "UserProfileItem")
                        .WithMany("Languages")
                        .HasForeignKey("UserProfileItemId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("UserLanguage");

                    b.Navigation("UserProfileItem");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserProfileItemSkillEntity", b =>
                {
                    b.HasOne("Profile.Domain.Models.Profile.UserProfileItemEntity", "UserProfileItem")
                        .WithMany("Skills")
                        .HasForeignKey("UserProfileItemId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Profile.Domain.Models.Profile.UserSkillEntity", "UserSkill")
                        .WithMany("UserProfileItems")
                        .HasForeignKey("UserProfileItemId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("UserProfileItem");

                    b.Navigation("UserSkill");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserLanguageEntity", b =>
                {
                    b.Navigation("UserProfileItems");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserProfileItemEntity", b =>
                {
                    b.Navigation("Languages");

                    b.Navigation("Skills");
                });

            modelBuilder.Entity("Profile.Domain.Models.Profile.UserSkillEntity", b =>
                {
                    b.Navigation("UserProfileItems");
                });
#pragma warning restore 612, 618
        }
    }
}
