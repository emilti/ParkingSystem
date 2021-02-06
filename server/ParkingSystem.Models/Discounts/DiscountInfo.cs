using System;
using System.Collections.Generic;
using System.Text;

namespace ParkingSystem.Models.Discounts
{
    public class DiscountInfo
    {
        public int DiscountId { get; set; }
        public string Name { get; set; }
        public int DiscountPercentage { get; set; }
    }
}
