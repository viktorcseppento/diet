using Diet.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DietDbContext>(options =>
    options.UseSqlite("Data Source=diet.db"));

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();
app.Run();