namespace Diet.Model;

public class MealEntity
{
    public Guid Id { get; set; }
    public Guid PersonId { get; set; }
    public PersonEntity Person { get; set; } = null!;
    public long Date { get; set; }
    public string Comment { get; set; } = null!;
    public List<Ingredient> Foods { get; set; } = null!;
    public double Amount { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
}

public class MealDto
{
    public MealDto(MealEntity entity)
    {
        Id = entity.Id;
        PersonId = entity.PersonId;
        Date = entity.Date;
        Comment = entity.Comment;
        Foods = entity.Foods;
        Amount = entity.Amount;
        CreatedAt = entity.CreatedAt;
        LastUpdated = entity.LastUpdated;
    }
    
    public Guid Id { get; set; }
    public Guid PersonId { get; set; }
    public long Date { get; set; }
    public string Comment { get; set; }
    public List<Ingredient> Foods { get; set; }
    public double Amount { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
}