using Microsoft.IdentityModel.Tokens;
using System;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IJwtIssuerOptions
    {
        int ValidForMinutes { get; set; }
        string Issuer { get; set; }
        string Subject { get; set; }
        string Audience { get; set; }
        DateTime NotBefore { get; }
        DateTime IssuedAt { get; }
        SigningCredentials SigningCredentials { get; set; }
        Func<Task<string>> JtiGenerator { get; }
        string SecurityKey { get; set; }
    }
}
