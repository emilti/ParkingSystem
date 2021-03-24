using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ParkingSystem.Data.Migrations
{
    public partial class AddVehicleToUserRelationsip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DriverId",
                table: "Vehicles",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "DriverId1",
                table: "Vehicles",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_DriverId1",
                table: "Vehicles",
                column: "DriverId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_AspNetUsers_DriverId1",
                table: "Vehicles",
                column: "DriverId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_AspNetUsers_DriverId1",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_DriverId1",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "DriverId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "DriverId1",
                table: "Vehicles");
        }
    }
}
