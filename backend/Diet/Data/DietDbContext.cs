using Microsoft.EntityFrameworkCore;

namespace Diet.Data;

public class DietDbContext(DbContextOptions<DietDbContext> options) : DbContext(options)
{
    // public DbSet<Diet> Foods { get; set; } = null!;
}