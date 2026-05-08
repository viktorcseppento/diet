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
    public PersonDto(PersonEntity entity)
    {
        Id = entity.Id;
        Name = entity.Name;
        CreatedAt = entity.CreatedAt;
        LastUpdated = entity.LastUpdated;
        Deleted = entity.Deleted;
    }
    
    public Guid Id { get; set; }
    public string Name { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
    public int Deleted { get; set; }
}