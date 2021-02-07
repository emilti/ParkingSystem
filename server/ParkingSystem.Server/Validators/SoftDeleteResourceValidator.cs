using FluentValidation;
using ParkingSystem.Models.Vehicles;
using ParkingSystem.Services.Interfaces;
using System.Linq;

namespace ParkingSystem.Server.Validators
{
    public class SoftDeleteResourceValidator : AbstractValidator<SoftDeleteVehicleResource>
    {
        public readonly IVehicleService vehicleServce;
        public SoftDeleteResourceValidator(IVehicleService vehicleService)
        {
            this.vehicleServce = vehicleService;
            RuleFor(x => x.RegistrationNumber).NotNull()
           .Must(ValidateRegistrationNumber).WithMessage("Invalid registration number. Vehicle is not in the parking.");
        }

        public bool ValidateRegistrationNumber(string registrationNumber)
        {
            var vehicle = this.vehicleServce.GetVehicles().FirstOrDefault(a => a.RegistrationNumber == registrationNumber);
            if (vehicle == null)
            {
                return false;
                //return new ApiBadRequestResponse("Vehicle is not in the parking");
            }

            return true;
        }
    }
}
