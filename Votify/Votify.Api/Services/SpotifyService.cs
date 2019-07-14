using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Votify.Api.ApiModels;
using Votify.Api.SettingsModels;
using Votify.Api.SpotifyModels;

namespace Votify.Api.Services
{
    public class SpotifyService : ISpotifyService
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _clientFactory;

        public string AccessToken { get; set; }

        public SpotifyService(IConfiguration config, IHttpClientFactory clientFactory)
        {
            _config = config;
            _clientFactory = clientFactory;
        }

        public async Task<SpotifyTokens> RequestTokensAsync(TokenRequest tokenRequest)
        {
            var spotifySettings = _config.GetSection("Spotify").Get<SpotifySettings>();
            var client = _clientFactory.CreateClient();

            var spotifyTokenRequest = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://accounts.spotify.com/api/token"),
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "grant_type", "authorization_code" },
                    { "code", tokenRequest.Code },
                    { "redirect_uri", tokenRequest.RedirectUri },
                    { "client_id", spotifySettings.ClientId },
                    { "client_secret", spotifySettings.ClientSecret }
                })
            };
            var spotifyTokenResponse = await client.SendAsync(spotifyTokenRequest);
            if (spotifyTokenResponse.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return await spotifyTokenResponse.Content.ReadAsAsync<SpotifyTokens>();
            }

            throw new UnauthorizedAccessException("Failed to get tokens from Spotify Web API");
        }

        public async Task<SpotifyTokens> RefreshTokenAsync(string refreshToken)
        {
            var spotifySettings = _config.GetSection("Spotify").Get<SpotifySettings>();
            var client = _clientFactory.CreateClient();

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://accounts.spotify.com/api/token"),
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "grant_type", "refresh_token" },
                    { "refresh_token", refreshToken },
                    { "client_id", spotifySettings.ClientId },
                    { "client_secret", spotifySettings.ClientSecret }
                })
            };

            var response = await client.SendAsync(request);
            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var spotifyTokens = await response.Content.ReadAsAsync<SpotifyTokens>();
                spotifyTokens.RefreshToken = refreshToken;
                return spotifyTokens;
            }

            throw new UnauthorizedAccessException("Failed to refresh token from Spotify");
        }

        public async Task<UserPrivate> GetMeAsync()
        {
            if (AccessToken == null)
                throw new UnauthorizedAccessException("Access token not set");

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri("https://api.spotify.com/v1/me")
            };
            request.Headers.Add("Authorization", "Bearer " + AccessToken);

            var response = await _clientFactory.CreateClient().SendAsync(request);
            if (response.StatusCode == System.Net.HttpStatusCode.OK)
                return await response.Content.ReadAsAsync<UserPrivate>();

            var error = await response.Content.ReadAsAsync<Error>();
            throw new HttpRequestException($"{error.Status}: {error.Message}");
        }
    }
}
