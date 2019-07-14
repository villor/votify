using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Votify.Api.Services;
using Votify.Api.Models;
using Votify.Api.ApiModels;

namespace Votify.Api.Hubs
{
    public class RoomHub : Hub
    {
        private readonly IRoomService _roomService;
        private readonly IRoomConnectionSingleton _roomConnectionSingleton;

        public RoomHub(IRoomService roomService, IRoomConnectionSingleton roomConnectionSingleton)
        {
            _roomService = roomService;
            _roomConnectionSingleton = roomConnectionSingleton;
        }

        public async Task JoinRoom(string roomCode)
        {
            await _roomConnectionSingleton.SetRoomCodeAsync(Context.ConnectionId, roomCode);
            await Clients.Group(roomCode).SendAsync("NewConnection");
        }
    }
}
