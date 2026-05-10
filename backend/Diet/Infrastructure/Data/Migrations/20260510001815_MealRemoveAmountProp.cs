using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Diet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MealRemoveAmountProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Meals");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Amount",
                table: "Meals",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
