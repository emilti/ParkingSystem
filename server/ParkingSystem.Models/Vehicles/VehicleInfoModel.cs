using System;

namespace ParkingSystem.Models.Vehicles
{
    public class VehicleInfoModel
    {
        public string RegistrationNumber { get; set; }
        public DateTime EnterParkingDate { get; set; }
        public Decimal? DueAmount { get; set; }
        public int CategoryId { get; set; }
        public int? DiscountId { get; set; }
    }
}
