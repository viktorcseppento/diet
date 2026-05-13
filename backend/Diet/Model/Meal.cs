namespace Diet.Model;

public class MealEntity
{
    public Guid Id { get; set; }
    public Guid PersonId { get; set; }
    public PersonEntity Person { get; set; } = null!;
    public long Date { get; set; }
    public string? Comment { get; set; }
    public List<Ingredient>? Foods { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
    public int Deleted { get; set; }
}

public class MealDto
{
    public Guid Id { get; set; }
    public Guid PersonId { get; set; }
    public long Date { get; set; }
    public string? Comment { get; set; }
    public List<Ingredient>? Foods { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
    public int Deleted { get; set; }
}