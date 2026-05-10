using Diet.Infrastructure.Data.Converters;
using Diet.Model;
using Microsoft.EntityFrameworkCore;

namespace Diet.Infrastructure.Data.Repository;

public class DietRepository(DietDbContext dbContext) : IDietRepository
{
    private readonly DietDbContext dbContext = dbContext;

    public async Task<IList<FoodEntity>> ListChangedFoods(long since)
    {
        return await dbContext.Foods
            .Where(f => f.LastUpdated > since)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IList<MealEntity>> ListChangedMeals(long since)
    {
        return await dbContext.Meals
            .Where(m => m.LastUpdated > since)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IList<PersonEntity>> ListChangedPeople(long since)
    {
        return await dbContext.People
            .Where(p => p.LastUpdated > since)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IList<TombstoneEntity>> ListNewTombstones(long since)
    {
        return await dbContext.Tombstones
            .Where(t => t.DeletedAt > since)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<PersonEntity>> ListPeopleByIds(IList<Guid> ids)
    {
        return await dbContext.People
            .Where(p => ids.Contains(p.Id))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<MealEntity>> ListMealsByIds(IList<Guid> ids)
    {
        return await dbContext.Meals
            .Where(m => ids.Contains(m.Id))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<FoodEntity>> ListFoodsByIds(IList<Guid> ids)
    {
        return await dbContext.Foods
            .Where(f => ids.Contains(f.Id))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddItems(IList<PersonEntity> newPeople, IList<PersonEntity> updatedPeople,
        IList<FoodEntity> newFoods, IList<FoodEntity> updatedFoods, IList<MealEntity> newMeals,
        IList<MealEntity> updatedMeals)
    {
        await dbContext.Database.BeginTransactionAsync();
        try
        {
            dbContext.People.AddRange(newPeople);
            dbContext.People.UpdateRange(updatedPeople);
            dbContext.Foods.AddRange(newFoods);
            dbContext.Foods.UpdateRange(updatedFoods);
            dbContext.Meals.AddRange(newMeals);
            dbContext.Meals.UpdateRange(updatedMeals);
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