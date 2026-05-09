namespace Diet.Model;

public struct Ingredient
{
    public Guid FoodId { get; set; }
    public double Amount { get; set; }
}

public class Macros
{
    public double Fat { get; set; }
    public double FatSaturated { get; set; }
    public double FastCarbohydrate { get; set; }
    public double SlowCarbohydrate { get; set; }
    public double Fiber { set; get; }
    public double Protein { set; get; }
}

public class FoodEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Measure { get; set; } = null!;
    public List<Ingredient>? Ingredients { get; set; }
    public double? Amount { get; set; }
    public Macros Macros { get; set; } = null!;
    public int Deleted { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
}

public class FoodDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public required string Measure { get; set; }
    public List<Ingredient>? Ingredients { get; set; }
    public double? Amount { get; set; }
    public required Macros Macros { get; set; }
    public required int Deleted { get; set; }
    public required long CreatedAt { get; set; }
    public required long LastUpdated { get; set; }
}