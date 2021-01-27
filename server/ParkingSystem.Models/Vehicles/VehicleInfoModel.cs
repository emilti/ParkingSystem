using System;

namespace ParkingSystem.Models.Vehicles
{
    public class VehicleInfoModel
    {
        public string RegistrationNumber { get; set; }
        public DateTime EnterDate { get; set; }
        public Decimal? DueAmount { get; set; }
    }
}
