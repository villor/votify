using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Votify.Api.Hubs
{
    public class RoomConnectionSingleton : IRoomConnectionSingleton
    {
        private readonly IHubContext<RoomHub> _hubContext;

        private Dictionary<string, string> _connectionRoom = new Dictionary<string, string>();

        public RoomConnectionSingleton(IHubContext<RoomHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public string GetRoomCode(string connectionId)
        {
            return _connectionRoom.ContainsKey(connectionId) ? _connectionRoom[connectionId] : null;
        }

        public async Task ClearRoomCodeAsync(string connectionId)
        {
            if (_connectionRoom.ContainsKey(connectionId))
            {
                var roomCode = _connectionRoom[connectionId];
                _connectionRoom.Remove(connectionId);
                await _hubContext.Groups.RemoveFromGroupAsync(connectionId, roomCode);
            }
        }

        public async Task SetRoomCodeAsync(string connectionId, string roomCode)
        {
            await ClearRoomCodeAsync(connectionId);
            await _hubContext.Groups.AddToGroupAsync(connectionId, roomCode);
        }
    }
}
