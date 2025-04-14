using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Profile.Domain.Migrations
{
    /// <inheritdoc />
    public partial class InitProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Profile");

            migrationBuilder.CreateTable(
                name: "UserLanguages",
                schema: "Profile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageId = table.Column<int>(type: "integer", nullable: false),
                    LanguageLevelId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Version = table.Column<string>(type: "character(32)", fixedLength: true, maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLanguages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileItems",
                schema: "Profile",
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
                    Version = table.Column<string>(type: "character(32)", fixedLength: true, maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserSkills",
                schema: "Profile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillId = table.Column<int>(type: "integer", nullable: false),
                    SkillLevelId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Version = table.Column<string>(type: "character(32)", fixedLength: true, maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSkills", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileItemLanguages",
                schema: "Profile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserProfileItemId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileItemLanguages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileItemLanguages_UserLanguages_UserProfileItemId",
                        column: x => x.UserProfileItemId,
                        principalSchema: "Profile",
                        principalTable: "UserLanguages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProfileItemLanguages_UserProfileItems_UserProfileItemId",
                        column: x => x.UserProfileItemId,
                        principalSchema: "Profile",
                        principalTable: "UserProfileItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProfileItemSkills",
                schema: "Profile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserProfileItemId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileItemSkills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfileItemSkills_UserProfileItems_UserProfileItemId",
                        column: x => x.UserProfileItemId,
                        principalSchema: "Profile",
                        principalTable: "UserProfileItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserProfileItemSkills_UserSkills_UserProfileItemId",
                        column: x => x.UserProfileItemId,
                        principalSchema: "Profile",
                        principalTable: "UserSkills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileItemLanguages_UserProfileItemId",
                schema: "Profile",
                table: "UserProfileItemLanguages",
                column: "UserProfileItemId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileItemSkills_UserProfileItemId",
                schema: "Profile",
                table: "UserProfileItemSkills",
                column: "UserProfileItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserProfileItemLanguages",
                schema: "Profile");

            migrationBuilder.DropTable(
                name: "UserProfileItemSkills",
                schema: "Profile");

            migrationBuilder.DropTable(
                name: "UserLanguages",
                schema: "Profile");

            migrationBuilder.DropTable(
                name: "UserProfileItems",
                schema: "Profile");

            migrationBuilder.DropTable(
                name: "UserSkills",
                schema: "Profile");
        }
    }
}
