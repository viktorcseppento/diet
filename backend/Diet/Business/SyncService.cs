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
            Foods = changedFoods,
            Meals = changedMeals,
            People = changedPeople,
            Tombstones = newTombstones
        };
    }
}