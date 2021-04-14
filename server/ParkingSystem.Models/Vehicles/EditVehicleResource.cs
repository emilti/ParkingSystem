using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParkingSystem.Models.Vehicles
{
    public class EditVehicleResource
    {
        public int id { get; set; }
        public string registrationNumber { get; set; }
        public DateTime EnterParkingDate { get; set; }
        public DateTime? ExitParkingDate { get; set; }
        public Decimal? DueAmount { get; set; }
        public int categoryId { get; set; }
        public int? discountId { get; set; }
        public bool isInParking { get; set; }
    }
}
