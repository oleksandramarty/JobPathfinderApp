using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuditTrail.Domain.Migrations
{
    /// <inheritdoc />
    public partial class InitAuditTrail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Logs");

            migrationBuilder.CreateTable(
                name: "AuditTrail",
                schema: "Logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EntityType = table.Column<int>(type: "integer", nullable: true),
                    Action = table.Column<int>(type: "integer", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    ExceptionType = table.Column<int>(type: "integer", nullable: true),
                    Message = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    OldValue = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    NewValue = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Payload = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Uri = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditTrail", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditTrailArchive",
                schema: "Logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ArchiveDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditTrailArchive", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditTrailArchive_AuditTrail_Id",
                        column: x => x.Id,
                        principalSchema: "Logs",
                        principalTable: "AuditTrail",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditTrailArchive",
                schema: "Logs");

            migrationBuilder.DropTable(
                name: "AuditTrail",
                schema: "Logs");
        }
    }
}
