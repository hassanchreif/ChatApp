using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace ChatApp.API.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; } // 🔥 make it nullable

        public int RoomId { get; set; }

        [JsonIgnore]
        public Room? Room { get; set; } // 🔥 make it nullable
    }
}