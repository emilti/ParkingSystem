using ParkingSystem.Data;
using ParkingSystem.Models.Discounts;
using ParkingSystem.Services.Interfaces;
using System.Linq;

namespace ParkingSystem.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly ParkingSystemDbContext data;
        public DiscountService(ParkingSystemDbContext data)
        {
            this.data = data;
        }

        public DiscountInfo GetDiscountsById(int? discountId)
        {
            var discount = this.data.Discounts.FirstOrDefault(a => a.DiscountId == discountId);
            if (discount != null)
            {
                return new DiscountInfo() { DiscountId = discount.DiscountId, Name = discount.Name, DiscountPercentage = discount.DiscountPercentage };
            }
            return null;
        }
    }
}
