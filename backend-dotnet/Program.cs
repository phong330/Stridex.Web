using Microsoft.EntityFrameworkCore;
using StridexApi.Data;
using StridexApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<StridexApi.Services.EmailService>();
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("StridexDb")
    ));
builder.Services.AddCors(opt => opt.AddPolicy("ChoPhepAngular", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));


var app = builder.Build();
app.UseCors("ChoPhepAngular");
app.MapControllers();

app.Run("http://localhost:5000");
