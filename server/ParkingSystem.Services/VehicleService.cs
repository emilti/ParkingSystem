﻿using ParkingSystem.Common;
using ParkingSystem.Common.Responses;
using ParkingSystem.Common.Utils;
using ParkingSystem.Data;
using ParkingSystem.Data.Models;
using ParkingSystem.Models.Categories;
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
        public readonly ICategoryService categoryService;

        public VehicleService(ParkingSystemDbContext data, ICategoryService categoryService)
        {
            this.data = data;
            this.categoryService = categoryService;
        }

        public ApiResponse SaveVehicle(int categoryId, int? discountId, string registrationNumber)
        {
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
            return new ApiOkResponse(vehicle, "Vehicle with registration number " + vehicle.RegistrationNumber + " entered the parking.");
        }

        public ApiResponse? SoftDeleteVehicle(string registrationNumber, DateTime exitParkingDate)
        {
            Vehicle vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
            vehicle.IsInParking = false;
            vehicle.ExitParkingDate = exitParkingDate;
            this.data.SaveChanges();
            Decimal? dueAmount = this.CalculateDueAmount(vehicle.CategoryId, vehicle.DiscountId, vehicle.EnterParkingDate, exitParkingDate);
            return new ApiOkResponse(vehicle, "Vehicle with registration number " + vehicle.RegistrationNumber + " exit the parking. Amount due: " + dueAmount);
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

                    tarrifTime = CalculationUtilities.GetSameDayTarrifTime(vehicleEnterParkingDate, currentDateTime, tarrif, tarrifTime);
                    tarrifTime = CalculationUtilities.GetMiddleDaysTarrifTime(vehicleEnterParkingDate, currentDateTime, tarrif, tarrifTime);
                    tarrifTime = CalculationUtilities.GetDayOfEntranceTarrifTime(vehicleEnterParkingDate, currentDateTime, tarrif, tarrifTime);

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
            var groupedVehicles = this.data.Vehicles.Where(a => a.IsInParking == true).ToList().Select(a => new VehicleInfoModel() { CategoryId = a.CategoryId , RegistrationNumber = a.RegistrationNumber, DiscountId = a.DiscountId , EnterParkingDate = a.EnterParkingDate }).GroupBy(a => a.CategoryId);
            int occupiedParkingSpaces = CalculationUtilities.CalculateOccupiedParkingSpaces(this.categoryService.GetCategories(), groupedVehicles);
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

        public List<VehicleInfoModel> GetVehiclesInParking()
        {
            return this.data.Vehicles.Where(a => a.IsInParking == true).Select(a => new VehicleInfoModel() { RegistrationNumber = a.RegistrationNumber, DiscountId = a.DiscountId, CategoryId = a.CategoryId, EnterParkingDate = a.EnterParkingDate }).ToList();
        }

        public VehicleInfoModel GetVehicleByRegistrationNumber(string registrationNumber)
        {
            var vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
            return new VehicleInfoModel() { RegistrationNumber = vehicle.RegistrationNumber, DiscountId = vehicle.DiscountId, CategoryId = vehicle.CategoryId, EnterParkingDate = vehicle.EnterParkingDate };
        }
    }
}