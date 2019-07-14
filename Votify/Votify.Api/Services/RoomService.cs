using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Votify.Api.Models;
using Votify.Api.ApiModels;

namespace Votify.Api.Services
{
    public class RoomService : IRoomService
    {
        private readonly VotifyContext _votifyContext;
        public RoomService(VotifyContext votifyContext)
        {
            _votifyContext = votifyContext;
            if (_votifyContext.Rooms.Count() == 0)
            {
                _votifyContext.Rooms.Add(new Room { Code = "fjert", OwnerSpotifyId = "villor", Name = "Rummet" });
                _votifyContext.SaveChanges();
            }
        }

        public async Task<Room> GetRoomAsync(string roomCode)
        {
            var room = await _votifyContext.Rooms
                .Include(r => r.Tracks)
                .FirstOrDefaultAsync(r => r.Code == roomCode);

            if (room == null)
                throw new ArgumentException($"Room with code '{roomCode}' does not exist.");

            return room;
        }

        public async Task<Track> AddTrackAsync(string roomCode, string spotifyTrackId)
        {
            var room = await GetRoomAsync(roomCode);
            var track = new Track
            {
                SpotifyTrackId = spotifyTrackId,
                Votes = 0
            };
            room.Tracks.Add(track);
            await _votifyContext.SaveChangesAsync();
            return track;
        }

        public async Task RemoveTrackAsync(int trackId)
        {
            var track = new Track { TrackId = trackId };
            _votifyContext.Tracks.Attach(track);
            _votifyContext.Tracks.Remove(track);
            await _votifyContext.SaveChangesAsync();
        }

        public async Task UpdatePlayerStateAsync(string roomCode, PlayerState playerState)
        {
            var room = await GetRoomAsync(roomCode);
            room.PlayerState = playerState;
            await _votifyContext.SaveChangesAsync();
        }
    }
}
