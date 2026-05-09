using Diet.Infrastructure.Data.Converters;
using Diet.Model;
using Microsoft.EntityFrameworkCore;

namespace Diet.Infrastructure.Data.Repository;

public class DietRepository(DietDbContext dbContext) : IDietRepository
{
    private readonly DietDbContext dbContext;

    public async Task<IList<FoodEntity>> ListChangedFoods(long since)
    {
        return await dbContext.Foods
            .Where(f => f.LastUpdated > since)
            .ToListAsync();
    }

    public async Task<IList<MealEntity>> ListChangedMeals(long since)
    {
        return await dbContext.Meals
            .Where(m => m.LastUpdated > since)
            .ToListAsync();
    }

    public async Task<IList<PersonEntity>> ListChangedPeople(long since)
    {
        return await dbContext.People
            .Where(p => p.LastUpdated > since)
            .ToListAsync();
    }

    public async Task<IList<TombstoneEntity>> ListNewTombstones(long since)
    {
        return await dbContext.Tombstones
            .Where(t => t.DeletedAt > since)
            .ToListAsync();
    }

    public async Task<List<PersonEntity>> ListPeopleByIds(IEnumerable<Guid> ids)
    {
        return await dbContext.People
            .Where(p => ids.Contains(p.Id))
            .ToListAsync();
    }

    public async Task<List<MealEntity>> ListMealsByIds(IEnumerable<Guid> ids)
    {
        return await dbContext.Meals
            .Where(m => ids.Contains(m.Id))
            .ToListAsync();
    }

    public async Task<List<FoodEntity>> ListFoodsByIds(IEnumerable<Guid> ids)
    {
        return await dbContext.Foods
            .Where(f => ids.Contains(f.Id))
            .ToListAsync();
    }

    public async Task AddItems(IList<PersonEntity> people, IList<FoodEntity> foods, IList<MealEntity> meals)
    {
        await dbContext.Database.BeginTransactionAsync();
        try
        {
            await dbContext.People.AddRangeAsync(people);
            await dbContext.Foods.AddRangeAsync(foods);
            await dbContext.Meals.AddRangeAsync(meals);
            await dbContext.SaveChangesAsync();
            await dbContext.Database.CommitTransactionAsync();
        }
        catch
        {
            await dbContext.Database.RollbackTransactionAsync();
            throw;
        }
    }
}