using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Votify.Api.SpotifyModels
{
    [JsonObject(NamingStrategyType = typeof(SnakeCaseNamingStrategy))]
    public class Error
    {
        public int Status { get; set; }
        public string Message { get; set; }
    }
}
