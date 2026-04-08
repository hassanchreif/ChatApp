using ChatApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.API.Hubs
{
    [Authorize] // Optional: Require JWT
    public class ChatHub : Hub
    {
        // 🔹 Send message to all users in a room
        public async Task SendMessageToRoom(string roomId, string content, string username)
        {
            await Clients.Group(roomId).SendAsync("ReceiveMessage", new
            {
                Content = content,
                Username = username,
                Timestamp = DateTime.UtcNow
            });
        }

        // 🔹 Join a room
        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        }

        // 🔹 Leave a room
        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        }
    }
}