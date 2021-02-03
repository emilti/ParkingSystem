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

        public static decimal? ApplyDiscount(IEnumerable<Discount> discounts, int? discountId, decimal? dueAmount)
        {
            var discountPercentage = discounts.FirstOrDefault(a => a.DiscountId == discountId)?.DiscountPercentage;
            discountPercentage = discountPercentage != null ? discountPercentage : 0;
            dueAmount = dueAmount - dueAmount * discountPercentage / 100;
            return dueAmount;
        }
        public static TimeSpan GetSameDayTarrifTime(DateTime enteredParkingDate, DateTime currentDateTime, Tarrif tarrif, TimeSpan tarrifTime)
        {
            //Vehicle Entered time in the Parking and Current time in the same tarrif time
            if ( enteredParkingDate.Date == currentDateTime.Date
                && enteredParkingDate.TimeOfDay >= tarrif.From
                && tarrif.From <= currentDateTime.TimeOfDay
                && currentDateTime.TimeOfDay <= tarrif.To             
              )
            {
                tarrifTime = tarrifTime + (currentDateTime.TimeOfDay - enteredParkingDate.TimeOfDay);
            }

            // Entered time in the tarrif time, Current time after the end of the tarrif time
            if (enteredParkingDate.Date == currentDateTime.Date
               && tarrif.From <= enteredParkingDate.TimeOfDay
               && enteredParkingDate.TimeOfDay <= tarrif.To
               && currentDateTime.TimeOfDay >= tarrif.To)
            {
                tarrifTime = tarrifTime + (tarrif.To - enteredParkingDate.TimeOfDay);
            }

            // Entered time before the tarrif time, Current time after the end of the tarrif time
            if (enteredParkingDate.Date == currentDateTime.Date
               && enteredParkingDate.TimeOfDay <= tarrif.From
               && currentDateTime.TimeOfDay >= tarrif.To)
            {
                tarrifTime = tarrifTime + (tarrif.To - tarrif.From);
            }

            // Entered time before the tarrif time, Current time in the tarrif time
            if (enteredParkingDate.Date == currentDateTime.Date
               && enteredParkingDate.TimeOfDay <= tarrif.From
               && tarrif.From <= currentDateTime.TimeOfDay 
               && currentDateTime.TimeOfDay <= tarrif.To)
            {
                tarrifTime = tarrifTime + (currentDateTime.TimeOfDay - tarrif.From);
            }

            // Entered time day before Current day, Current time in the tarrif time
            if (enteredParkingDate.Date < currentDateTime.Date
                && tarrif.From <= currentDateTime.TimeOfDay
                && currentDateTime.TimeOfDay <= tarrif.To)
            {
                tarrifTime = tarrifTime + (currentDateTime.TimeOfDay - tarrif.From);
            }

            // Entered time day before current day, Current time after the end of the tarrif time
            if (enteredParkingDate.Date < currentDateTime.Date
                && currentDateTime.TimeOfDay > tarrif.To)
            {
                tarrifTime = tarrifTime + (tarrif.To - tarrif.From);
            }

            return tarrifTime;
        }

        public static TimeSpan GetMiddleDaysTarrifTime(DateTime enterParkingDate, DateTime currentDateTime, Tarrif tarrif, TimeSpan tarrifTime)
        {
            if (enterParkingDate.Date < currentDateTime.Date 
                && enterParkingDate.Day != currentDateTime.Day)
            {
                tarrifTime = tarrifTime + ((currentDateTime.Date - enterParkingDate.Date).Days - 1) * (tarrif.To - tarrif.From);
            }

            return tarrifTime;
        }
        public static TimeSpan GetDayOfEntranceTarrifTime(DateTime enterParkingDate, DateTime currentDateTime, Tarrif tarrif, TimeSpan tarrifTime)
        {
            if ( enterParkingDate.Date < currentDateTime.Date
                && enterParkingDate.Day != currentDateTime.Day
                && tarrif.From <= enterParkingDate.TimeOfDay
                && enterParkingDate.TimeOfDay <= tarrif.To)
            {
                tarrifTime = tarrifTime + (tarrif.To - enterParkingDate.TimeOfDay);
            }

            if (enterParkingDate.Date < currentDateTime.Date
                && enterParkingDate.Day != currentDateTime.Day
                && enterParkingDate.TimeOfDay <= tarrif.From)
            {
                tarrifTime = tarrifTime + (tarrif.To - tarrif.From);
            }

            return tarrifTime;
        }
    }
}
