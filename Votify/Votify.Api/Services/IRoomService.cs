using System.Threading.Tasks;
using Votify.Api.Models;
using Votify.Api.ApiModels;

namespace Votify.Api.Services
{
    public interface IRoomService
    {
        Task<Room> GetRoomAsync(string roomCode);

        Task<Track> AddTrackAsync(string roomCode, string spotifyTrackId);

        Task RemoveTrackAsync(int trackId);

        Task UpdatePlayerStateAsync(string roomCode, PlayerState playerState);
    }
}
