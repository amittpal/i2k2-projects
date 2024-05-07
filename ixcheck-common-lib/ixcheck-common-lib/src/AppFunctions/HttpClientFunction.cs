using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions
{
    // For POST remote request
    public class HttpClientFunction : IHttpClientFunction
    {
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly IConnectionsMapping<string> _connectionsMapping;

        public HttpClientFunction(ILoggerFunctions __loggerFunctions,
            IApiResponse __apiResponse, 
            IConnectionsMapping<string> __connectionsMapping)
        {
            _loggerFunctions = __loggerFunctions;
            _apiResponse = __apiResponse;
            _connectionsMapping = __connectionsMapping;
        }
        public async Task<string> RestCallPostWithoutToken(string uriString, string json)
        {
            string _result = string.Empty;
            string _methodName = "RestCallPostWithoutToken";
            string _mediaType = "application/json";
            try
            {
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Clear();
                    //Define request data format  
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));
                    Uri requestUri = new Uri(uriString);
                    //Sending request to calculate commission using HttpClient  
                    HttpResponseMessage _response = await client.PostAsync(requestUri, new StringContent(json, System.Text.Encoding.UTF8, _mediaType));

                    //Checking the response is successful or not which is sent using HttpClient  
                    if (_response.IsSuccessStatusCode)
                    {
                        _result = _response.Content.ReadAsStringAsync().Result;
                    }
                    else
                    {
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"{ _methodName } : Http Response is not successful");
                    }
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
            }
            return _result;
        }

        public async Task<string> RestCallPost(string uriString, string json)
        {
            string _result = string.Empty;
            string _methodName = "RestCallPost";
            string _mediaType = "application/json";
            try
            {
                var _accessToken = _connectionsMapping.GetConnections(JsonReturnConstants.PropertyNames.AccessToken);

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Clear();
                    //Define request data format  
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _accessToken);
                    Uri requestUri = new Uri(uriString);
                    //Sending request to calculate commission using HttpClient  
                    HttpResponseMessage _response = await client.PostAsync(requestUri, new StringContent(json, System.Text.Encoding.UTF8, _mediaType));
                    //Checking the response is successful or not which is sent using HttpClient  
                    if (_response.IsSuccessStatusCode)
                    {
                        _result = _response.Content.ReadAsStringAsync().Result;
                    }
                    else
                    {
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"{ _methodName } : Http Response is not successful");
                    }
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);

            }
            return _result;
        }

        public async Task<(bool, string, HttpHeaders)> RestCallPostTokenTimeoutAndReturnHeaderAndStatus(string _accessToken, Uri _requestUri, string _requestJson, TimeSpan _requestTimeout)
        {
            bool _sucessResponse = false;
            string _responseJson = string.Empty;
            string _methodName = "RestCallPostTokenTimeoutAndReturnHeaderAndStatus";
            string _mediaType = "application/json";

            HttpResponseMessage _response = null;
            HttpHeaders _responseHeaders = null;

            try
            {
                using (var _client = new HttpClient())
                {
                    _client.Timeout = _requestTimeout;

                    _client.DefaultRequestHeaders.Clear();

                    //_client.DefaultRequestHeaders.ExpectContinue = false;

                    _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));

                    _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _accessToken);

                    _response = await _client.PostAsync(_requestUri, new StringContent(_requestJson, System.Text.Encoding.UTF8, _mediaType));

                    if (_response.IsSuccessStatusCode)
                    {
                        //200
                        _sucessResponse = true;
                        _responseJson = _response.Content.ReadAsStringAsync().Result;
                        _responseHeaders = _response.Headers;
                    }
                    else
                    {
                        //4xx, 5xx

                        //handel - return PROPER ERROR FORMAT
                        //you may or may not get JSON

                        _sucessResponse = false;
                        _responseJson = _response.Content.ReadAsStringAsync().Result;
                        _responseHeaders = _response.Headers;
                        CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response was not successful. Result: {_responseJson}", _methodName);
                    }
                }
            }
            catch (HttpRequestException hrEx)
            {
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "HttpRequestException: " + hrEx.Message, _methodName);
            }
            catch (TaskCanceledException tcEx)
            {
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "TaskCanceledException: " + tcEx.Message, _methodName);
            }
            catch (Exception ex)
            {
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);

            }
            finally
            {
                _accessToken = null;
                _requestJson = null;
                _requestUri = null;
                _response = null;
            }
            return (_sucessResponse, _responseJson, _responseHeaders);
        }

    }
}
