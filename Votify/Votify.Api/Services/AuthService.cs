using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Votify.Api.SettingsModels;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Votify.Api.ApiModels;

namespace Votify.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly ISpotifyService _spotifyService;

        public AuthService(IConfiguration configuration, ISpotifyService spotifyService)
        {
            _configuration = configuration;
            _spotifyService = spotifyService;
        }

        public async Task<string> RequestTokenAsync(TokenRequest tokenRequest)
        {
            var spotifyTokens = await _spotifyService.RequestTokensAsync(tokenRequest);
            _spotifyService.AccessToken = spotifyTokens.AccessToken;

            var me = await _spotifyService.GetMeAsync();

            var claims = new[]
            {
                new Claim("spotifyAccessToken", spotifyTokens.AccessToken),
                new Claim("spotifyRefreshToken", spotifyTokens.RefreshToken),
                new Claim("spotifyUserId", me.Id),
                new Claim("spotifyUserDisplayName", me.DisplayName),
                new Claim("spotifyUserImageUrl", me.Images.FirstOrDefault()?.Url ?? ""),
            };

            var jwtSettings = _configuration.GetSection("Jwt").Get<JwtSettings>();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken(
                jwtSettings.Issuer,
                jwtSettings.Audience,
                claims,
                expires: DateTime.UtcNow.AddSeconds(spotifyTokens.ExpiresIn),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
