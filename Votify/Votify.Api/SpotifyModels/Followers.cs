using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Votify.Api.SpotifyModels
{
    [JsonObject(NamingStrategyType = typeof(SnakeCaseNamingStrategy))]
    public class Followers
    {
        public string Href { get; set; }
        public int Total { get; set; }
    }
}
