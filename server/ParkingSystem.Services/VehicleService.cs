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

        public Decimal? ExitParking(string registrationNumber, DateTime exitParkingDate)
        {           
            //var vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
            //Decimal? dueAmount = CalculateDueAmount(vehicle, exitParkingDate);
            //if (dueAmount != null)
            //{
            //    vehicle.IsInParking = false;
            //    vehicle.ExitParkingDate = exitParkingDate;
            //    this.data.SaveChanges();
            //    return dueAmount;
            //}

            return null;
        }

        public VehicleInfoModel GetVehicleByRegistrationNumber(string registrationNumber)
        {
            var vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
            VehicleInfoModel vehicleInfo = new VehicleInfoModel()
            {
                CategoryId = vehicle.CategoryId,
                DiscountId = vehicle.DiscountId,
                EnterParkingDate = vehicle.EnterParkingDate,
                RegistrationNumber = vehicle.RegistrationNumber
            };
            return vehicleInfo;
        }

        public Decimal? CalculateDueAmount(int vehicleCategoryId, int? vehicleDiscountId, DateTime vehicleEnterParkingDate, DateTime currentDateTime)
        {
            var tarrifs = this.data.Tarrifs.Where(a => a.CategoryId == vehicleCategoryId).ToList();
            if (tarrifs != null && tarrifs.Count > 0)
            {
                Decimal? dueAmount = 0;
                foreach (var tarrif in tarrifs)
                {
                    TimeSpan tarrifTime = new TimeSpan();

                    tarrifTime = CalculationUtilities.GetSameDayTarrifTime(vehicleEnterParkingDate, tarrif, currentDateTime, tarrifTime);
                    tarrifTime = CalculationUtilities.GetMiddleDaysTarrifTime(currentDateTime, vehicleEnterParkingDate, tarrif, tarrifTime);
                    tarrifTime = CalculationUtilities.GetDayOfEntranceTarrifTime(tarrif, vehicleEnterParkingDate, currentDateTime, tarrifTime);

                    dueAmount = dueAmount + (Decimal?)(tarrifTime.TotalSeconds / Constants.TOTAL_SECONDS_IN_HOUR) * tarrif.Price;
                }

                dueAmount = CalculationUtilities.ApplyDiscount(this.data.Discounts, vehicleDiscountId, dueAmount);
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
            var vehicles = this.data.Vehicles.Where(a => a.IsInParking == true).Select(a => new VehicleInfoModel() { RegistrationNumber = a.RegistrationNumber, DiscountId = a.DiscountId, CategoryId = a.CategoryId, EnterParkingDate = a.EnterParkingDate }).ToList();
            foreach (var vehicleInfoModel in vehicles)
            {
                vehicleInfoModel.DueAmount = CalculateDueAmount(vehicleInfoModel.CategoryId, vehicleInfoModel.DiscountId, vehicleInfoModel.EnterParkingDate, DateTime.Now);
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