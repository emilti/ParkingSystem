using Microsoft.AspNetCore.Mvc;
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

        [GlobalModelStateValidatorAttribute]
        [HttpPost]
        [Route("[action]")]
        public IActionResult Enter(VehicleEnterModel vehicle) 
        {           
            int? id = VehicleService.EnterParking(vehicle.CategoryId, vehicle.DiscountId, vehicle.RegistrationNumber);
            if(id == null)
            {
                return BadRequest("No available spaces in the parking");
            }
            return Ok("Vehicle with registration number " + vehicle.RegistrationNumber + " entered the parking.");
        }
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult Exit(VehicleExitModel vehicle)
        {
            Decimal? dueAmount = VehicleService.ExitParking(vehicle.RegistrationNumber);
            if(dueAmount == null)
            {
                return BadRequest("Invalid registration number.");
            }
            return Ok(dueAmount);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetDueAmount(string registrationNumber)
        {
            decimal? dueAmount = VehicleService.CalculateDueAmount(registrationNumber, DateTime.Now);
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
