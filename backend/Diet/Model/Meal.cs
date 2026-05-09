namespace Diet.Model;

public class MealEntity
{
    public Guid Id { get; set; }
    public Guid PersonId { get; set; }
    public PersonEntity Person { get; set; } = null!;
    public long Date { get; set; }
    public string? Comment { get; set; }
    public List<Ingredient>? Foods { get; set; }
    public double Amount { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
}

public class MealDto
{
    public required Guid Id { get; set; }
    public required Guid PersonId { get; set; }
    public required long Date { get; set; }
    public string? Comment { get; set; }
    public List<Ingredient>? Foods { get; set; }
    public required double Amount { get; set; }
    public required long CreatedAt { get; set; }
    public required long LastUpdated { get; set; }
}