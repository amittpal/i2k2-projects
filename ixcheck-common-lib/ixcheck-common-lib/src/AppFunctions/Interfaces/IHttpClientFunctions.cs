using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface IHttpClientFunctions
    {
        Task<IHttpClientResponse> HttpClientRequestAsync(IHttpClientRequestParam _httpClientRequestParams);
        Task<IHttpClientResponse> HttpClientFormEncodedRequestAsync(IHttpClientRequestParam _httpClientRequestParams);
        Task<(bool, string, HttpHeaders)> RestCallPostTokenTimeoutAndReturnHeaderAndStatus(string _accessToken, Uri _requestUri, string _requestJson, TimeSpan _requestTimeout);
    }
}
