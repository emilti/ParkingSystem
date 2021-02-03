using ParkingSystem.Data.Models;
using ParkingSystem.Models.Vehicles;
using System;
using System.Collections.Generic;

namespace ParkingSystem.Services.Interfaces
{
    public interface IVehicleService
    {
        int GetAvailableSpaces();
        int? EnterParking(int categoryId, int? discountId, string registrationNumber);
        VehicleInfoModel GetVehicleByRegistrationNumber(string registrationNumber);
        Decimal? ExitParking(string registrationNumber, DateTime exitParkingDate);
        Decimal? CalculateDueAmount(int vehicleCategoryId, int? vehicleDiscountId, DateTime vehicleEnterParkingDate, DateTime currentDateTime);
        List<VehicleInfoModel> GetVehicles();
    }
}
