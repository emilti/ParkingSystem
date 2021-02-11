using FluentValidation.AspNetCore;
using GlobalErrorHandling.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ParkingSystem.Data;
using ParkingSystem.Server.Infrastructure;
using ParkingSystem.Server.Validators;
using ParkingSystem.Services;
using ParkingSystem.Services.Interfaces;

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
            //services.AddDbContext<ParkingSystemDbContext>(
            //    x => x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<ParkingSystemDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<IdentityUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ParkingSystemDbContext>();
            services.AddControllers()
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<SaveVehicleResourceValidator>())
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<SoftDeleteResourceValidator>()); ;
            services.AddScoped<IDbInitializer, DbInitializer>();
            services.AddTransient<IVehicleService, VehicleService>();
            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<IDiscountService, DiscountService>();
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
            app.UseRouting();
            app.UseAuthorization();
            app.UseCors(options => options
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod());
            app.UseEndpoints(endpoints =>
            {                
                endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
