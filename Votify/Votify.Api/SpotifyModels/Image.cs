using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Votify.Api.SpotifyModels
{
    [JsonObject(NamingStrategyType = typeof(SnakeCaseNamingStrategy))]
    public class Image
    {
        public int Height { get; set; }
        public string Url { get; set; }
        public int Width { get; set; }
    }
}
