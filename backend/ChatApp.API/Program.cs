using ChatApp.API.Data;
using ChatApp.API.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add DbContext for PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Add Controllers
builder.Services.AddControllers();

// ✅ Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// ✅ Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };

    // ✅ Allow SignalR to read access token from query string
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // If the request is for our hub...
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "ChatApp API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// ✅ Add SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// ✅ Enable CORS
app.UseCors("AllowReactApp");

// ✅ Enable Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

// ✅ Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// ✅ Map Controllers
app.MapControllers();

// ✅ Map SignalR Hubs
app.MapHub<ChatHub>("/chathub");

// Optional test endpoint
app.MapGet("/weatherforecast", () => "test");

// ✅ Log Swagger URL on startup in Development
if (app.Environment.IsDevelopment())
{
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        var baseUrl = app.Urls.FirstOrDefault() ?? "http://localhost:5135";
        var swaggerUrl = $"{baseUrl}/swagger/index.html";
        logger.LogInformation("Swagger UI available at: {SwaggerUrl}", swaggerUrl);
    });
}

app.Run();