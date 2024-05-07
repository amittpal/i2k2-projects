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
    public class HttpFactoryClientFunctions: IHttpFactoryClientFunctions
    {
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly IConnectionsMapping<string> _connectionsMapping;

        private readonly IHttpClientFactory _httpClientFactory;
        public HttpFactoryClientFunctions(ILoggerFunctions __loggerFunctions,
                                    IApiResponse __apiResponse,
                                    IConnectionsMapping<string> __connectionsMapping,
                                    IHttpClientFactory __httpClientFactory)
        {
            _loggerFunctions = __loggerFunctions;
            _apiResponse = __apiResponse;
            _connectionsMapping = __connectionsMapping;
            _httpClientFactory = __httpClientFactory;
        }
        public async Task<string> RestCallSimpleGet(string uriString)
        {
            string _result = string.Empty;
            string _methodName = "RestCallSimpleGet";
            string _mediaType = "application/json";
            Uri _requestUri = null;
            HttpResponseMessage _response = null;
            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();

                _client.DefaultRequestHeaders.Clear();

                //Define request data format  
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));
                _requestUri = new Uri(uriString);

                //Sending request to calculate commission using HttpClient  
                _response = await _client.GetAsync(_requestUri);

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    _result = _response.Content.ReadAsStringAsync().Result;
                }
                else
                {
                    _result = _response.Content.ReadAsStringAsync().Result;

                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "Unhandled  Exception: " + ex.Message, _methodName);

            }
            finally
            {
                _requestUri = null;
                _response = null;
            }
            return _result;
        }

        public async Task<string> RestCallSimpleGetAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues)
        {
            string _result = string.Empty;
            string _methodName = "RestCallSimpleGetAndReturnHeader";
            string _mediaType = "application/json";
            Uri _requestUri = null;
            HttpResponseMessage _response = null;
            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();

                _client.DefaultRequestHeaders.Clear();

                //Define request data format  
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));

                if (headerValues != null)
                {
                    foreach (var _header in headerValues)
                    {
                        _client.DefaultRequestHeaders.Add(_header.Key, _header.Value);
                    }
                }
                _requestUri = new Uri(uriString);

                //Sending request to calculate commission using HttpClient  
                _response = await _client.GetAsync(_requestUri);

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    _result = _response.Content.ReadAsStringAsync().Result;
                }
                else
                {
                    _result = _response.Content.ReadAsStringAsync().Result;

                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

            }
            finally
            {
                _requestUri = null;
                _response = null;
            }
            return _result;
        }

        public async Task<string> RestCallPostWithoutTokenFormUrlEncodedContent(string uriString, List<KeyValuePair<string, string>> formValues)
        {
            string _result = string.Empty;
            string _methodName = "RestCallPostWithoutTokenFormUrlEncodedContent";
            string _mediaType = "application/x-www-form-urlencoded";
            Uri _requestUri = null;
            HttpContent _content = null;
            HttpResponseMessage _response = null;
            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();

                _requestUri = new Uri(uriString);
                _content = new FormUrlEncodedContent(formValues.ToArray());
                _content.Headers.ContentType = new MediaTypeHeaderValue(_mediaType);

                //Sending request to calculate commission using HttpClient  
                _response = await _client.PostAsync(_requestUri, _content);

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    //200
                    _result = _response.Content.ReadAsStringAsync().Result;
                }
                else
                {
                    //4xx, 5xx

                    //handel - return PROPER ERROR FORMAT
                    //you may or may not get JSON
                    _result = _response.Content.ReadAsStringAsync().Result;
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful. Result: {_result}", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

            }
            finally
            {
                _requestUri = null;
                _response = null;
            }
            return _result;
        }

        public async Task<(string, HttpHeaders)> RestCallPostAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues)
        {
            string _responseJson = string.Empty;
            string _methodName = "RestCallPostAndReturnHeader";
            string _mediaType = "application/json";
            Uri _requestUri = null;

            HttpResponseMessage _response = null;
            HttpHeaders _responseHeaders = null;

            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();

                _client.DefaultRequestHeaders.Clear();
                //Define request data format  
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));

                if (headerValues != null)
                {
                    foreach (var _header in headerValues)
                    {
                        _client.DefaultRequestHeaders.Add(_header.Key, _header.Value);
                    }
                }

                _requestUri = new Uri(uriString);
                //Sending request to calculate commission using HttpClient  
                _response = await _client.PostAsync(_requestUri, new StringContent(json, System.Text.Encoding.UTF8, _mediaType));

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    //200
                    _responseJson = _response.Content.ReadAsStringAsync().Result;
                    _responseHeaders = _response.Headers;

                }
                else
                {
                    //4xx, 5xx

                    //handel - return PROPER ERROR FORMAT
                    //you may or may not get JSON
                    _responseJson = _response.Content.ReadAsStringAsync().Result;
                    _responseHeaders = _response.Headers;
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful. Result: {_responseJson}", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

            }
            finally
            {
                _requestUri = null;
                _response = null;
            }
            return (_responseJson, _responseHeaders);
        }
        public async Task<(string, string, bool, HttpHeaders)> RestCallPutAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues)
        {
            string _responseJson = string.Empty;
            string _methodName = "RestCallPutAndReturnHeader";
            string _mediaType = "application/json";
            Uri _requestUri = null;

            HttpResponseMessage _response = null;
            HttpHeaders _responseHeaders = null;
            string _responseStatusCode = "";
            bool _responseStatus = false;
            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();

                _client.DefaultRequestHeaders.Clear();
                //Define request data format  
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));

                if (headerValues != null)
                {
                    foreach (var _header in headerValues)
                    {
                        _client.DefaultRequestHeaders.Add(_header.Key, _header.Value);
                    }
                }

                _requestUri = new Uri(uriString);
                //Sending request to calculate commission using HttpClient  
                _response = await _client.PutAsync(_requestUri, new StringContent(json, System.Text.Encoding.UTF8, _mediaType));

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    //200
                    _responseJson = _response.Content.ReadAsStringAsync().Result;
                    _responseHeaders = _response.Headers;
                    _responseStatusCode = ((int)_response.StatusCode).ToString();
                    _responseStatus = true;
                }
                else
                {
                    //4xx, 5xx

                    //handel - return PROPER ERROR FORMAT
                    //you may or may not get JSON
                    _responseJson = _response.Content.ReadAsStringAsync().Result;
                    _responseHeaders = _response.Headers;
                    _responseStatusCode = ((int)_response.StatusCode).ToString();
                    _responseStatus = false;

                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful. Result: {_responseJson}, Response Code: {_responseStatus}", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);
            }
            finally
            {
                _requestUri = null;
                _response = null;
            }

            return (_responseJson, _responseStatusCode, _responseStatus, _responseHeaders);
        }

        public async Task<(string, string, bool, HttpHeaders)> RestCallDeleteAndReturnHeader(string uriString, string json, List<KeyValuePair<string, string>> headerValues)
        {
            string _responseJson = string.Empty;
            string _methodName = "RestCallDeleteAndReturnHeader";
            string _mediaType = "application/json";
            Uri _requestUri = null;

            HttpResponseMessage _response = null;
            HttpHeaders _responseHeaders = null;
            string _responseStatusCode = "";
            bool _responseStatus = false;
            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();

                _client.DefaultRequestHeaders.Clear();
                //Define request data format  
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));

                if (headerValues != null)
                {
                    foreach (var _header in headerValues)
                    {
                        _client.DefaultRequestHeaders.Add(_header.Key, _header.Value);
                    }
                }

                _requestUri = new Uri(uriString);
                //Sending request
                _response = await _client.DeleteAsync(_requestUri);

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    //200 or 204
                    _responseJson = _response.Content.ReadAsStringAsync().Result;
                    _responseHeaders = _response.Headers;
                    _responseStatusCode = ((int)_response.StatusCode).ToString();
                    _responseStatus = true;
                }
                else
                {
                    //4xx, 5xx

                    //handel - return PROPER ERROR FORMAT
                    //you may or may not get JSON
                    _responseJson = _response.Content.ReadAsStringAsync().Result;
                    _responseHeaders = _response.Headers;
                    _responseStatusCode = ((int)_response.StatusCode).ToString();
                    _responseStatus = false;

                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful. Result: {_responseJson}, Response Code: {_responseStatus}", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

            }
            finally
            {
                _requestUri = null;
                _response = null;
            }

            return (_responseJson, _responseStatusCode, _responseStatus, _responseHeaders);
        }


        public async Task<string> RestCallPostWithoutToken(string uriString, string json)
        {
            string _result = string.Empty;
            string _methodName = "RestCallPostWithoutToken";
            string _mediaType = "application/json";
            Uri _requestUri = null;
            HttpResponseMessage _response = null;
            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();

                _client.DefaultRequestHeaders.Clear();
                //Define request data format  
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));
                _requestUri = new Uri(uriString);
                //Sending request to calculate commission using HttpClient  
                _response = await _client.PostAsync(_requestUri, new StringContent(json, System.Text.Encoding.UTF8, _mediaType));

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    //200
                    _result = _response.Content.ReadAsStringAsync().Result;
                }
                else
                {
                    //4xx, 5xx

                    //handel - return PROPER ERROR FORMAT
                    //you may or may not get JSON
                    _result = _response.Content.ReadAsStringAsync().Result;
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful. Result: {_result}", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

            }
            finally
            {
                _requestUri = null;
                _response = null;
            }

            return _result;
        }


        public async Task<(bool, string, HttpHeaders)> RestCallPostWithoutTokenWithTimeoutAndReturnHeaderAndStatus(Uri _requestUri, string _requestJson, TimeSpan _requestTimeout)
        {
            bool _sucessResponse = false;
            string _responseJson = string.Empty;
            string _methodName = "RestCallPostWithoutTokenWithTimeoutAndReturnHeaderAndStatus";
            string _mediaType = "application/json";

            HttpResponseMessage _response = null;
            HttpHeaders _responseHeaders = null;

            try
            {
                HttpClient _client = _httpClientFactory.CreateClient();
                _client.Timeout = _requestTimeout;

                _client.DefaultRequestHeaders.Clear();

                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));


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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

            }
            finally
            {
                _requestJson = null;
                _requestUri = null;
                _response = null;
            }
            return (_sucessResponse, _responseJson, _responseHeaders);
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
                HttpClient _client = _httpClientFactory.CreateClient();

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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

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

        public async Task<string> RestCallPost(string uriString, string json)
        {
            string _result = string.Empty;
            string _methodName = "RestCallPost";
            string _mediaType = "application/json";
            Uri _requestUri = null;
            HttpResponseMessage _response = null;
            try
            {
                var _accessToken = _connectionsMapping.GetConnections(JsonReturnConstants.PropertyNames.AccessToken);

                HttpClient _client = _httpClientFactory.CreateClient();

                _client.DefaultRequestHeaders.Clear();
                //Define request data format  
                _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));
                _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _accessToken);
                _requestUri = new Uri(uriString);
                //Sending request to calculate commission using HttpClient  
                _response = await _client.PostAsync(_requestUri, new StringContent(json, System.Text.Encoding.UTF8, _mediaType));

                //Checking the response is successful or not which is sent using HttpClient  
                if (_response.IsSuccessStatusCode)
                {
                    //200
                    _result = _response.Content.ReadAsStringAsync().Result;
                }
                else
                {
                    //4xx, 5xx

                    //handel - return PROPER ERROR FORMAT
                    //you may or may not get JSON
                    _result = _response.Content.ReadAsStringAsync().Result;
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Http Response is not successful. Result: {_result}", _methodName);
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
                CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, "UnhandledException: " + ex.Message, _methodName);

            }
            finally
            {
                _requestUri = null;
                _response = null;
            }
            return _result;
        }
    }
}
