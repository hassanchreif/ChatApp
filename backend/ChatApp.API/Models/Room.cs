namespace ChatApp.API.Models
{
    public class Room
    {
        public int Id { get; set; } // Auto-increment primary key
        public string Name { get; set; } = null!; // Room name
        public ICollection<Message> Messages { get; set; } = new List<Message>(); // Messages in this room
    }
}