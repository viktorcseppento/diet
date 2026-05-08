using Diet.Model;
using Microsoft.EntityFrameworkCore;

namespace Diet.Infrastructure.Data.Repository;

public class DietRepository(DietDbContext dbContext) : IDietRepository
{
    private readonly DietDbContext dbContext;

    public async Task<IList<FoodDto>> ListChangedFoods(long since)
    {
        return await dbContext.Foods
            .Where(f => f.LastUpdated > since)
            .Select(f => new FoodDto(f))
            .ToListAsync();
    }

    public async Task<IList<MealDto>> ListChangedMeals(long since)
    {
        return await dbContext.Meals
            .Where(m => m.LastUpdated > since)
            .Select(m => new MealDto(m))
            .ToListAsync();
    }

    public async Task<IList<PersonDto>> ListChangedPeople(long since)
    {
        return await dbContext.People
            .Where(p => p.LastUpdated > since)
            .Select(p => new PersonDto(p))
            .ToListAsync();
    }

    public async Task<IList<TombstoneDto>> ListNewTombstones(long since)
    {
        return await dbContext.Tombstones
            .Where(t => t.DeletedAt > since)
            .Select(t => new TombstoneDto(t))
            .ToListAsync();
    }
}