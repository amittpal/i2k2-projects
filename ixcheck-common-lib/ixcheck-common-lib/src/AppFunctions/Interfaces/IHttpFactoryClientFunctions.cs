using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface IHttpFactoryClientFunctions
    {
        Task<(bool, string, HttpHeaders)> RestCallPostWithoutTokenWithTimeoutAndReturnHeaderAndStatus(Uri _requestUri, string _requestJson, TimeSpan _requestTimeout);
        Task<(bool, string, HttpHeaders)> RestCallPostTokenTimeoutAndReturnHeaderAndStatus(string _accessToken, Uri _requestUri, string _requestJson, TimeSpan _requestTimeout);
        Task<string> RestCallSimpleGet(string uriString);
        Task<string> RestCallSimpleGetAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues);
        Task<string> RestCallPost(string uriString, string json);
        Task<string> RestCallPostWithoutToken(string uriString, string json);
        Task<string> RestCallPostWithoutTokenFormUrlEncodedContent(string uriString, List<KeyValuePair<string, string>> formValues);
        Task<(string, HttpHeaders)> RestCallPostAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues);
        Task<(string, string, bool, HttpHeaders)> RestCallPutAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues);
        Task<(string, string, bool, HttpHeaders)> RestCallDeleteAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues);
    }
}
