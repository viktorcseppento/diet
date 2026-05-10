using Diet.Business;
using Diet.Infrastructure.Data;
using Diet.Infrastructure.Data.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DietDbContext>(options =>
    options.UseSqlite("Data Source=diet.db"));

builder.Services.AddScoped<IDietRepository, DietRepository>();
builder.Services.AddScoped<ISyncService, SyncService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAny",
        policy =>
        {
            policy.AllowAnyOrigin();
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
        });
});

builder.Services.AddControllers();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok());
app.UseCors("AllowAny");
app.MapControllers();

app.Run();