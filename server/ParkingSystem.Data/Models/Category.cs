using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ParkingSystem.Data.Models
{
    public class Category
    {
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public ICollection<Tarrif> Tarrifs { get; set; } = new List<Tarrif>();
        public int CategoryId { get; set; }
        [Required]
        [StringLength(20)]
        public string Name { get; set; }
        [Required]
        public int ParkingSpaces { get; set; }
    }
}
