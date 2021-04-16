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

        public VehicleInfoResource SoftDeleteVehicle(string registrationNumber, DateTime exitParkingDate)
        {
            Vehicle vehicle = this.data.Vehicles.FirstOrDefault(a => a.RegistrationNumber == registrationNumber && a.IsInParking == true);
            vehicle.IsInParking = false;
            vehicle.ExitParkingDate = exitParkingDate;
            this.data.SaveChanges();
            Decimal? dueAmount = CalculationUtilities.CalculateDueAmount(this.data, vehicle.CategoryId, vehicle.DiscountId, vehicle.EnterParkingDate, exitParkingDate);
            VehicleInfoResource vehicleInfo = new VehicleInfoResource()
            {
                Id = vehicle.VehicleId,
                RegistrationNumber = vehicle.RegistrationNumber,
                IsInParking = false,
                EnterParkingDate = vehicle.EnterParkingDate,
                ExitParkingDate = vehicle.ExitParkingDate,
                CategoryId = vehicle.CategoryId,
                DiscountId = vehicle.DiscountId,
                DueAmount = dueAmount
            };
            return vehicleInfo;
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

        public decimal? CalculateDueAmount(int vehicleCategoryId, int? vehicleDiscountId, DateTime vehicleEnterParkingDate, DateTime currentDateTime)
        {
            return CalculationUtilities.CalculateDueAmount(this.data, vehicleCategoryId, vehicleDiscountId, vehicleEnterParkingDate, currentDateTime);
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
            var vehicles = data.Vehicles.Where(a => a.IsInParking == true).Select(a => new VehicleInfoResource() { Id = a.VehicleId, RegistrationNumber = a.RegistrationNumber, DiscountId = a.DiscountId, CategoryId = a.CategoryId, EnterParkingDate = a.EnterParkingDate, ExitParkingDate = a.ExitParkingDate, IsInParking = a.IsInParking, CategoryName = GetCategoryName(a, categories), DiscountPercentage = GetDiscountPercentage(a, discounts) }).ToList();
            foreach (var vehicleInfoModel in vehicles)
            {
                vehicleInfoModel.DueAmount = CalculationUtilities.CalculateDueAmount(this.data, vehicleInfoModel.CategoryId, vehicleInfoModel.DiscountId, vehicleInfoModel.EnterParkingDate, DateTime.Now);
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
            var vehicles = this.data.Vehicles.Where(a => a.DriverId == AppUserId).Select(a => new VehicleInfoResource() { Id = a.VehicleId, RegistrationNumber = a.RegistrationNumber, CategoryId = a.CategoryId, DiscountId = a.DiscountId, ExitParkingDate = a.ExitParkingDate, EnterParkingDate = a.EnterParkingDate, IsInParking = a.IsInParking }).ToList();
            foreach (var vehicle in vehicles)
            {
                vehicle.DueAmount = CalculationUtilities.CalculateDueAmount(this.data, vehicle.CategoryId, vehicle.DiscountId, vehicle.EnterParkingDate, DateTime.Now);
                vehicle.Category = categoryService.GetCategoryById(vehicle.CategoryId);
                vehicle.Discount = discountService.GetDiscountsById(vehicle.DiscountId);
            }
            return vehicles;
        }

        public PagedVehiclesResource GetFilteredVehicles(string registrationNumber, int[] selectedCatecories, int?[] selectedDiscounts, bool? isInParking, DateTime[] dateRange, int? sorting, int? sortingOrder, int page, int itemsPerPage)
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
            if(isInParking == null)
            {

            }

            var propertyInfo = sorting != null ? typeof(VehicleInfoResource).GetProperty(((Sortings)sorting).ToString()) : null;
            var vehicles = data.Vehicles
            .Where(a => a.RegistrationNumber.Contains(registrationNumber)
                && selectedCatecories.Contains(a.CategoryId)
                && selectedDiscounts.Contains(a.DiscountId == null ? Constants.NO_DISCOUNTS : a.DiscountId)
                && (isInParking == null || isInParking == a.IsInParking)
                && dateRange[0] <= a.EnterParkingDate && a.EnterParkingDate <= dateRange[1])
            .Select(a => new VehicleInfoResource()
            {
                Id = a.VehicleId,
                RegistrationNumber = a.RegistrationNumber,
                DiscountId = a.DiscountId,
                CategoryId = a.CategoryId,
                EnterParkingDate = a.EnterParkingDate,
                ExitParkingDate = a.ExitParkingDate,
                IsInParking = a.IsInParking,
                CategoryName = GetCategoryName(a, categories),
                DiscountPercentage = GetDiscountPercentage(a, discounts),
                DueAmount = CalculationUtilities.CalculateDueAmount(this.data, a.CategoryId, a.DiscountId, a.EnterParkingDate, DateTime.Now)
            }).ToList();
            PagedVehiclesResource pagedVehicles = new PagedVehiclesResource();

            if (sortingOrder == (int?)SortingOrders.Ascending && propertyInfo != null)
            {
                pagedVehicles.vehicles = vehicles.OrderBy(x => propertyInfo.GetValue(x, null)).Skip(itemsPerPage * (page - 1)).Take(itemsPerPage).ToList();
                pagedVehicles.vehiclesCount = vehicles.Count;
                return pagedVehicles;
            }
            if (sortingOrder == (int?)SortingOrders.Descending && propertyInfo != null)
            {
                pagedVehicles.vehicles = vehicles.OrderByDescending(x => propertyInfo.GetValue(x, null)).Skip(itemsPerPage * (page - 1)).Take(itemsPerPage).ToList();
                pagedVehicles.vehiclesCount = vehicles.Count;
                return pagedVehicles;
            }

            pagedVehicles.vehicles = vehicles.Skip(itemsPerPage * (page - 1)).Take(itemsPerPage).ToList();
            pagedVehicles.vehiclesCount = vehicles.Count;
            return pagedVehicles;
        }

        public ApiResponse EditVehicle(int id, string registrationNumber, bool isInParking, int CategoryId, int? discountId)
        {
            var vehicle = this.data.Vehicles.FirstOrDefault(a => a.VehicleId == id);
            if(vehicle != null)
            {
                vehicle.RegistrationNumber = registrationNumber;
                vehicle.IsInParking = isInParking;
                vehicle.CategoryId = CategoryId;
                vehicle.DiscountId = discountId != 999 ? discountId : null;
                this.data.Vehicles.Update(vehicle);
                this.data.SaveChanges();
                return new ApiResponse(200);
            }

            return new ApiResponse(400);
        }
    }
}