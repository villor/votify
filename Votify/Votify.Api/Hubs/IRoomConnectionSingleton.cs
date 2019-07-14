using System.Threading.Tasks;

namespace Votify.Api.Hubs
{
    public interface IRoomConnectionSingleton
    {
        string GetRoomCode(string connectionId);
        Task SetRoomCodeAsync(string connectionId, string roomCode);
        Task ClearRoomCodeAsync(string connectionId);
    }
}
