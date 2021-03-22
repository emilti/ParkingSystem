using ParkingSystem.Models.Categories;
using ParkingSystem.Models.Discounts;
using System.Collections.Generic;

namespace ParkingSystem.Models.ParkingDashboard
{
    public class ParkingStaticDataResource
    {
        public int TotalParkingSpaces { get; set; }
        public List<CategoryInfo> Categories { get; set; }
        public List<DiscountInfo> Discounts { get; set; }
    }
}
