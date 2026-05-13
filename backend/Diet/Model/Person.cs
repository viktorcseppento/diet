namespace Diet.Model;

public class Target
{
    public required string Name { get; set; } = null!;
    public required string Key { get; set; } = null!;
    public required string Rule { get; set; } = null!; // minimum, maximum, free 
    public double? Value { get; set; }
}

public class PersonEntity
{
    public Guid Id { get; set; }
    public List<MealEntity> Meals { get; set; } = [];
    public required string Name { get; set; }
    public required List<Target> Targets { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
    public int Deleted { get; set; }
}

public class PersonDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public List<Target>? Targets { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
    public int Deleted { get; set; }
}