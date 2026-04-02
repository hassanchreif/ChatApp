using Microsoft.EntityFrameworkCore;
using ChatApp.API.Models;

namespace ChatApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Existing table
        public DbSet<User> Users { get; set; }

        // New tables
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Message> Messages { get; set; }

        // Optional: configure relationships (EF Core can do it automatically in this simple case)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Make Email unique for users (optional but good practice)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}