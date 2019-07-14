using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Votify.Api.ApiModels;
using Votify.Api.SpotifyModels;

namespace Votify.Api.Services
{
    public interface ISpotifyService
    {
        string AccessToken { get; set; }
        Task<SpotifyTokens> RequestTokensAsync(TokenRequest tokenRequest);
        Task<SpotifyTokens> RefreshTokenAsync(string refreshToken);
        Task<UserPrivate> GetMeAsync();
    }
}
