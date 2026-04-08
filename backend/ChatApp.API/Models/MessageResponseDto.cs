namespace ChatApp.API.Models
{
    // DTO for GET responses
    public class MessageResponseDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public string Username { get; set; } = null!;
        public DateTime Timestamp { get; set; }
    }

    // DTO for POST requests
    public class SendMessageDto
    {
        public string Content { get; set; } = null!;
        public int RoomId { get; set; }
    }
}