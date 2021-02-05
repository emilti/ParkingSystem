using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParkingSystem.Models.Categories
{
    public class CategoryInfo
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public int ParkingSpaces { get; set; }
    }
}
