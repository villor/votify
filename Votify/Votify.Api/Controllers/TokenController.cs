using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Votify.Api.ApiModels;
using Votify.Api.Services;
using Votify.Api.SettingsModels;

namespace Votify.Api.Controllers
{
    [Route("api/token")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthService _authService;

        public TokenController(IConfiguration config, IAuthService authService)
        {
            _config = config;
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpGet, Route("echo")]
        public ActionResult Echo([FromQuery(Name = "code")] string code)
        {
            return Ok(code);
        }

        [AllowAnonymous]
        [HttpGet, Route("info")]
        public ActionResult GetTokenInfo()
        {
            var spotifySettings = _config.GetSection("Spotify").Get<SpotifySettings>();
            return Ok(new TokenInfo
            {
                ClientId = spotifySettings.ClientId,
                Scope = spotifySettings.Scope
            });
        }

        [AllowAnonymous]
        [HttpPost, Route("request")]
        public async Task<ActionResult> RequestToken([FromBody] TokenRequest tokenRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                return Ok(new
                {
                    Token = await _authService.RequestTokenAsync(tokenRequest)
                });
            }
            catch
            {
                return Unauthorized();
            }
        }

        [HttpGet, Route("refresh")]
        public async Task<ActionResult> RefreshToken([FromQuery(Name = "refreshToken")] string refreshToken)
        {
            try
            {
                return Ok(new
                {
                    Token = await _authService.RefreshTokenAsync(refreshToken)
                });
            }
            catch
            {
                return Unauthorized();
            }
        }
    }
}