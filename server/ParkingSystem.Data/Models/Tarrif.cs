using System;
using System.ComponentModel.DataAnnotations;

namespace ParkingSystem.Data.Models
{
    public class Tarrif
    {
        public int TarrifId { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public TimeSpan From { get; set; }
        [Required]
        public TimeSpan To { get; set; }
        [Required]
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}
