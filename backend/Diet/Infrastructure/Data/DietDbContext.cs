using Diet.Model;
using Microsoft.EntityFrameworkCore;

namespace Diet.Infrastructure.Data;

public class DietDbContext(DbContextOptions<DietDbContext> options) : DbContext(options)
{
    public DbSet<PersonEntity> People { get; set; }
    public DbSet<FoodEntity> Foods { get; set; }
    public DbSet<MealEntity> Meals { get; set; }
    public DbSet<TombstoneEntity> Tombstones { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}