using ChatApp.API.Data;
using ChatApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Messages/room/1
        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetMessagesByRoom(int roomId)
        {
            var messages = await _context.Messages
                .Where(m => m.RoomId == roomId)
                .Include(m => m.User) // Load sender info
                .ToListAsync();

            return Ok(messages);
        }

        // POST: api/Messages
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            message.Timestamp = DateTime.UtcNow;
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(message);
        }
    }
}