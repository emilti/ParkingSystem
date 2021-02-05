using Microsoft.AspNetCore.Mvc;
using ParkingSystem.Common.Responses;
using ParkingSystem.Models.Vehicles;
using ParkingSystem.Server.Infrastructure.Filters;
using ParkingSystem.Server.Models.Vehicles;
using ParkingSystem.Services.Interfaces;
using System;

namespace ParkingSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ParkingController : ControllerBase
    {
        public IVehicleService VehicleService;
        public ParkingController(IVehicleService vehicleService)
        {
            VehicleService = vehicleService;
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetАvailableSpaces()
        {
            return this.Ok("Available parking spaces: " + VehicleService.GetAvailableSpaces());
        }


        [HttpPost]
        [Route("[action]")]
        [GlobalModelStateValidatorAttribute]
        public IActionResult Enter(VehicleEnterModel vehicle)
        {
            ApiResponse response = VehicleService.EnterParking(vehicle.CategoryId, vehicle.DiscountId, vehicle.RegistrationNumber);
            return new JsonResult(response.Message);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Exit(VehicleExitModel vehicle)
        {
            Decimal? dueAmount = VehicleService.ExitParking(vehicle.RegistrationNumber, DateTime.Now);
            if (dueAmount == null)
            {
                return BadRequest("Invalid registration number.");
            }
            return Ok(dueAmount);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetDueAmount(string registrationNumber)
        {
            VehicleInfoModel vehicleInfoModel = VehicleService.GetVehicleByRegistrationNumber(registrationNumber);
            decimal? dueAmount = VehicleService.CalculateDueAmount(vehicleInfoModel.CategoryId, vehicleInfoModel.DiscountId, vehicleInfoModel.EnterParkingDate, DateTime.Now);
            return Ok(dueAmount);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetVehicles()
        {
            var vehicles = VehicleService.GetVehicles();
            return Ok(vehicles);
        }
    }
}

