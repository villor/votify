using Newtonsoft.Json;

namespace Votify.Api.Models
{
    public class Track
    {
        public int TrackId { get; set; }
        public string SpotifyTrackId { get; set; }
        public int Votes { get; set; }

        [JsonIgnore]
        public int RoomId { get; set; }
        [JsonIgnore]
        public Room Room { get; set; }
    }
}
