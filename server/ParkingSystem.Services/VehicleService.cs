using ParkingSystem.Common;
using ParkingSystem.Common.Responses;
using ParkingSystem.Common.Utils;
using ParkingSystem.Data;
using ParkingSystem.Data.Models;
using ParkingSystem.Models.Categories;
using ParkingSystem.Models.Discounts;
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
        public readonly IDiscountService discountService;
        public VehicleService(ParkingSystemDbContext data, ICategoryService categoryService, IDiscountService discountService)
        {
            this.data = data;
            this.categoryService = categoryService;
            this.discountService = discountService;
        }

        public ApiResponse SaveVehicle(int categoryId, int? discountId, string registrationNumber, string appUserId)
        {

            var vehicle = new Vehicle
            {
                CategoryId = categoryId,
                DiscountId = discountId,
                EnterParkingDate = DateTime.Now,
                RegistrationNumber = registrationNumber,
                IsInParking = true,
                DriverId = new Guid(appUserId)
            };

            this.data.Add(vehicle);
            this.data.SaveChanges();
            return new ApiOkResponse(vehicle, "Vehicle with registration number " + vehicle.RegistrationNumber + " entered the parking.");
        }

        public ApiResponse SoftDeleteVehicle(string registrationNumber, DateTime exitParkingDate)
        {
            Vehicle vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
            vehicle.IsInParking = false;
            vehicle.ExitParkingDate = exitParkingDate;
            this.data.SaveChanges();
            Decimal? dueAmount = this.CalculateDueAmount(vehicle.CategoryId, vehicle.DiscountId, vehicle.EnterParkingDate, exitParkingDate);
            return new ApiOkResponse(vehicle, "Vehicle with registration number " + vehicle.RegistrationNumber + " exit the parking. Amount due: " + dueAmount);
        }

        public VehicleInfoResource GetVehicleByRegistrationNumber(string registrationNumber)
        {
            var vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
            VehicleInfoResource vehicleInfo = new VehicleInfoResource()
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
            var groupedVehicles = this.data.Vehicles.Where(a => a.IsInParking == true).ToList().Select(a => new VehicleInfoResource() { CategoryId = a.CategoryId, RegistrationNumber = a.RegistrationNumber, DiscountId = a.DiscountId, EnterParkingDate = a.EnterParkingDate }).GroupBy(a => a.CategoryId);
            int occupiedParkingSpaces = CalculationUtilities.CalculateOccupiedParkingSpaces(this.categoryService.GetCategories(), groupedVehicles);
            return Constants.TOTAL_PARKING_SPACES - occupiedParkingSpaces;
        }

        public List<VehicleInfoResource> GetVehicles()
        {
            var categories = this.categoryService.GetCategories();
            var discounts = this.discountService.GetDiscounts();
            var vehicles = data.Vehicles.Where(a => a.IsInParking == true).Select(a => new VehicleInfoResource() { Id = a.VehicleId, RegistrationNumber = a.RegistrationNumber, DiscountId = a.DiscountId, CategoryId = a.CategoryId, EnterParkingDate = a.EnterParkingDate, CategoryName = GetCategoryName(a, categories), DiscountPercentage = GetDiscountPercentage(a, discounts) }).ToList();
            foreach (var vehicleInfoModel in vehicles)
            {
                vehicleInfoModel.DueAmount = CalculateDueAmount(vehicleInfoModel.CategoryId, vehicleInfoModel.DiscountId, vehicleInfoModel.EnterParkingDate, DateTime.Now);
            }
            return vehicles;
        }

        private static int? GetDiscountPercentage(Vehicle a, List<DiscountInfo> discounts)
        {
            return discounts.FirstOrDefault(d => d.DiscountId == a.DiscountId)?.DiscountPercentage;
        }

        private static string GetCategoryName(Vehicle a, List<CategoryInfo> categories)
        {
            return categories.FirstOrDefault(bc => bc.CategoryId == a.CategoryId)?.Name;
        }

        public List<VehicleInfoResource> GetVehiclesInParking()
        {
            return this.data.Vehicles.Where(a => a.IsInParking == true).Select(a => new VehicleInfoResource() { RegistrationNumber = a.RegistrationNumber, DiscountId = a.DiscountId, CategoryId = a.CategoryId, EnterParkingDate = a.EnterParkingDate }).ToList();
        }

        public List<VehicleInfoResource> GetVehiclesByUser(Guid AppUserId)
        {
            var vehicles = this.data.Vehicles.Where(a => a.DriverId == AppUserId).Select(a => new VehicleInfoResource() { RegistrationNumber = a.RegistrationNumber, CategoryId = a.CategoryId, DiscountId = a.DiscountId, ExitParkingDate = a.ExitParkingDate, EnterParkingDate = a.EnterParkingDate, IsInParking = a.IsInParking }).ToList();
            foreach (var vehicle in vehicles)
            {
                vehicle.DueAmount = CalculateDueAmount(vehicle.CategoryId, vehicle.DiscountId, vehicle.EnterParkingDate, DateTime.Now);
                vehicle.Category = categoryService.GetCategoryById(vehicle.CategoryId);
                vehicle.Discount = discountService.GetDiscountsById(vehicle.DiscountId);
            }
            return vehicles;
        }

        public List<VehicleInfoResource> GetFilteredVehicles(string registrationNumber, int[] selectedCatecories, int?[] selectedDiscounts, int? sorting, int? sortingOrder)
        {
            var categories = this.categoryService.GetCategories();
            var discounts = this.discountService.GetDiscounts();
            if (selectedCatecories.Contains(Constants.ALL_CATEGORIES) || selectedCatecories.Count() == 0)
            {
                selectedCatecories = this.categoryService.GetCategories().Select(a => a.CategoryId).ToArray();
            }
            if (selectedDiscounts.Contains(Constants.ALL_DISCOUNTS) || selectedDiscounts.Count() == 0)
            {
                selectedDiscounts = this.discountService.GetDiscounts().Select(a => a.DiscountId).Cast<int?>().ToArray();
            }
            var test = Common.Sortings.DueAmount.ToString();
            var vehicles = data.Vehicles
                .Where(a => a.RegistrationNumber.Contains(registrationNumber) &&
                selectedCatecories.Contains(a.CategoryId) &&
                selectedDiscounts.Contains(a.DiscountId == null ? Constants.NO_DISCOUNTS : a.DiscountId))
                .Select(a => new VehicleInfoResource()
                {
                    Id = a.VehicleId,
                    RegistrationNumber = a.RegistrationNumber,
                    DiscountId = a.DiscountId,
                    CategoryId = a.CategoryId,
                    EnterParkingDate = a.EnterParkingDate,
                    CategoryName = GetCategoryName(a, categories),
                    DiscountPercentage = GetDiscountPercentage(a, discounts)
                    //DueAmount = CalculateDueAmount(a.CategoryId, a.DiscountId, a.EnterParkingDate, DateTime.Now)
                }).ToList();
            foreach (var vehicleInfoModel in vehicles)
            {
                vehicleInfoModel.DueAmount = CalculateDueAmount(vehicleInfoModel.CategoryId, vehicleInfoModel.DiscountId, vehicleInfoModel.EnterParkingDate, DateTime.Now);
            }
            return vehicles;
        }
    }
}