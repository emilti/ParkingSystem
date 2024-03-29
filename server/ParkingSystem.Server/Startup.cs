using FluentValidation.AspNetCore;
using GlobalErrorHandling.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using ParkingSystem.Data;
using ParkingSystem.Data.Models;
using ParkingSystem.Server.Hubs;
using ParkingSystem.Server.Infrastructure;
using ParkingSystem.Server.Infrastructure.Helpers;
using ParkingSystem.Server.Validators;
using ParkingSystem.Services;
using ParkingSystem.Services.Interfaces;
using System.Text;

namespace ParkingSystem.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
               .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<SaveVehicleResourceValidator>())
               .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<SoftDeleteResourceValidator>());

            services.AddDbContext<ParkingSystemDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<ParkingSystemDbContext>().AddDefaultTokenProviders();
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;
            });

            // Adding Authentication  
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })

            // Adding Jwt Bearer  
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = Configuration["JWT:ValidAudience"],
                    ValidIssuer = Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]))
                };
            });
            services.AddSignalR();
            services.AddSingleton(services);
            services.AddScoped<IDbInitializer, DbInitializer>();
            services.AddTransient<IVehicleService, VehicleService>();
            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<IDiscountService, DiscountService>();
            services.AddTransient<IAuthHelper, AuthHelper>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            var scopeFactory = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>();
           
            using (var scope = scopeFactory.CreateScope())
            {
                var dbInitializer = scope.ServiceProvider.GetService<IDbInitializer>();
                dbInitializer.Initialize();
                dbInitializer.SeedData();
            }
           
            app.ConfigureCustomExceptionMiddleware();
            app.UseCors(builder =>
                builder
                  .WithOrigins(new string[]{"http://localhost:3000", "http://localhost:4200"})
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
              );

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {                
                endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapHub<DashboardHub>("/hub/Dashboard");
            });
        }
    }
}
