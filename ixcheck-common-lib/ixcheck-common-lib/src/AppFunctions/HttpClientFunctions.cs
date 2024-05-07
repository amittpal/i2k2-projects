using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions
{
    public class HttpClientFunctions : IHttpClientFunctions
    {
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly HttpClient _httpClient = new HttpClient();

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__loggerFunctions"></param>
        /// <param name="__apiResponse"></param>
        public HttpClientFunctions(ILoggerFunctions __loggerFunctions, IApiResponse __apiResponse)
        {
            _loggerFunctions = __loggerFunctions;
            _apiResponse = __apiResponse;
        }

        private async Task<IHttpClientResponse> HttpClientRequest(IHttpClientRequestParam _httpClientRequestParams)
        {
            string _methodName = "F:HttpClient:HttpClientPost";
            string _mediaType = Constants.GenericMessages.MediaTypeApplicationJson;

            IHttpClientResponse _httpClientResponse = new HttpClientResponse();
            HttpResponseMessage _response = null;

            try
            {
                if (_httpClientRequestParams == null)
                {
                    CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, Constants.GenericMessages.RequiredParametersMissing, _methodName);
                }
                else
                {
                    _httpClient.Timeout = _httpClientRequestParams.Timeout;

                    _httpClient.DefaultRequestHeaders.Clear();

                    //_client.DefaultRequestHeaders.ExpectContinue = false;

                    _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));

                    if (!string.IsNullOrEmpty(_httpClientRequestParams.AccessToken))
                    {
                        _httpClient.DefaultRequestHeaders.Add(Constants.TokenMessages.Authorization, $"{Constants.TokenMessages.Bearer} " + _httpClientRequestParams.AccessToken);
                    }

                    if (_httpClientRequestParams.HeaderValues != null)
                    {
                        foreach (var _header in _httpClientRequestParams.HeaderValues)
                        {
                            _httpClient.DefaultRequestHeaders.Add(_header.Key, _header.Value);
                        }
                    }
                    switch (_httpClientRequestParams.Type)
                    {
                        case Enumeration.RequestType.GET:
                            _response = await _httpClient.GetAsync(_httpClientRequestParams.Uri);
                            break;
                        case Enumeration.RequestType.POST:
                            _response = await _httpClient.PostAsync(_httpClientRequestParams.Uri, new StringContent(_httpClientRequestParams.Json, System.Text.Encoding.UTF8, _mediaType));
                            break;
                        case Enumeration.RequestType.PUT:
                            _response = await _httpClient.PutAsync(_httpClientRequestParams.Uri, new StringContent(_httpClientRequestParams.Json, System.Text.Encoding.UTF8, _mediaType));
                            break;
                        case Enumeration.RequestType.DELETE:
                            _response = await _httpClient.DeleteAsync(_httpClientRequestParams.Uri);
                            break;
                        default:
                            _httpClientResponse.Status = false;
                            _httpClientResponse.Body = $"{Constants.GenericMessages.InvalidHttpClientRequestType}";
                            break;
                    }

                    if (_response == null || _response?.IsSuccessStatusCode == false)
                    {
                        ////4xx, 5xx
                        ////handel - return PROPER ERROR FORMAT
                        ////you may or may not get JSON
                        ////Cast in Api
                        //_sucessResponse = false;
                        //_responseJson = _response?.Content?.ReadAsStringAsync()?.Result;
                        //_responseHeaders = _response?.Headers;
                        //CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"{Constants.GenericMessages.HTTPResponseFailed}. {Constants.GenericMessages.Result}: {_responseJson}", _methodName);
                        try
                        {
                            ApiErrorResponse _apiErrorResponse = new ApiErrorResponse();
                            _apiErrorResponse = JsonConvert.DeserializeObject<ApiErrorResponse>(_response.ToString());
                            if (_apiErrorResponse?.Data[0]?.Attributes?.Message == null)
                            {
                                _httpClientResponse.Body = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, $"Un-Expected Error, Could Not Parse Server Response", _methodName);
                            }
                            else
                            {
                                _httpClientResponse.Body = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, $"{_apiErrorResponse?.Data[0]?.Attributes.Message[0]}", _methodName);
                            }
                        }
                        catch (Exception ex)
                        {
                            // ERROR - Considering as App Error
                            _httpClientResponse.Body = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, $"{Constants.GenericMessages.HttpRequestException}: " + ex.Message, _methodName);
                        }
                    }
                    else
                    {
                        //200
                        _httpClientResponse.Status = true;
                        _httpClientResponse.Body = _response.Content.ReadAsStringAsync().Result;
                        _httpClientResponse.HeaderValues = _response.Headers;
                    }
                }

            }
            catch (HttpRequestException hrEx)
            {
                _httpClientResponse.Body = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, $"{Constants.GenericMessages.HttpRequestException}: " + hrEx.Message, _methodName);
            }
            catch (TaskCanceledException tcEx)
            {
                _httpClientResponse.Body = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, $"{Constants.GenericMessages.TaskCanceledException}: " + tcEx.Message, _methodName);
            }
            catch (Exception ex)
            {
                _httpClientResponse.Body = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);

            }
            finally
            {
                _response?.Dispose();
               
            }
            return _httpClientResponse;
        }

        public Task<IHttpClientResponse> HttpClientRequestAsync(IHttpClientRequestParam _httpClientRequestParams)
        {
            return Task.Run(() => HttpClientRequest(_httpClientRequestParams));
        }

        private async Task<IHttpClientResponse> HttpClientFormEncodedRequest(IHttpClientRequestParam _httpClientRequestParams)
        {
            string _methodName = "F:HttpClient:HttpClientFormEncodedRequest";
            string _mediaType = Constants.GenericMessages.MediaTypeFormUrlEncoded;

            IHttpClientResponse _httpClientResponse = new HttpClientResponse();
            HttpResponseMessage _response = null;
            HttpContent _content = null;
            try
            {
                if (_httpClientRequestParams == null)
                {
                    CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, Constants.GenericMessages.RequiredParametersMissing, _methodName);
                }
                else
                {
                    _content = new FormUrlEncodedContent(_httpClientRequestParams.FormValues.ToArray());
                    _content.Headers.ContentType = new MediaTypeHeaderValue(_mediaType);
                    _httpClient.Timeout = _httpClientRequestParams.Timeout;

                    _httpClient.DefaultRequestHeaders.Clear();

                    //_client.DefaultRequestHeaders.ExpectContinue = false;

                    _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_mediaType));

                    if (!string.IsNullOrEmpty(_httpClientRequestParams.AccessToken))
                    {
                        _httpClient.DefaultRequestHeaders.Add(Constants.TokenMessages.Authorization, $"{Constants.TokenMessages.Bearer} " + _httpClientRequestParams.AccessToken);
                    }

                    if (_httpClientRequestParams.HeaderValues != null)
                    {
                        foreach (var _header in _httpClientRequestParams.HeaderValues)
                        {
                            _httpClient.DefaultRequestHeaders.Add(_header.Key, _header.Value);
                        }
                    }
                    switch (_httpClientRequestParams.Type)
                    {
                        //case Enumeration.RequestType.GET:
                        //    break;
                        case Enumeration.RequestType.POST:
                            _response = await _httpClient.PostAsync(_httpClientRequestParams.Uri, _content); ;
                            break;
                        //case Enumeration.RequestType.PUT:
                        //    break;
                        //case Enumeration.RequestType.DELETE:
                        //    break;
                        default:
                            _httpClientResponse.Status = false;
                            _httpClientResponse.Body = $"{Constants.GenericMessages.InvalidHttpClientRequestType}";
                            break;
                    }

                    if (_response == null || _response?.IsSuccessStatusCode == false)
                    {
                        //4xx, 5xx
                        //handel - return PROPER ERROR FORMAT
                        //you may or may not get JSON
                        try
                        {
                            ApiErrorResponse _apiErrorResponse = new ApiErrorResponse();
                            _apiErrorResponse = JsonConvert.DeserializeObject<ApiErrorResponse>(_response.ToString());
                            if (_apiErrorResponse?.Data[0]?.Attributes?.Message == null)
                            {
                                _httpClientResponse.Body = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, $"Un-Expected Error, Could Not Parse Server Response", _methodName);
                            }
                            else
                            {
                                _httpClientResponse.Body = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, $"{_apiErrorResponse?.Data[0]?.Attributes.Message[0]}", _methodName);
                            }
                        }
                        catch (Exception ex)
                        {
                            // ERROR - Considering as App Error
                            _httpClientResponse.Body = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, null, $"{Constants.GenericMessages.HttpRequestException}: " + ex.Message, _methodName);
                        }
                    }
                    else
                    {
                        //200
                        _httpClientResponse.Status = true;
                        _httpClientResponse.Body = _response?.Content?.ReadAsStringAsync()?.Result;
                        _httpClientResponse.HeaderValues = _response?.Headers;
                    }
                }

            }
            catch (HttpRequestException hrEx)
            {
                _httpClientResponse.Body = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, $"{Constants.GenericMessages.HttpRequestException}: " + hrEx.Message, _methodName);
            }
            catch (TaskCanceledException tcEx)
            {
                _httpClientResponse.Body = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, $"{Constants.GenericMessages.TaskCanceledException}: " + tcEx.Message, _methodName);
            }
            catch (Exception ex)
            {
                _httpClientResponse.Body = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);

            }
            finally
            {
                _response?.Dispose();
                _content?.Dispose();

            }
            return _httpClientResponse;
        }

        public Task<IHttpClientResponse> HttpClientFormEncodedRequestAsync(IHttpClientRequestParam _httpClientRequestParams)
        {
            return Task.Run(() => HttpClientFormEncodedRequest(_httpClientRequestParams));
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
