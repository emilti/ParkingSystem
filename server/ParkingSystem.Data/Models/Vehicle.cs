using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ParkingSystem.Data.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        [Required]
        [MaxLength(20)]
        public string RegistrationNumber { get; set; }
        public DateTime EnterParkingDate { get; set; }
        public DateTime? ExitParkingDate { get; set; }
        public bool IsInParking { get; set; }
        [Required]
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public int? DiscountId { get; set; }
        public virtual Discount Discount { get; set; }
        [Required]
        public Guid DriverId { get; set; }
        public virtual ApplicationUser Driver { get; set; }
    }
}
