namespace ChatApp.API.Models
{
    public class User
    {
        public int Id { get; set; } // Auto-increment
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}