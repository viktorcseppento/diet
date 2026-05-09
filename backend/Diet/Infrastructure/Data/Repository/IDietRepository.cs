using Diet.Model;

namespace Diet.Infrastructure.Data.Repository;

public interface IDietRepository
{
    Task<IList<FoodEntity>> ListChangedFoods(long since);
    Task<IList<MealEntity>> ListChangedMeals(long since);
    Task<IList<PersonEntity>> ListChangedPeople(long since);
    Task<IList<TombstoneEntity>> ListNewTombstones(long since);
    Task<List<PersonEntity>> ListPeopleByIds(IEnumerable<Guid> ids);
    Task<List<MealEntity>> ListMealsByIds(IEnumerable<Guid> ids);
    Task<List<FoodEntity>> ListFoodsByIds(IEnumerable<Guid> ids);
    Task AddItems(IList<PersonEntity> people, IList<FoodEntity> foods, IList<MealEntity> meals);
}