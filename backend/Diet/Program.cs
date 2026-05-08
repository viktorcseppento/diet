
using Diet.Business;
using Diet.Infrastructure.Data;
using Diet.Infrastructure.Data.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DietDbContext>(options =>
    options.UseSqlite("Data Source=diet.db"));

builder.Services.AddScoped<IDietRepository, DietRepository>();
builder.Services.AddScoped<ISyncService, SyncService>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok());
app.MapControllers();
app.Run();