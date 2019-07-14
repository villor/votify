using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;

namespace Votify.Api.SpotifyModels
{
    [JsonObject(NamingStrategyType = typeof(SnakeCaseNamingStrategy))]
    public class UserPrivate
    {
        public string Birthdate { get; set; }
        public string Country { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public IDictionary<string, string> ExternalUrls { get; set; }
        public Followers Followers { get; set; }
        public string Href { get; set; }
        public string Id { get; set; }
        public IEnumerable<Image> Images { get; set; }
        public string Product { get; set; }
        public string Type { get; set; }
        public string Uri { get; set; }
    }
}
