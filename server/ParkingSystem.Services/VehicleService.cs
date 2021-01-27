using ParkingSystem.Common;
using ParkingSystem.Common.Utils;
using ParkingSystem.Data;
using ParkingSystem.Data.Models;
using ParkingSystem.Models.Vehicles;
using ParkingSystem.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ParkingSystem.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly ParkingSystemDbContext data;

        public VehicleService(ParkingSystemDbContext data)
        {
            this.data = data;
        }

        public int? EnterParking(int categoryId, int? discountId, string registrationNumber)
        {
            bool hasParkingSpacesAvailable = ValidateVehicleData(categoryId);
            if (!hasParkingSpacesAvailable)
            {
                return null;
            }
            var vehicle = new Vehicle
            {
                CategoryId = categoryId,
                DiscountId = discountId,
                EnterParkingDate = DateTime.Now,
                RegistrationNumber = registrationNumber,
                IsInParking = true
            };

            this.data.Add(vehicle);
            this.data.SaveChanges();
            return vehicle.VehicleId;
        }

        public Decimal? ExitParking(string registrationNumber)
        {
            DateTime exitParkingDate = DateTime.Now;
            Decimal? dueAmount = CalculateDueAmount(registrationNumber, exitParkingDate);
            if (dueAmount != null)
            {
                var vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
                vehicle.IsInParking = false;
                vehicle.ExitParkingDate = exitParkingDate;
                this.data.SaveChanges();
                return dueAmount;
            }

            return null;
        }

        public Decimal? CalculateDueAmount(string registrationNumber, DateTime currentDateTime)
        {
            var vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber);
            if (vehicle == null)
            {
                return null;
            }

            var tarrifs = this.data.Tarrifs.Where(a => a.CategoryId == vehicle.CategoryId).ToList();
            if (tarrifs != null && tarrifs.Count > 0)
            {
                Decimal? dueAmount = 0;
                foreach (var tarrif in tarrifs)
                {
                    TimeSpan tarrifTime = new TimeSpan();

                    tarrifTime = CalculationUtilities.GetSameDayTarrifTime(vehicle.EnterParkingDate, tarrif, currentDateTime, tarrifTime);
                    tarrifTime = CalculationUtilities.GetMiddleDaysTarrifTime(currentDateTime, vehicle.EnterParkingDate, tarrif, tarrifTime);
                    tarrifTime = CalculationUtilities.GetDayOfEntranceTarrifTime(tarrif, vehicle.EnterParkingDate, currentDateTime, tarrifTime);

                    dueAmount = dueAmount + (Decimal?)(tarrifTime.TotalSeconds / Constants.TOTAL_SECONDS_IN_HOUR) * tarrif.Price;
                }

                dueAmount = CalculationUtilities.ApplyDiscount(this.data.Discounts, vehicle, dueAmount);
                var dueAmountFormatted = FormatUtilities.FormatDecimal(dueAmount);
                return dueAmountFormatted;
            }

            return null;
        }

        public int GetAvailableSpaces()
        {
            var groupedVehicles = this.data.Vehicles.Where(a => a.IsInParking == true).ToList().GroupBy(a => a.CategoryId);
            int occupiedParkingSpaces = CalculationUtilities.CalculateOccupiedParkingSpaces(this.data.Categories, groupedVehicles);
            return Constants.TOTAL_PARKING_SPACES - occupiedParkingSpaces;
        }

        public List<VehicleInfoModel> GetVehicles()
        {
            var vehicles = this.data.Vehicles.Where(a => a.IsInParking == true).Select(a => new VehicleInfoModel() { RegistrationNumber = a.RegistrationNumber, EnterDate = a.EnterParkingDate }).ToList();

            foreach (var vehicle in vehicles)
            {
                vehicle.DueAmount = CalculateDueAmount(vehicle.RegistrationNumber, DateTime.Now);
            }

            return vehicles;
        }

        protected bool ValidateVehicleData(int categoryId)
        {
            Category vehicleCategory = this.data.Categories.FirstOrDefault(a => a.CategoryId == categoryId);
            var groupedVehicles = this.data.Vehicles.ToList().GroupBy(a => a.CategoryId);
            int occupiedParkingSpacesAfterVehicleEnter = CalculationUtilities.CalculateOccupiedParkingSpaces(this.data.Categories, groupedVehicles) + vehicleCategory.ParkingSpaces;
            if (occupiedParkingSpacesAfterVehicleEnter + vehicleCategory.ParkingSpaces > Constants.TOTAL_PARKING_SPACES)
            {
                return false;
            }
            return true;
        }
    }
}