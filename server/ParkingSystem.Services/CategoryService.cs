using ParkingSystem.Data;
using ParkingSystem.Models.Categories;
using ParkingSystem.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ParkingSystem.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ParkingSystemDbContext data;
        public CategoryService(ParkingSystemDbContext data)
        {
            this.data = data;
        }
        public List<CategoryInfo> GetCategories()
        {
            return this.data.Categories.Select(a => new CategoryInfo() { CategoryId = a.CategoryId, Name = a.Name, ParkingSpaces = a.ParkingSpaces }).ToList();
        }

        public CategoryInfo GetCategoryById(int categoryId)
        {
            var category = this.data.Categories.FirstOrDefault(a => a.CategoryId == categoryId);
            if(category != null)
            {
                return new CategoryInfo() { CategoryId = category.CategoryId, Name = category.Name, ParkingSpaces = category.ParkingSpaces };
            }
            return null;
        }
    }
}
