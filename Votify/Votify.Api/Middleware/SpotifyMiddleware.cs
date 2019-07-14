using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Votify.Api.Services;

namespace Votify.Api.Middleware
{
    public class SpotifyMiddleware
    {
        private readonly RequestDelegate _next;
        
        public SpotifyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ISpotifyService spotifyService)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                spotifyService.AccessToken = context.User.Claims.FirstOrDefault(c => c.Type == "spotifyAccessToken")?.Value;
            }
            await _next(context);
        }
    }
}
