using System;

namespace ParkingSystem.Models.Vehicles
{
    public class VehicleInfoResource
    {
        public int Id { get; set; }
        public string RegistrationNumber { get; set; }
        public DateTime EnterParkingDate { get; set; }
        public Decimal? DueAmount { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? DiscountId { get; set; }
        public decimal? DiscountPercentage { get; set; }

        public bool IsInParking { get; set; }
    }
}
