using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Localizations.Domain.Migrations
{
    /// <inheritdoc />
    public partial class InitLocalization : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Locales");

            migrationBuilder.CreateTable(
                name: "Locales",
                schema: "Locales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsoCode = table.Column<string>(type: "character(2)", fixedLength: true, maxLength: 2, nullable: false),
                    Title = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TitleNormalized = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TitleEnNormalized = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    LocaleEnum = table.Column<int>(type: "integer", nullable: false),
                    Culture = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locales", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Localizations",
                schema: "Locales",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Value = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ValueEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    LocaleId = table.Column<int>(type: "integer", nullable: false),
                    LocaleId1 = table.Column<int>(type: "integer", nullable: true),
                    IsPublic = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localizations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Localizations_Locales_LocaleId",
                        column: x => x.LocaleId,
                        principalSchema: "Locales",
                        principalTable: "Locales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Localizations_Locales_LocaleId1",
                        column: x => x.LocaleId1,
                        principalSchema: "Locales",
                        principalTable: "Locales",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Localizations_LocaleId_Key",
                schema: "Locales",
                table: "Localizations",
                columns: new[] { "LocaleId", "Key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Localizations_LocaleId1",
                schema: "Locales",
                table: "Localizations",
                column: "LocaleId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Localizations",
                schema: "Locales");

            migrationBuilder.DropTable(
                name: "Locales",
                schema: "Locales");
        }
    }
}
