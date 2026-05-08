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
    public FoodDto(FoodEntity entity)
    {
        Id = entity.Id;
        Name = entity.Name;
        Type = entity.Type;
        Measure = entity.Measure;
        Ingredients = entity.Ingredients;
        Amount = entity.Amount;
        Macros = entity.Macros;
        Deleted = entity.Deleted;
        CreatedAt = entity.CreatedAt;
        LastUpdated = entity.LastUpdated;
    }
    
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Measure { get; set; }
    public List<Ingredient>? Ingredients { get; set; }
    public double? Amount { get; set; }
    public Macros Macros { get; set; }
    public int Deleted { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
}