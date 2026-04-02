namespace ChatApp.API.Models
{
    public class Message
    {
        public int Id { get; set; } // Auto-increment primary key
        public string Content { get; set; } = null!; // Message text
        public DateTime Timestamp { get; set; } = DateTime.UtcNow; // When message was sent

        // Relationships
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;
    }
}