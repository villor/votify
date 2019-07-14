using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Votify.Api.SpotifyModels
{
    [JsonObject(NamingStrategyType = typeof(SnakeCaseNamingStrategy))]
    public class SpotifyTokens
    {
        public string AccessToken { get; set; }
        public string TokenType { get; set; }
        public string Scope { get; set; }
        public int ExpiresIn { get; set; }
        public string RefreshToken { get; set; }
    }
}
