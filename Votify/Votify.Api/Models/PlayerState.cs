using Microsoft.EntityFrameworkCore;

namespace Votify.Api.Models
{
    [Owned]
    public class PlayerState
    {
        public bool Paused { get; set; }
        public int Duration { get; set; }
        public int Position { get; set; }

        public string SpotifyTrackId { get; set; }
        public string SpotifyTrackName { get; set; }
        public string SpotifyTrackArtist { get; set; }
        public string SpotifyTrackImageUrl { get; set; }
    }
}
