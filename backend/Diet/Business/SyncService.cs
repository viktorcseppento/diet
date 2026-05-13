using Diet.Infrastructure.Data.Converters;
using Diet.Infrastructure.Data.Repository;
using Diet.Model;

namespace Diet.Business;

public class SyncService(IDietRepository dietRepository) : ISyncService
{
    private readonly IDietRepository dietRepository = dietRepository;

    public async Task<PullResponse> ListChanges(long since)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var changedFoods = await dietRepository.ListChangedFoods(since);
        var changedMeals = await dietRepository.ListChangedMeals(since);
        var changedPeople = await dietRepository.ListChangedPeople(since);
        var newTombstones = await dietRepository.ListNewTombstones(since);

        return new PullResponse
        {
            Timestamp = timestamp,
            Foods = changedFoods.Select(f => f.ToDto()),
            Meals = changedMeals.Select(f => f.ToDto()),
            People = changedPeople.Select(f => f.ToDto()),
            Tombstones = newTombstones.Select(f => f.ToDto()),
        };
    }

    public async Task PushChanges(PushRequest request)
    {
        var people = await dietRepository.ListPeopleByIds(request.People.Select(p => p.Id).ToList());
        var foods = await dietRepository.ListFoodsByIds(request.Foods.Select(f => f.Id).ToList());
        var meals = await dietRepository.ListMealsByIds(request.Meals.Select(m => m.Id).ToList());
        var peopleDictionary = people.ToDictionary(p => p.Id);
        var foodsDictionary = foods.ToDictionary(f => f.Id);
        var mealsDictionary = meals.ToDictionary(m => m.Id);
        var newPeople = new List<PersonEntity>();
        var newFoods = new List<FoodEntity>();
        var newMeals = new List<MealEntity>();
        var updatedPeople = new List<PersonEntity>();
        var updatedFoods = new List<FoodEntity>();
        var updatedMeals = new List<MealEntity>();

        foreach (var person in request.People)
        {
            var entityPerson = peopleDictionary.GetValueOrDefault(person.Id);
            if (entityPerson == null)
                newPeople.Add(person.ToEntity());
            else if (person.LastUpdated > entityPerson.LastUpdated)
                updatedPeople.Add(person.ToEntity());
        }

        foreach (var food in request.Foods)
        {
            var entityFood = foodsDictionary.GetValueOrDefault(food.Id);
            if (entityFood == null)
                newFoods.Add(food.ToEntity());
            else if (food.LastUpdated > entityFood.LastUpdated)
                updatedFoods.Add(food.ToEntity());
        }

        foreach (var meal in request.Meals)
        {
            var entityMeal = mealsDictionary.GetValueOrDefault(meal.Id);
            if (entityMeal == null)
                newMeals.Add(meal.ToEntity());
            else if (meal.LastUpdated > entityMeal.LastUpdated)
                updatedMeals.Add(meal.ToEntity());
        }
        
        // TODO if the updated ones are in tombstone then get those out of there

        await dietRepository.AddItems(newPeople, updatedPeople, newFoods, updatedFoods, newMeals, updatedMeals);
    }
}