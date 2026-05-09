namespace Diet.Model;

public class PullResponse
{
    public long Timestamp { get; set; }
    public IEnumerable<FoodDto> Foods { get; set; } = [];
    public IEnumerable<MealDto> Meals { get; set; } = [];
    public IEnumerable<PersonDto> People { get; set; } = [];
    public IEnumerable<TombstoneDto> Tombstones { get; set; } = [];
}

public class PushRequest
{
    public IEnumerable<FoodDto> Foods { get; set; } = [];
    public IEnumerable<MealDto> Meals { get; set; } = [];
    public IEnumerable<PersonDto> People { get; set; } = [];
}