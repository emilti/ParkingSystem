using System.ComponentModel.DataAnnotations;

namespace ParkingSystem.Models.Users
{
    public class LoginResource
    {
        [Required(ErrorMessage = "User Name is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
