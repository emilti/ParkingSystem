using ParkingSystem.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ParkingSystem.Common.Utils
{
    public static class CalculationUtilities
    {
        public static int CalculateOccupiedParkingSpaces(IEnumerable<Category> categories, IEnumerable<IGrouping<int, Vehicle>> groupedVehicles)
        {
            int occupiedParkingSpaces = 0;
            foreach (var vehiclesGroup in groupedVehicles)
            {
                int categoryParkingSpaces = categories.FirstOrDefault(a => a.CategoryId == vehiclesGroup.Key).ParkingSpaces;
                occupiedParkingSpaces += vehiclesGroup.Count() * categoryParkingSpaces;
            }

            return occupiedParkingSpaces;
        }

        public static decimal? ApplyDiscount(IEnumerable<Discount> discounts, Vehicle vehicle, decimal? dueAmount)
        {
            var discountPercentage = discounts.FirstOrDefault(a => a.DiscountId == vehicle.DiscountId)?.DiscountPercentage;
            discountPercentage = discountPercentage != null ? discountPercentage : 0;
            dueAmount = dueAmount - dueAmount * discountPercentage / 100;
            return dueAmount;
        }
        public static TimeSpan GetSameDayTarrifTime(DateTime enteredParkingDate, Tarrif tarrif, DateTime currentDateTime, TimeSpan tarrifTime)
        {
            //Vehicle Entered time in the Parking and Current time in the same tarrif time
            if (currentDateTime.Date == enteredParkingDate.Date
               && tarrif.From <= currentDateTime.TimeOfDay
               && tarrif.To >= currentDateTime.TimeOfDay
               && currentDateTime.TimeOfDay <= tarrif.To
               && enteredParkingDate.TimeOfDay >= tarrif.From)
            {
                tarrifTime = tarrifTime + (currentDateTime.TimeOfDay - enteredParkingDate.TimeOfDay);
            }

            // Entered time in the tarrif time, Current time after the end of the tarrif time
            if (currentDateTime.Date == enteredParkingDate.Date
               && tarrif.From <= enteredParkingDate.TimeOfDay
               && tarrif.To >= enteredParkingDate.TimeOfDay
               && currentDateTime.TimeOfDay >= tarrif.To)
            {
                tarrifTime = tarrifTime + (tarrif.To - enteredParkingDate.TimeOfDay);
            }

            // Entered time before the tarrif time, Current time after the end of the tarrif time
            if (currentDateTime.Date == enteredParkingDate.Date
               && tarrif.From >= enteredParkingDate.TimeOfDay
               && currentDateTime.TimeOfDay >= tarrif.To)
            {
                tarrifTime = tarrifTime + (tarrif.To - tarrif.From);
            }

            // Entered time before the tarrif time, Current time in the tarrif time
            if (currentDateTime.Date == enteredParkingDate.Date
               && tarrif.From >= enteredParkingDate.TimeOfDay
               && currentDateTime.TimeOfDay <= tarrif.To
               && currentDateTime.TimeOfDay >= tarrif.From)
            {
                tarrifTime = tarrifTime + (currentDateTime.TimeOfDay - tarrif.From);
            }

            // Entered time day before Current day, Current time in the tarrif time
            if (currentDateTime.Date > enteredParkingDate.Date
                && tarrif.From <= currentDateTime.TimeOfDay
                && currentDateTime.TimeOfDay <= tarrif.To)
            {
                tarrifTime = tarrifTime + (currentDateTime.TimeOfDay - tarrif.From);
            }

            // Entered time day before current day, Current time after the end of the tarrif time
            if (currentDateTime.TimeOfDay > tarrif.To
                && currentDateTime.Date > enteredParkingDate.Date)
            {
                tarrifTime = tarrifTime + (tarrif.To - tarrif.From);
            }

            return tarrifTime;
        }

        public static TimeSpan GetMiddleDaysTarrifTime(DateTime currentDateTime, DateTime vehicleEntryDate, Tarrif tarrif, TimeSpan tarrifTime)
        {
            if (currentDateTime.Day > vehicleEntryDate.Day + 1)
            {
                tarrifTime = tarrifTime + (currentDateTime.Day - vehicleEntryDate.Day - 1) * (tarrif.To - tarrif.From);
            }

            return tarrifTime;
        }
        public static TimeSpan GetDayOfEntranceTarrifTime(Tarrif tarrif, DateTime enterParkingDate, DateTime currentDateTime, TimeSpan tarrifTime)
        {
            if (currentDateTime.Day > enterParkingDate.Day
                && enterParkingDate.TimeOfDay >= tarrif.From
                && enterParkingDate.TimeOfDay <= tarrif.To)
            {
                tarrifTime = tarrifTime + (tarrif.To - enterParkingDate.TimeOfDay);
            }

            if (currentDateTime.Day > enterParkingDate.Day
                && enterParkingDate.TimeOfDay <= tarrif.From)
            {
                tarrifTime = tarrifTime + (tarrif.To - tarrif.From);
            }

            return tarrifTime;
        }
    }
}
