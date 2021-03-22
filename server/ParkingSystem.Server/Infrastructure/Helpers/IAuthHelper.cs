using ParkingSystem.Data.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

namespace ParkingSystem.Server.Infrastructure.Helpers
{
    public interface IAuthHelper
    {
        public Task<ApplicationUser> GetUserFromToken(string token);
    }
}
