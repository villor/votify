using System.Threading.Tasks;
using Votify.Api.ApiModels;

namespace Votify.Api.Services
{
    public interface IAuthService
    {
        Task<string> RequestTokenAsync(TokenRequest tokenRequest);
    }
}
