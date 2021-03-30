using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ParkingSystem.Common.Responses;
using ParkingSystem.Data.Models;
using ParkingSystem.Models.ParkingDashboard;
using ParkingSystem.Models.Vehicles;
using ParkingSystem.Server.Hubs;
using ParkingSystem.Server.Infrastructure.Filters;
using ParkingSystem.Server.Infrastructure.Helpers;
using ParkingSystem.Server.Models.Vehicles;
using ParkingSystem.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace ParkingSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ParkingController : ControllerBase
    {
        public readonly IVehicleService vehicleService;
        public readonly ICategoryService categoryService;
        public readonly IDiscountService discountService;
        private readonly IHubContext<DashboardHub> hubContext;
        private readonly IAuthHelper authHelper;
        public ParkingController(IVehicleService vehicleService, ICategoryService categoryService, IDiscountService discountService, IHubContext<DashboardHub> hubContext, IAuthHelper authHelper)
        {
            this.vehicleService = vehicleService;
            this.categoryService = categoryService;
            this.discountService = discountService;
            this.hubContext = hubContext;
            this.authHelper = authHelper;
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetАvailableSpaces()
        {
            var spaces = new { availableSpaces = vehicleService.GetAvailableSpaces() };
            return this.Ok(spaces);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetParkingStaticData()
        {
            ParkingStaticDataResource staticDataResource = new ParkingStaticDataResource()
            {
                TotalParkingSpaces = Common.Constants.TOTAL_PARKING_SPACES,
                Categories = this.categoryService.GetCategories(),
                Discounts = this.discountService.GetDiscounts()
            };
            
            return this.Ok(staticDataResource);
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = "Driver, Administrator")]
        [GlobalModelStateValidatorAttribute]
        public async Task<IActionResult> Enter(SaveVehicleResource vehicle)
        {
            ApplicationUser userExists = await authHelper.GetUserFromToken(vehicle.token);
            ApiResponse response = vehicleService.SaveVehicle(vehicle.CategoryId, vehicle.DiscountId, vehicle.RegistrationNumber, userExists.Id);
            await CallHub();
            return StatusCode(response.StatusCode, response.Message);
        }

        private async Task CallHub()
        {
            FreeParkingSpacesResource statistics = new FreeParkingSpacesResource();
            statistics.FreeParkingSpaces = this.vehicleService.GetAvailableSpaces();
            await this.hubContext.Clients.All.SendAsync("RefreshStatistics", statistics);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Exit(SoftDeleteVehicleResource vehicle)
        {
            var response = vehicleService.SoftDeleteVehicle(vehicle.RegistrationNumber, DateTime.Now);
            return StatusCode(response.StatusCode, response.Message);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetDueAmount(string registrationNumber)
        {
            VehicleInfoResource vehicleInfoModel = vehicleService.GetVehicleByRegistrationNumber(registrationNumber);
            decimal? dueAmount = vehicleService.CalculateDueAmount(vehicleInfoModel.CategoryId, vehicleInfoModel.DiscountId, vehicleInfoModel.EnterParkingDate, DateTime.Now);
            return StatusCode(StatusCodes.Status200OK, dueAmount);
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize(Roles = "Administrator")]
        public IActionResult GetVehicles()
        {
            var vehicles = vehicleService.GetVehicles();
            return Ok(vehicles);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCategories()
        {
            var categories = categoryService.GetCategories();
            return Ok(categories);
        }


        [HttpGet]
        [Route("[action]")]
        public IActionResult GetDiscounts()
        {
            var discounts = discountService.GetDiscounts();
            return Ok(discounts);
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = "Administrator")]
        public IActionResult FilterVehicles([FromBody]FilterVehiclesResource filterVehiclesResource)
        {
            return this.Ok(this.vehicleService.GetFilteredVehicles(filterVehiclesResource.registrationNumber, filterVehiclesResource.selectedCategories, filterVehiclesResource.selectedDiscounts, filterVehiclesResource.selectedSorting, filterVehiclesResource.selectedSortingOrder));
        }
    }
}

