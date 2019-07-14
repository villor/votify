using System.Collections.Generic;

namespace Votify.Api.Models
{
    public class Room
    {
        public int RoomId { get; set; }
        public string Code { get; set; }
        public string OwnerSpotifyId { get; set; }
        public string Name { get; set; }

        public PlayerState PlayerState { get; set; }

        public ICollection<Track> Tracks { get; set; } = new List<Track>();
    }
}
