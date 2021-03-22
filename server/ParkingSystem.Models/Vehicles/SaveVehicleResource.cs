using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ParkingSystem.Server.Models.Vehicles
{
    public class SaveVehicleResource
    {
        public int CategoryId { get; set; }
        public int? DiscountId { get; set; }
        [Required]
        [StringLength(20)]
        public string RegistrationNumber { get; set; }
        public string token { get; set; }
    }
}
