using Diet.Model;

namespace Diet.Infrastructure.Data.Converters;

public static class EntityConversionExtensions
{
    public static PersonEntity ToEntity(this PersonDto dto)
    {
        return new PersonEntity
        {
            Id = dto.Id,
            Name = dto.Name,
            Targets = dto.Targets ?? [],
            CreatedAt = dto.CreatedAt,
            LastUpdated = dto.LastUpdated,
            Deleted = dto.Deleted
        };
    }

    public static PersonDto ToDto(this PersonEntity entity)
    {
        return new PersonDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Targets = entity.Targets,
            CreatedAt = entity.CreatedAt,
            LastUpdated = entity.LastUpdated,
            Deleted = entity.Deleted
        };
    }

    public static MealEntity ToEntity(this MealDto dto)
    {
        return new MealEntity
        {
            Id = dto.Id,
            PersonId = dto.PersonId,
            Date = dto.Date,
            Comment = dto.Comment,
            Foods = dto.Foods,
            CreatedAt = dto.CreatedAt,
            LastUpdated = dto.LastUpdated,
            Deleted = dto.Deleted
        };
    }

    public static MealDto ToDto(this MealEntity entity)
    {
        return new MealDto
        {
            Id = entity.Id,
            PersonId = entity.PersonId,
            Date = entity.Date,
            Comment = entity.Comment,
            Foods = entity.Foods,
            CreatedAt = entity.CreatedAt,
            LastUpdated = entity.LastUpdated,
            Deleted = entity.Deleted
        };
    }

    public static FoodEntity ToEntity(this FoodDto dto)
    {
        return new FoodEntity
        {
            Id = dto.Id,
            Name = dto.Name,
            Type = dto.Type,
            Measure = dto.Measure,
            Ingredients = dto.Ingredients,
            Amount = dto.Amount,
            Macros = dto.Macros,
            Allergens = dto.Allergens ?? new Allergens(),
            Deleted = dto.Deleted,
            CreatedAt = dto.CreatedAt,
            LastUpdated = dto.LastUpdated
        };
    }


    public static FoodDto ToDto(this FoodEntity entity)
    {
        return new FoodDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Type = entity.Type,
            Measure = entity.Measure,
            Ingredients = entity.Ingredients,
            Amount = entity.Amount,
            Macros = entity.Macros,
            Allergens = entity.Allergens,
            Deleted = entity.Deleted,
            CreatedAt = entity.CreatedAt,
            LastUpdated = entity.LastUpdated
        };
    }
    
    
    public static TombstoneEntity ToEntity(this TombstoneDto dto)
    {
        return new TombstoneEntity
        {
            Id = dto.Id,
            Table = dto.Table,
            RecordId = dto.RecordId,
            DeletedAt = dto.DeletedAt
        };
    }
    
    public static TombstoneDto ToDto(this TombstoneEntity entity)
    {
        return new TombstoneDto
        {
            Id = entity.Id,
            Table = entity.Table,
            RecordId = entity.RecordId,
            DeletedAt = entity.DeletedAt
        };
    }
}