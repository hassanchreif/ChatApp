using Microsoft.EntityFrameworkCore;
using ChatApp.API.Models;

namespace ChatApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // ✅ Tables go here
        public DbSet<User> Users { get; set; }
    }
}