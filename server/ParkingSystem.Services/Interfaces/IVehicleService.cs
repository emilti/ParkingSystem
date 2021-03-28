using ParkingSystem.Common.Responses;
using ParkingSystem.Models.Categories;
using ParkingSystem.Models.Vehicles;
using System;
using System.Collections.Generic;

namespace ParkingSystem.Services.Interfaces
{
    public interface IVehicleService
    {
        int GetAvailableSpaces();
        ApiResponse SaveVehicle(int categoryId, int? discountId, string registrationNumber, string AppUserId);
        VehicleInfoResource GetVehicleByRegistrationNumber(string registrationNumber);
        ApiResponse? SoftDeleteVehicle(string registrationNumber, DateTime exitParkingDate);
        Decimal? CalculateDueAmount(int vehicleCategoryId, int? vehicleDiscountId, DateTime vehicleEnterParkingDate, DateTime currentDateTime);
        List<VehicleInfoResource> GetVehicles();
        List<VehicleInfoResource> GetVehiclesInParking();
        List<VehicleInfoResource> GetVehiclesByUser(Guid AppUserId);
        List<VehicleInfoResource> GetFilteredVehicles(string registrationNumber, int[] selectedCatecories, int[] selectedDiscounts);
    }
}
