using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ParkingSystem.Common.Responses;
using ParkingSystem.Models.Vehicles;
using ParkingSystem.Server.Infrastructure.Filters;
using ParkingSystem.Server.Models.Vehicles;
using ParkingSystem.Server.Validators;
using ParkingSystem.Services.Interfaces;
using System;

namespace ParkingSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ParkingController : ControllerBase
    {
        public readonly IVehicleService vehicleService;
        public readonly ICategoryService categoryService;
        public readonly IDiscountService discountService;
        public ParkingController(IVehicleService vehicleService, ICategoryService categoryService, IDiscountService discountService)
        {
            this.vehicleService = vehicleService;
            this.categoryService = categoryService;
            this.discountService = discountService;
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetАvailableSpaces()
        {
            return this.Ok("Available parking spaces: " + vehicleService.GetAvailableSpaces());
        }


        [HttpPost]
        [Route("[action]")]
        [GlobalModelStateValidatorAttribute]
        public IActionResult Enter(SaveVehicleResource vehicle)
        {
            ApiResponse response = vehicleService.SaveVehicle(vehicle.CategoryId, vehicle.DiscountId, vehicle.RegistrationNumber);
            return StatusCode(response.StatusCode, response.Message);
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
            VehicleInfoModel vehicleInfoModel = vehicleService.GetVehicleByRegistrationNumber(registrationNumber);
            decimal? dueAmount = vehicleService.CalculateDueAmount(vehicleInfoModel.CategoryId, vehicleInfoModel.DiscountId, vehicleInfoModel.EnterParkingDate, DateTime.Now);
            return StatusCode(StatusCodes.Status200OK, dueAmount);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetVehicles()
        {
            var vehicles = vehicleService.GetVehicles();
            return Ok(vehicles);
        }
    }
}

