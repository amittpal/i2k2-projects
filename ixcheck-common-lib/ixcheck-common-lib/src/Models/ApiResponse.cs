using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models.Interfaces;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IXCheckCommonLib.Models
{
    public class ApiResponse : IApiResponse
    {
        [JsonProperty(JsonReturnConstants.PropertyNames.HttpStatus, Required = Required.Always)]
        private string HttpStatus { get; set; }

        [JsonProperty(JsonReturnConstants.PropertyNames.Message, Required = Required.Always)]
        private string Message { get; set; }

        [JsonProperty(JsonReturnConstants.PropertyNames.Data, Required = Required.Always)]
        private string Data { get; set; }

        /// <summary>
        /// Get Api Error Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_errorType"></param>
        /// <param name="_errorMessage"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns>string</returns>
        public string ErrorResponse(string _type, string _errorType, List<string> _errorMessage, string _httpStatusCode, bool _apiStatus)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiErrorResponse.DataList _apiErrorData = new ApiErrorResponse.DataList();
            ApiErrorResponse.Attributes _apiErrorDataAttributes = new ApiErrorResponse.Attributes();
            _apiErrorData.Type = _type;
            _apiErrorDataAttributes.MessageType = _errorType;
            _apiErrorDataAttributes.Message = _errorMessage;
            _apiErrorData.Attributes = _apiErrorDataAttributes;
            var _apiJsonErrorResponse = new ApiErrorResponse
            {
                //ApiStatus = _apiStatus,
                HttpStatus = _httpStatusCode,
                Data = new List<ApiErrorResponse.DataList>
                {
                    _apiErrorData
                }
            };

            //return BadRequest("Invalid credentials");
            var _errorJson = JsonConvert.SerializeObject(_apiJsonErrorResponse, Formatting.None);
            return _errorJson;
        }

        /// <summary>
        /// Get Api Token Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_accessToken"></param>
        /// <param name="_expiresIn"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns>string</returns>
        public string TokenResponse(string _type, string _accessToken, int _expiresIn, string _httpStatusCode, bool _apiStatus)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiTokenResponse.TokenData _tokenData = new ApiTokenResponse.TokenData()
            {
                AccessToken = _accessToken
            };
            var _apiJsonResponse = new ApiTokenResponse
            {
                HttpStatus = _httpStatusCode,
                Token = _tokenData
            };
            var _jsonData = JsonConvert.SerializeObject(_apiJsonResponse, _serializerSettings);
            return _jsonData;
        }

        /// <summary>
        /// Get Api Token Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_accessToken"></param>
        /// <param name="_expiresIn"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns>string</returns>
        public string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiTokenResponse.TokenData _tokenData = new ApiTokenResponse.TokenData()
            {
                AccessToken = _accessToken,
                AccessPermissions = _userPermissions
            };
            var _apiJsonResponse = new ApiTokenResponse
            {
                HttpStatus = _httpStatusCode,
                Token = _tokenData
            };
            var _jsonData = JsonConvert.SerializeObject(_apiJsonResponse, _serializerSettings);
            return _jsonData;
        }


        // New Code
        public string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus, string _username, string _userType)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiTokenResponse.TokenData _tokenData = new ApiTokenResponse.TokenData()
            {
                AccessToken = _accessToken,
                AccessPermissions = _userPermissions,
            };
            var _apiJsonResponse = new ApiTokenResponse
            {
                HttpStatus = _httpStatusCode,
                Token = _tokenData,
                UserName = _username,
                UserType = _userType

            };
            var _jsonData = JsonConvert.SerializeObject(_apiJsonResponse, _serializerSettings);
            return _jsonData;
        }

        // New Code
        public string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, List<string> _accessGroups, int _expiresIn, string _httpStatusCode, bool _apiStatus, string _username, string _userType)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiTokenResponse.TokenData _tokenData = new ApiTokenResponse.TokenData()
            {
                AccessToken = _accessToken,
                AccessGroups= _accessGroups,
            };
            var _apiJsonResponse = new ApiTokenResponse
            {
                HttpStatus = _httpStatusCode,
                Token = _tokenData,
                UserName = _username,
                UserType = _userType

            };
            var _jsonData = JsonConvert.SerializeObject(_apiJsonResponse, _serializerSettings);
            return _jsonData;
        }

        // New Code
        public string TokenResponse(string _type, string _accessToken, CoreUserInfo _coreUserInfo, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus, string _username, string _userType)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiTokenResponse.TokenData _tokenData = new ApiTokenResponse.TokenData()
            {
                AccessToken = _accessToken,
                AccessPermissions = _userPermissions,
            };
            var _apiJsonResponse = new ApiTokenResponse
            {
                HttpStatus = _httpStatusCode,
                Token = _tokenData,
                UserName = _username,
                UserType = _userType,
                CoreUserInfo = _coreUserInfo

            };
            var _jsonData = JsonConvert.SerializeObject(_apiJsonResponse, _serializerSettings);
            return _jsonData;
        }

        //

        public string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus, ICoreUserInfo _coreUserInfo)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiTokenResponse.TokenData _tokenData = new ApiTokenResponse.TokenData()
            {
                AccessToken = _accessToken,
                AccessPermissions = _userPermissions,
                CoreUserInfo = _coreUserInfo,
            };
            var _apiJsonResponse = new ApiTokenResponse
            {
                HttpStatus = _httpStatusCode,
                Token = _tokenData,
                UserName = _coreUserInfo?.UserName,
                UserType = _coreUserInfo?.UserType,

            };
            var _jsonData = JsonConvert.SerializeObject(_apiJsonResponse, _serializerSettings);
            return _jsonData;
        }

        /// <summary>
        /// Get Api Token Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_accessToken"></param>
        /// <param name="_expiresIn"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns>string</returns>
        public string CustomerTokenResponse(string _type, string _accessToken, CustomerUserInfo _customerUserInfo, int _expiresIn, string _httpStatusCode, bool _apiStatus)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            CustomerApiTokenResponse.TokenData _tokenData = new CustomerApiTokenResponse.TokenData()
            {
                AccessToken = _accessToken,
                AccessPermissions = _customerUserInfo.UserPermissions
            };
            CustomerApiTokenResponse.CustomerInfoData _customerInfoData = new CustomerApiTokenResponse.CustomerInfoData()
            {
                UserName = _customerUserInfo.UserName,
                UserType = _customerUserInfo.UserType,
                CustomerName = _customerUserInfo.CustomerName,
                CompanyName = _customerUserInfo.CompanyName,
                UserTypeId = _customerUserInfo.UserTypeId,
                CustomerUserFullName = _customerUserInfo.CustomerUserFullName,
                CustomerNumber = _customerUserInfo.CustomerNumber

            };
            var _apiJsonResponse = new CustomerApiTokenResponse
            {
                HttpStatus = _httpStatusCode,
                Token = _tokenData,
                CustomerInfo = _customerInfoData
            };
            var _jsonData = JsonConvert.SerializeObject(_apiJsonResponse, _serializerSettings);
            return _jsonData;
        }



        /// <summary>
        /// Get Api Success Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_messageType"></param>
        /// <param name="_successMessage"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns></returns>
        public string SuccessResponse(string _type, string _messageType, List<string> _successMessage, string _httpStatusCode, bool _apiStatus)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiSuccessResponse.DataList _apiSuccessData = new ApiSuccessResponse.DataList();
            ApiSuccessResponse.Attributes _apiSuccessDataAttributes = new ApiSuccessResponse.Attributes();
            _apiSuccessData.Type = _type;
            _apiSuccessDataAttributes.MessageType = _messageType;
            _apiSuccessDataAttributes.Message = _successMessage;
            _apiSuccessData.Attributes = _apiSuccessDataAttributes;
            var _apiSuccessResponseJson = new ApiSuccessResponse
            {
                //ApiStatus = _apiStatus,
                HttpStatus = _httpStatusCode,
                Data = new List<ApiSuccessResponse.DataList>
                {
                    _apiSuccessData
                }
            };
            //return BadRequest("Invalid credentials");
            var _successJson = JsonConvert.SerializeObject(_apiSuccessResponseJson, Formatting.None);
            return _successJson;
        }

        /// <summary>
        /// Get Api Success Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_messageType"></param>
        /// <param name="_successMessage"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns></returns>
        public string SuccessResponse(string _type, string _messageType, List<string> _successMessage, string _httpStatusCode, bool _apiStatus, ApiSuccessResponse.DataValue _dataValue)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiSuccessResponse.DataList _apiSuccessData = new ApiSuccessResponse.DataList();
            ApiSuccessResponse.Attributes _apiSuccessDataAttributes = new ApiSuccessResponse.Attributes();
            _apiSuccessData.Type = _type;
            _apiSuccessDataAttributes.MessageType = _messageType;
            _apiSuccessDataAttributes.Message = _successMessage;
            _apiSuccessData.Attributes = _apiSuccessDataAttributes;
            _apiSuccessData.Data = _dataValue;
            var _apiSuccessResponseJson = new ApiSuccessResponse
            {
                //ApiStatus = _apiStatus,
                HttpStatus = _httpStatusCode,
                Data = new List<ApiSuccessResponse.DataList>
                {
                    _apiSuccessData
                }
            };
            //return BadRequest("Invalid credentials");
            var _successJson = JsonConvert.SerializeObject(_apiSuccessResponseJson, Formatting.None);
            return _successJson;
        }

        /// <summary>
        /// Get Api Config Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_apiConfigSettings"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns></returns>
        public Task<string> ConfigResponse(string _type, IApiSettings _apiSettings, string _httpStatusCode, bool _apiStatus)
        {
            JsonSerializerSettings _serializerSettings = new JsonSerializerSettings();
            ApiConfigResponse.DataList _apiConfigDataList = new ApiConfigResponse.DataList();
            ApiConfigResponse.Attributes _apiConfigAttributes = new ApiConfigResponse.Attributes();
            var _list = new List<ApiConfigResponse.Attributes>();
            foreach (IApiDetails _detail in _apiSettings.ApiDetails)
            {
                _list.Add(new ApiConfigResponse.Attributes()
                {
                    Title = _detail.Title,
                    Url = _detail.Url,
                    Version = _detail.Version,
                    PublishedDate = _detail.PublishedDate,
                    Description = _detail.Description
                });
            }
            _apiConfigDataList.Type = Constants.Api.ApiDetails;
            _apiConfigDataList.Attributes = _list;
            var _apiConfigResponseJson = new ApiConfigResponse
            {
                HttpStatus = _httpStatusCode,
                Data = _apiConfigDataList
            };
            var _successJson = JsonConvert.SerializeObject(_apiConfigResponseJson, Formatting.None);
            return Task.FromResult<string>(_successJson);
        }
    }

    /// <summary>
    /// Get Api Token Response
    /// </summary>
    public class ApiTokenResponse
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.HttpStatus, Required = Required.Always)]
        public string HttpStatus { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Token, Required = Required.Always)]
        public TokenData Token { get; set; }

        public class TokenData
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.AccessToken, Required = Required.Always)]
            public string AccessToken { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.AccessPermissions, Required = Required.AllowNull, NullValueHandling = NullValueHandling.Ignore)]
            public List<string> AccessPermissions { get; set; }

            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.AccessGroups, Required = Required.AllowNull, NullValueHandling = NullValueHandling.Ignore)]
            public List<string> AccessGroups { get; set; }

            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.CoreUserInfo, Required = Required.AllowNull, NullValueHandling = NullValueHandling.Ignore)]
            public ICoreUserInfo CoreUserInfo { get; set; }
        }

        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.UserName, Required = Required.Default)]
        public string UserName { get; set; }

        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.UserType, Required = Required.Default)]
        public string UserType { get; set; }

        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.CoreUserInfo, Required = Required.Default, NullValueHandling = NullValueHandling.Ignore)]
        public CoreUserInfo CoreUserInfo { get; set; }
    }

    /// <summary>
    /// Get Api Token Response
    /// </summary>
    public class CustomerApiTokenResponse
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.HttpStatus, Required = Required.Always)]
        public string HttpStatus { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Token, Required = Required.Always)]
        public TokenData Token { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.CustomerInfo, Required = Required.Always)]
        public CustomerInfoData CustomerInfo { get; set; }
        public class TokenData
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.AccessToken, Required = Required.Always)]
            public string AccessToken { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.AccessPermissions, Required = Required.Always)]
            public List<string> AccessPermissions { get; set; }
        }
        public class CustomerInfoData
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.UserTypes, Required = Required.Always)]
            public string UserType { get; set; }

            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.UserName, Required = Required.Always)]
            public string UserName { get; set; }

            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.CustomerUserFullName, Required = Required.Default)]
            public string CustomerUserFullName { get; set; }

            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.UserTypeId, Required = Required.Always)]
            public string UserTypeId { get; set; }

            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.CompanyName, Required = Required.Always)]
            public string CompanyName { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.CustomerName, Required = Required.Always)]
            public string CustomerName { get; set; }

            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.CustomerNumber, Required = Required.Default)]
            public string CustomerNumber { get; set; }
        }
    }

    /// <summary>
    /// Get Api Error Response
    /// </summary>
    public class ApiErrorResponse
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.HttpStatus, Required = Required.Always)]
        public string HttpStatus { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Data, Required = Required.Always)]
        public List<DataList> Data { get; set; }

        public class Attributes
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MessageType, Required = Required.Always)]
            public string MessageType { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Message, Required = Required.Always)]
            public List<string> Message { get; set; }
        }

        public class DataList
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Type, Required = Required.Always)]
            public string Type { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Attributes, Required = Required.Always)]
            public Attributes Attributes { get; set; }
        }
    }

    /// <summary>
    /// Get Api Success Response
    /// </summary>
    public class ApiSuccessResponse
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.HttpStatus, Required = Required.Always)]
        internal string HttpStatus { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Data, Required = Required.Always)]
        internal List<DataList> Data { get; set; }

        public class Attributes
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.MessageType, Required = Required.Always)]
            public string MessageType { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Message, Required = Required.Always)]
            public List<string> Message { get; set; }
        }

        public class DataValue
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Id, Required = Required.AllowNull)]
            public int Id { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Number, Required = Required.AllowNull)]
            public int Number { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Status, Required = Required.AllowNull)]
            public string Status { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.StatusText, Required = Required.AllowNull)]
            public string StatusText { get; set; }

        }

        internal class DataList
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Type, Required = Required.Always)]
            internal string Type { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Attributes, Required = Required.Always)]
            internal Attributes Attributes { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Data, Required = Required.AllowNull)]
            internal DataValue Data { get; set; }
        }
    }

    /// <summary>
    /// Get Api Config Response
    /// </summary>
    public class ApiConfigResponse
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.HttpStatus, Required = Required.Always)]
        public string HttpStatus { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Data, Required = Required.Always)]
        public DataList Data { get; set; }

        public class Attributes
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Title, Required = Required.Always)]
            public string Title { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Url, Required = Required.Always)]
            public string Url { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Version, Required = Required.Always)]
            public string Version { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.PublishedDate, Required = Required.Always)]
            public string PublishedDate { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Description, Required = Required.Always)]
            public string Description { get; set; }
        }

        public class DataList
        {
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Type, Required = Required.Always)]
            public string Type { get; set; }
            [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Attributes, Required = Required.Always)]
            public List<Attributes> Attributes { get; set; }
        }
    }
}

