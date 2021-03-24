using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ParkingSystem.Data;
using ParkingSystem.Data.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ParkingSystem.Server.Infrastructure.Helpers
{
    public class AuthHelper : IAuthHelper
    {
        private readonly ParkingSystemDbContext data;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        public AuthHelper(ParkingSystemDbContext data, UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            this.data = data;
            this.userManager = userManager;
            this._configuration = configuration;
        }

        public async Task<ApplicationUser> GetUserFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes((_configuration["JWT:Secret"]));
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            //var accountId = jwtToken.Id;
            var user = jwtToken.Claims.First(a => a.Type == ClaimTypes.Name)?.Value;
            var userExists = await userManager.FindByNameAsync(user);
            return userExists;
        }
    }
}
