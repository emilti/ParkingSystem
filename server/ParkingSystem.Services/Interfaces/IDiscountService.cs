using ParkingSystem.Models.Discounts;
using System.Collections.Generic;

namespace ParkingSystem.Services.Interfaces
{
    public interface IDiscountService
    {
        DiscountInfo GetDiscountsById(int? discountId);
        List<DiscountInfo> GetDiscounts();
    }
}
