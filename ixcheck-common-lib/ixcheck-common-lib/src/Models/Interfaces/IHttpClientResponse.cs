using System.Net.Http.Headers;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IHttpClientResponse
    {
        bool Status { get; set; }
        string Body { get; set; }
        HttpHeaders HeaderValues { get; set; }
    }
}
