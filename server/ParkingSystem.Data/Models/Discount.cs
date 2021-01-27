using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ParkingSystem.Data.Models
{
    public class Discount
    {
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public int DiscountId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int DiscountPercentage { get; set; }
    }
}
