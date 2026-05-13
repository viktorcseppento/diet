using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Diet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedTargetsAndAllergens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Targets",
                table: "People",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Allergens",
                table: "Foods",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Targets",
                table: "People");

            migrationBuilder.DropColumn(
                name: "Allergens",
                table: "Foods");
        }
    }
}
