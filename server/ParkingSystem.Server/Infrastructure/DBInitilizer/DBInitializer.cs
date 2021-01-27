using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ParkingSystem.Data;
using ParkingSystem.Data.Models;
using System;
using System.Linq;

namespace ParkingSystem.Server.Infrastructure
{
    public class DbInitializer : IDbInitializer
    {
        private readonly IServiceScopeFactory scopeFactory;

        public DbInitializer(IServiceScopeFactory scopeFactory)
        {
            this.scopeFactory = scopeFactory;
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
                }
            }
        }
    }
}
