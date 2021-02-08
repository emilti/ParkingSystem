using FluentValidation;
using ParkingSystem.Common;
using ParkingSystem.Common.Utils;
using ParkingSystem.Models.Categories;
using ParkingSystem.Models.Discounts;
using ParkingSystem.Server.Models.Vehicles;
using ParkingSystem.Services.Interfaces;
using System.Linq;

namespace ParkingSystem.Server.Validators
{
    public class SaveVehicleResourceValidator : AbstractValidator<SaveVehicleResource>
    {
        public readonly IVehicleService vehicleServce;
        public readonly ICategoryService categoryService;
        public readonly IDiscountService discountService;
        public SaveVehicleResourceValidator(IVehicleService vehicleService, ICategoryService categoryService, IDiscountService discountService)
        {
            this.vehicleServce = vehicleService;
            this.categoryService = categoryService;
            this.discountService = discountService;
            RuleFor(m => m.RegistrationNumber)
                .NotEmpty()
                .MaximumLength(20);

            RuleFor(m => m.RegistrationNumber)
                .NotEmpty()
                .WithMessage("'Registration number' is mandatory.");
            RuleFor(x => x.CategoryId).Cascade(CascadeMode.Stop).NotNull()
                .Must(ValidateCategory).WithMessage("Enter Valid Category.")
                .Must(ValidateFreeParkingSpaces).WithMessage("No free parking space.");
            RuleFor(x => x.DiscountId)
                .Must(ValidateDiscount).WithMessage("Enter Valid Discount.");
        }


        public bool ValidateCategory(int id)
        {
            CategoryInfo vehicleCategory = this.categoryService.GetCategoryById(id);
            if (vehicleCategory == null)
            {
                return false;
            }
            return true;
        }
        public bool ValidateFreeParkingSpaces(int categoryId)
        {
            CategoryInfo vehicleCategory = this.categoryService.GetCategoryById(categoryId);
            var groupedVehicles = this.vehicleServce.GetVehiclesInParking().ToList().GroupBy(a => a.CategoryId);
            int occupiedParkingSpacesAfterVehicleEnter = CalculationUtilities.CalculateOccupiedParkingSpaces(this.categoryService.GetCategories(), groupedVehicles) + vehicleCategory.ParkingSpaces;
            if (occupiedParkingSpacesAfterVehicleEnter + vehicleCategory.ParkingSpaces > Constants.TOTAL_PARKING_SPACES)
            {
                return false;
            }
            return true;
        }

        public bool ValidateDiscount(int? discountId)
        {
            DiscountInfo vehicleDiscount = this.discountService.GetDiscountsById(discountId);
            if (discountId != null && vehicleDiscount == null)
            {
                return false;
            }

            return true;
        }
    }
}
