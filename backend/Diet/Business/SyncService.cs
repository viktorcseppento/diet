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
        var people = await dietRepository.ListPeopleByIds(request.People.Select(p => p.Id));
        var foods = await dietRepository.ListFoodsByIds(request.Foods.Select(f => f.Id));
        var meals = await dietRepository.ListMealsByIds(request.Meals.Select(m => m.Id));
        var requestPeopleDictionary = request.People.ToDictionary(p => p.Id);
        var requestFoodsDictionary = request.Foods.ToDictionary(f => f.Id);
        var requestMealsDictionary = request.Meals.ToDictionary(m => m.Id);
        var newPeople = new List<PersonEntity>();
        var newFoods = new List<FoodEntity>();
        var newMeals = new List<MealEntity>();

        // Get the newer items
        people.ForEach(p =>
        {
            var requestPerson = requestPeopleDictionary[p.Id];
            if (requestPerson.LastUpdated > p.LastUpdated)
                newPeople.Add(requestPerson.ToEntity());
        });

        foods.ForEach(f =>
        {
            var requestFood = requestFoodsDictionary[f.Id];
            if (requestFood.LastUpdated > f.LastUpdated)
                newFoods.Add(requestFood.ToEntity());
        });

        meals.ForEach(m =>
        {
            var requestMeal = requestMealsDictionary[m.Id];
            if (requestMeal.LastUpdated > m.LastUpdated)
                newMeals.Add(requestMeal.ToEntity());
        });

        await dietRepository.AddItems(newPeople, newFoods, newMeals);
    }
}