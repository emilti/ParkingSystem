using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ParkingSystem.Data.Models;
using System;
using System.Linq;

namespace ParkingSystem.Data
{
    public class ParkingSystemDbContext : IdentityDbContext<IdentityUser>
    {

        public ParkingSystemDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Tarrif> Tarrifs { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Discount> Discounts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder
                .Entity<Vehicle>()
                .HasOne(a => a.Category)
                .WithMany(a => a.Vehicles)
                .HasForeignKey(a => a.CategoryId);
            
            builder
                .Entity<Tarrif>()
                .HasOne(a => a.Category)
                .WithMany(a => a.Tarrifs)
                .HasForeignKey(a => a.CategoryId);

            builder
                .Entity<Vehicle>()
                .HasOne(a => a.Discount)
                .WithMany(a => a.Vehicles)
                .HasForeignKey(a => a.DiscountId);



            foreach (var property in builder.Model.GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetColumnType("decimal(18,2)");
            }
        }
    }
}
