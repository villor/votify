using System.ComponentModel.DataAnnotations;

namespace Votify.Api.ApiModels
{
    public class TokenRequest
    {
        [Required]
        public string Code { get; set; }

        [Required]
        public string RedirectUri { get; set; }
    }
}
