using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Votify.Api.SettingsModels
{
    public class SpotifySettings
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Scope { get; set; }
    }
}
