using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    // For POST remote request
    public interface IHttpClientFunction
    {
        Task<string> RestCallPost(string uriString, string json);
        Task<string> RestCallPostWithoutToken(string uriString, string json);
        Task<(bool, string, System.Net.Http.Headers.HttpHeaders)> RestCallPostTokenTimeoutAndReturnHeaderAndStatus(string _accessToken, Uri _requestUri, string _requestJson, TimeSpan _requestTimeout);

    }
}
