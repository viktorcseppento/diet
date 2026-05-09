namespace Diet.Model;

public class PersonEntity
{
    public Guid Id { get; set; }
    public List<MealEntity> Meals { get; set; } = [];
    public string Name { get; set; } = null!;
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
    public int Deleted { get; set; }
}

public class PersonDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required long CreatedAt { get; set; }
    public required long LastUpdated { get; set; }
    public required int Deleted { get; set; }
}