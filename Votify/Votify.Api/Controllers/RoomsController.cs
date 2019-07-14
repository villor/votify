using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Votify.Api.Hubs;
using Votify.Api.Models;
using Votify.Api.Services;

namespace Votify.Api.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IHubContext<RoomHub> _hubContext;

        public RoomsController(IRoomService roomService, IHubContext<RoomHub> hubContext)
        {
            _roomService = roomService;
            _hubContext = hubContext;
        }

        [HttpGet("{roomCode}")]
        public async Task<ActionResult<Room>> GetRoom(string roomCode)
        {
            return await _roomService.GetRoomAsync(roomCode);
        }

        [HttpPost("{roomCode}/tracks")]
        public async Task<ActionResult> AddTrack(string roomCode, AddTrackRequest request)
        {
            var track = await _roomService.AddTrackAsync(roomCode, request.SpotifyTrackId);
            await _hubContext.Clients.Group(roomCode).SendAsync("AddTrack", track);
            return Ok();
        }

        [HttpDelete("{roomCode}/tracks/{trackId}")]
        public async Task<ActionResult> RemoveTrack(string roomCode, int trackId)
        {
            await _roomService.RemoveTrackAsync(trackId);
            await _hubContext.Clients.Group(roomCode).SendAsync("RemoveTrack", trackId);
            return Ok();
        }

        [HttpPut("{roomCode}/playerState")]
        public async Task<ActionResult> UpdatePlayerState(string roomCode, PlayerState playerState)
        {
            await _roomService.UpdatePlayerStateAsync(roomCode, playerState);
            await _hubContext.Clients.Group(roomCode).SendAsync("PlayerState", playerState);
            return Ok();
        }

        public class AddTrackRequest
        {
            public string SpotifyTrackId { get; set; }
        }
    }
}
