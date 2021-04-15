using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParkingSystem.Models.Vehicles
{
    public class PagedVehiclesResource
    {
        public List<VehicleInfoResource> vehicles { get; set; }
        public int? vehiclesCount { get; set; }
    }
}
