using Diet.Model;

namespace Diet.Infrastructure.Data.Repository;

public interface IDietRepository
{
    Task<IList<FoodEntity>> ListChangedFoods(long since);
    Task<IList<MealEntity>> ListChangedMeals(long since);
    Task<IList<PersonEntity>> ListChangedPeople(long since);
    Task<IList<TombstoneEntity>> ListNewTombstones(long since);
    Task<List<PersonEntity>> ListPeopleByIds(IList<Guid> ids);
    Task<List<MealEntity>> ListMealsByIds(IList<Guid> ids);
    Task<List<FoodEntity>> ListFoodsByIds(IList<Guid> ids);

    Task AddItems(IList<PersonEntity> newPeople, IList<PersonEntity> updatedPeople, IList<FoodEntity> newFoods,
        IList<FoodEntity> updatedFoods, IList<MealEntity> newMeals, IList<MealEntity> updatedMeals);
}