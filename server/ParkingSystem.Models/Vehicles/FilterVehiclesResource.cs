using System;
using System.ComponentModel.DataAnnotations;

namespace ParkingSystem.Models.Vehicles
{
    public class FilterVehiclesResource
    {
        public string registrationNumber { get; set; }
        public int[] selectedCategories { get; set; }
        public int?[] selectedDiscounts { get; set; }
        public bool? selectedIsInParkingOption { get; set; }
        public DateTime[] selectedDateRange { get; set; }
        public int? selectedSorting { get; set; }
        public int? selectedSortingOrder { get; set; }
        public int selectedPage { get; set; }
        public int selectedItemsPerPage { get; set; }
    }
}
