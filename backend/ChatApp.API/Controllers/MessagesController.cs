using ChatApp.API.Data;
using ChatApp.API.Hubs;
using ChatApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ChatApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔥 All endpoints require authentication
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _chatHub;

        public MessagesController(AppDbContext context, IHubContext<ChatHub> chatHub)
        {
            _context = context;
            _chatHub = chatHub;
        }

        // ✅ GET: api/Messages/room/1
        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetMessagesByRoom(int roomId)
        {
            var messages = await _context.Messages
                .Where(m => m.RoomId == roomId)
                .Include(m => m.User)
                .Select(m => new MessageResponseDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    Username = m.User.Username,
                    Timestamp = m.Timestamp
                })
                .ToListAsync();

            return Ok(messages);
        }

        // ✅ POST: api/Messages
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            // 🔥 Get user ID from JWT
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            // ✅ Create Message entity
            var message = new Message
            {
                Content = dto.Content,
                RoomId = dto.RoomId,
                UserId = userId,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // 🔥 Broadcast message to all clients in the room via SignalR
            var user = await _context.Users.FindAsync(userId);
            await _chatHub.Clients.Group(dto.RoomId.ToString()).SendAsync("ReceiveMessage", new
            {
                Content = message.Content,
                Username = user!.Username,
                Timestamp = message.Timestamp
            });

            // ✅ Return response
            return Ok(new
            {
                message.Id,
                message.Content,
                message.Timestamp,
                message.RoomId
            });
        }
    }
}