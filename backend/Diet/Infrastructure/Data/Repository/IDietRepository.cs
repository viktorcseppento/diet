using Diet.Model;

namespace Diet.Infrastructure.Data.Repository;

public interface IDietRepository
{
    Task<IList<FoodDto>> ListChangedFoods(long since);
    Task<IList<MealDto>> ListChangedMeals(long since);
    Task<IList<PersonDto>> ListChangedPeople(long since);
    Task<IList<TombstoneDto>> ListNewTombstones(long since);
}