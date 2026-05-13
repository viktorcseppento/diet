namespace Diet.Model;

public struct Ingredient
{
    public required Guid FoodId { get; set; }
    public string FoodName { get; set; }
    public double Amount { get; set; }
}

public class Macros
{
    public double Fat { get; set; }
    public double FatSaturated { get; set; }
    public double FastCarbohydrate { get; set; }
    public double SlowCarbohydrate { get; set; }
    public double Fiber { get; set; }
    public double Protein { get; set; }
}

public class Allergens
{
    public bool AddedSugar { get; set; }
    public bool Dairy { get; set; }
    public bool Egg { get; set; }
    public bool Gluten { get; set; }
}

public class FoodEntity
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public required string Measure { get; set; }
    public List<Ingredient>? Ingredients { get; set; }
    public double? Amount { get; set; }
    public required Macros Macros { get; set; }
    public required Allergens Allergens { get; set; }
    public int Deleted { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
}

public class FoodDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public required string Measure { get; set; }
    public List<Ingredient>? Ingredients { get; set; }
    public double? Amount { get; set; }
    public required Macros Macros { get; set; }
    public Allergens? Allergens { get; set; }
    public int Deleted { get; set; }
    public long CreatedAt { get; set; }
    public long LastUpdated { get; set; }
}