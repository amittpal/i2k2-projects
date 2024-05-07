using IXCheckCommonLib.Models.Interfaces;
using System.Net.Http.Headers;

namespace IXCheckCommonLib.Models
{
    public class HttpClientResponse : IHttpClientResponse
    {
        public HttpClientResponse()
        {
            Status = false;
            Body = "";
            HeaderValues = null;
        }
        public bool Status { get; set; }
        public string Body { get; set; }
        public HttpHeaders HeaderValues { get; set; }
    }
}
