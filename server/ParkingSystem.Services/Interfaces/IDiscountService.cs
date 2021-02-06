using ParkingSystem.Models.Discounts;

namespace ParkingSystem.Services.Interfaces
{
    public interface IDiscountService
    {
        DiscountInfo GetDiscountsById(int? discountId);
    }
}
