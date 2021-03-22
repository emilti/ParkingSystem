using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ParkingSystem.Common.Responses;
using ParkingSystem.Data.Models;
using ParkingSystem.Models.Users;
using ParkingSystem.Server.Infrastructure.Helpers;
using ParkingSystem.Server.Models;
using ParkingSystem.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ParkingSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IVehicleService vehicleService;
        private readonly IConfiguration _configuration;
        private readonly IAuthHelper authHelper;
        public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IAuthHelper authHelper, IVehicleService vehicleService, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.authHelper = authHelper;
            this.vehicleService = vehicleService;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginResource model)
        {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    authClaims.Add(new Claim(ClaimTypes.Name, user.UserName));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    user = new { username = user.UserName, role = userRoles.First() }
                });
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterResource model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status409Conflict, new ApiResponse(409, "User already exists!"));

            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status400BadRequest, new ApiResponse(400, "User creation failed! Please check user details and try again."));

            return StatusCode(StatusCodes.Status200OK, "User created successfully!");

        }

        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterResource model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(400, "User already exists!"));

            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(400, "User creation failed! Please check user details and try again."));

            if (!await roleManager.RoleExistsAsync(UserRolesResource.Admin))
                await roleManager.CreateAsync(new IdentityRole(UserRolesResource.Admin));
            if (!await roleManager.RoleExistsAsync(UserRolesResource.User))
                await roleManager.CreateAsync(new IdentityRole(UserRolesResource.User));

            if (await roleManager.RoleExistsAsync(UserRolesResource.Admin))
            {
                await userManager.AddToRoleAsync(user, UserRolesResource.Admin);
            }

            return Ok(new ApiOkResponse(null, "User created successfully!"));
        }

        [HttpPost]
        [Route("verify")]
        public async Task<IActionResult> Verify(string token)
        {
            try
            {
                ApplicationUser userExists = await authHelper.GetUserFromToken(token);
                var userRoles = await userManager.GetRolesAsync(userExists);
                // return account id from JWT token if validation successful
                //Response.Headers.Add("User", userExists.UserName);
                return Ok(new { username = userExists.UserName, role = userRoles.First() });
            }
            catch (Exception e)
            {
                // return null if validation fails
                return null;
            }
        }

        [HttpPost]
        [Route("profile")]
        public async Task<IActionResult> Profile(string token)
        {
            try
            {
                ApplicationUser userExists = await authHelper.GetUserFromToken(token);
                var userRoles = await userManager.GetRolesAsync(userExists);
                // return account id from JWT token if validation successful
                //Response.Headers.Add("User", userExists.UserName);
                var vehiclesList = vehicleService.GetVehiclesByUser(new Guid(userExists.Id));
                return Ok(vehiclesList);
            }
            catch (Exception e)
            {
                // return null if validation fails
                return null;
            }
        }
    }
}
