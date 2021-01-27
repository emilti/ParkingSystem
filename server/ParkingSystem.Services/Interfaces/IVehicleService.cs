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
        Decimal? ExitParking(string registrationNumber);
        Decimal? CalculateDueAmount(string registrationNumber, DateTime currentDateTime);
        List<VehicleInfoModel> GetVehicles();
    }
}
