namespace Diet.Model;

public class PullResponse
{
    public long Timestamp { get; set; }
    public IList<FoodDto> Foods { get; set; } = [];
    public IList<MealDto> Meals { get; set; } = [];
    public IList<PersonDto> People { get; set; } = [];
    public IList<TombstoneDto> Tombstones { get; set; } = [];
}