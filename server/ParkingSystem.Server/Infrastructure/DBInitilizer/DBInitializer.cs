using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ParkingSystem.Data;
using ParkingSystem.Data.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ParkingSystem.Server.Infrastructure
{
    public class DbInitializer : IDbInitializer
    {
        private readonly IServiceScopeFactory scopeFactory;
        private readonly ServiceProvider serviceProvider;


        public DbInitializer(IServiceScopeFactory scopeFactory, IServiceCollection serviceCollection)
        {
            this.scopeFactory = scopeFactory;
            this.serviceProvider = serviceCollection.BuildServiceProvider(); ;
        }

        public void Initialize()
        {
            using (var serviceScope = scopeFactory.CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<ParkingSystemDbContext>())
                {
                    context.Database.Migrate();
                }
            }
        }

        public void SeedData()
        {
            using (var serviceScope = scopeFactory.CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<ParkingSystemDbContext>())
                {
                    if (!context.Categories.ToList().Any())
                    {
                        Category category1 = new Category { Name = "A", ParkingSpaces = 1 };
                        Category category2 = new Category { Name = "B", ParkingSpaces = 2 };
                        Category category3 = new Category { Name = "C", ParkingSpaces = 4 };
                        context.Categories.Add(category1);
                        context.Categories.Add(category2);
                        context.Categories.Add(category3);

                        context.SaveChanges();

                        Tarrif tarrif1 = new Tarrif { CategoryId = 1, From = new TimeSpan(0, 0, 0), To = new TimeSpan(8, 0, 0), Price = 2 };
                        Tarrif tarrif2 = new Tarrif { CategoryId = 1, From = new TimeSpan(8, 0, 0), To = new TimeSpan(18, 0, 0), Price = 3 };
                        Tarrif tarrif3 = new Tarrif { CategoryId = 1, From = new TimeSpan(18, 0, 0), To = new TimeSpan(23, 59, 59), Price = 2 };
                        Tarrif tarrif4 = new Tarrif { CategoryId = 2, From = new TimeSpan(0, 0, 0), To = new TimeSpan(8, 0, 0), Price = 4 };
                        Tarrif tarrif5 = new Tarrif { CategoryId = 2, From = new TimeSpan(8, 0, 0), To = new TimeSpan(18, 0, 0), Price = 6 };
                        Tarrif tarrif6 = new Tarrif { CategoryId = 2, From = new TimeSpan(18, 0, 0), To = new TimeSpan(23, 59, 59), Price = 4 };
                        Tarrif tarrif7 = new Tarrif { CategoryId = 3, From = new TimeSpan(0, 0, 0), To = new TimeSpan(8, 0, 0), Price = 8 };
                        Tarrif tarrif8 = new Tarrif { CategoryId = 3, From = new TimeSpan(8, 0, 0), To = new TimeSpan(18, 0, 0), Price = 12 };
                        Tarrif tarrif9 = new Tarrif { CategoryId = 3, From = new TimeSpan(18, 0, 0), To = new TimeSpan(23, 59, 59), Price = 8 };
                        context.Tarrifs.Add(tarrif1);
                        context.Tarrifs.Add(tarrif2);
                        context.Tarrifs.Add(tarrif3);
                        context.Tarrifs.Add(tarrif4);
                        context.Tarrifs.Add(tarrif5);
                        context.Tarrifs.Add(tarrif6);
                        context.Tarrifs.Add(tarrif7);
                        context.Tarrifs.Add(tarrif8);
                        context.Tarrifs.Add(tarrif9);
                        context.SaveChanges();

                        Discount discount1 = new Discount { Name = "Silver", DiscountPercentage = 10 };
                        Discount discount2 = new Discount { Name = "Gold", DiscountPercentage = 15 };
                        Discount discount3 = new Discount { Name = "Platinum", DiscountPercentage = 20 }; ;
                        context.Discounts.Add(discount1);
                        context.Discounts.Add(discount2);
                        context.Discounts.Add(discount3);
                        context.SaveChanges();
                    }

                    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                    var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                    Task<IdentityResult> roleResult;
                    string email = "admin@mail.com";
                    string username = "admin";
                    //Check that there is an Administrator role and create if not
                    Task<bool> hasAdminRole = roleManager.RoleExistsAsync("Administrator");
                    hasAdminRole.Wait();

                    if (!hasAdminRole.Result)
                    {
                        roleResult = roleManager.CreateAsync(new IdentityRole("Administrator"));
                        roleResult.Wait();
                    }

                    Task<bool> hasDriverRole = roleManager.RoleExistsAsync("Driver");
                    hasDriverRole.Wait();

                    if (!hasAdminRole.Result)
                    {
                        roleResult = roleManager.CreateAsync(new IdentityRole("Driver"));
                        roleResult.Wait();
                    }
                    //Check if the admin user exists and create it if not
                    //Add to the Administrator role

                    Task<ApplicationUser> testUser = userManager.FindByEmailAsync(email);
                    testUser.Wait();

                    if (testUser.Result == null)
                    {
                        ApplicationUser administrator = new ApplicationUser();
                        administrator.Email = email;
                        administrator.UserName = username;

                        Task<IdentityResult> newUser = userManager.CreateAsync(administrator, "Admin1");
                        newUser.Wait();

                        if (newUser.Result.Succeeded)
                        {
                            Task<IdentityResult> newUserRole = userManager.AddToRoleAsync(administrator, "Administrator");
                            newUserRole.Wait();
                        }
                    }
                }
            }
        }
    }
}
