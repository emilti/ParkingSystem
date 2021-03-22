using Microsoft.AspNetCore.SignalR;
using ParkingSystem.Models.ParkingDashboard;
using ParkingSystem.Services;
using ParkingSystem.Services.Interfaces;
using System.Threading.Tasks;

namespace ParkingSystem.Server.Hubs
{
    public class DashboardHub : Hub
    {
        public readonly IVehicleService vehicleService ;

        public DashboardHub(IVehicleService vehicleService)
        {
            this.vehicleService = vehicleService;
        }
        public int GetData()
        {
            return this.vehicleService.GetAvailableSpaces();
        }
    }
}
