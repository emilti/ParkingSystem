namespace ParkingSystem.Models.Vehicles
{
    public class FilterVehiclesResource
    {
        public string registrationNumber { get; set; }
        public int[] selectedCategories { get; set; }
        public int[] selectedDiscounts { get; set; }
    }
}
