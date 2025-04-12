using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AuthGateway.Domain.Migrations
{
    /// <inheritdoc />
    public partial class InitUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Users");

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(25)", maxLength: 25, nullable: false),
                    UserRole = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Login = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Headline = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LoginNormalized = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Phone = table.Column<string>(type: "character varying(11)", maxLength: 11, nullable: true),
                    EmailNormalized = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Salt = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsTemporaryPassword = table.Column<bool>(type: "boolean", nullable: false),
                    AuthType = table.Column<int>(type: "integer", nullable: false),
                    LastForgotPassword = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastForgotPasswordRequest = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UserSettingId = table.Column<Guid>(type: "uuid", nullable: true),
                    Version = table.Column<string>(type: "character(32)", fixedLength: true, maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserLanguageEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageId = table.Column<int>(type: "integer", nullable: false),
                    LanguageLevelId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Version = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    UserEntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLanguageEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserLanguageEntity_Users_UserEntityId",
                        column: x => x.UserEntityId,
                        principalSchema: "Users",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserProfileItemEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfileItemType = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Position = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Company = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Location = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CountryId = table.Column<int>(type: "integer", nullable: true),
                    JobTypeId = table.Column<int>(type: "integer", nullable: true),
                    WorkArrangementId = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Version = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    UserEntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileItemEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileItemEntity_Users_UserEntityId",
                        column: x => x.UserEntityId,
                        principalSchema: "Users",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                schema: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Users",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Users",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserSettings",
                schema: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DefaultLocale = table.Column<string>(type: "character(2)", fixedLength: true, maxLength: 2, nullable: false, defaultValue: "en"),
                    TimeZone = table.Column<int>(type: "integer", nullable: true),
                    CountryId = table.Column<int>(type: "integer", nullable: true),
                    CurrencyId = table.Column<int>(type: "integer", nullable: true),
                    ApplicationAiPrompt = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LinkedInUrl = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    NpmUrl = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    GitHubUrl = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PortfolioUrl = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ShowCurrentPosition = table.Column<bool>(type: "boolean", nullable: false),
                    ShowHighestEducation = table.Column<bool>(type: "boolean", nullable: false),
                    Version = table.Column<string>(type: "character(32)", fixedLength: true, maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSettings_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Users",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserSkillEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillId = table.Column<int>(type: "integer", nullable: false),
                    SkillLevelId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Version = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    UserEntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSkillEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSkillEntity_Users_UserEntityId",
                        column: x => x.UserEntityId,
                        principalSchema: "Users",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserProfileItemLanguageEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserLanguageId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserProfileItemId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileItemLanguageEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileItemLanguageEntity_UserLanguageEntity_UserLangua~",
                        column: x => x.UserLanguageId,
                        principalTable: "UserLanguageEntity",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserProfileItemLanguageEntity_UserProfileItemEntity_UserPro~",
                        column: x => x.UserProfileItemId,
                        principalTable: "UserProfileItemEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileItemSkillEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserProfileItemId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileItemSkillEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileItemSkillEntity_UserProfileItemEntity_UserProfil~",
                        column: x => x.UserProfileItemId,
                        principalTable: "UserProfileItemEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProfileItemSkillEntity_UserSkillEntity_UserSkillId",
                        column: x => x.UserSkillId,
                        principalTable: "UserSkillEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserLanguageEntity_UserEntityId",
                table: "UserLanguageEntity",
                column: "UserEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileItemEntity_UserEntityId",
                table: "UserProfileItemEntity",
                column: "UserEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileItemLanguageEntity_UserLanguageId",
                table: "UserProfileItemLanguageEntity",
                column: "UserLanguageId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileItemLanguageEntity_UserProfileItemId",
                table: "UserProfileItemLanguageEntity",
                column: "UserProfileItemId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileItemSkillEntity_UserProfileItemId",
                table: "UserProfileItemSkillEntity",
                column: "UserProfileItemId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileItemSkillEntity_UserSkillId",
                table: "UserProfileItemSkillEntity",
                column: "UserSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                schema: "Users",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSettings_UserId",
                schema: "Users",
                table: "UserSettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSkillEntity_UserEntityId",
                table: "UserSkillEntity",
                column: "UserEntityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserProfileItemLanguageEntity");

            migrationBuilder.DropTable(
                name: "UserProfileItemSkillEntity");

            migrationBuilder.DropTable(
                name: "UserRoles",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "UserSettings",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "UserLanguageEntity");

            migrationBuilder.DropTable(
                name: "UserProfileItemEntity");

            migrationBuilder.DropTable(
                name: "UserSkillEntity");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Users");
        }
    }
}
