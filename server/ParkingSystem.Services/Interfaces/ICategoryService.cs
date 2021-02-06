using ParkingSystem.Models.Categories;
using System.Collections.Generic;

namespace ParkingSystem.Services.Interfaces
{
    public interface ICategoryService
    {
        CategoryInfo GetCategoryById(int categoryId);
        List<CategoryInfo> GetCategories();
    }
}
