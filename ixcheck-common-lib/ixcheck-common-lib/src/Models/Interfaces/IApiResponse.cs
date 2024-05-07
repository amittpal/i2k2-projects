using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IApiResponse
    {
        /// <summary>
        /// Get Api Error Response
        /// </summary>
        /// <param name="_type"></param>
        /// <param name="_errorType"></param>
        /// <param name="_errorMessage"></param>
        /// <param name="_httpStatusCode"></param>
        /// <param name="_apiStatus"></param>
        /// <returns>string</returns>
        string ErrorResponse(string _type, string _errorType, List<string> _errorMessage, string _httpStatusCode, bool _apiStatus);
        string TokenResponse(string _type, string _accessToken, int _expiresIn, string _httpStatusCode, bool _apiStatus);
        string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus);
        //New-Code-03-06-2020//
        string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus, string _username, string _userType);
        //

        string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, List<string> _accessGroups, int _expiresIn, string _httpStatusCode, bool _apiStatus, string _username, string _userType);
        string TokenResponse(string _type, string _accessToken, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus, ICoreUserInfo _coreUserInfo);
        string SuccessResponse(string _type, string _messageType, List<string> _successMessage, string _httpStatusCode, bool _apiStatus);
        string SuccessResponse(string _type, string _messageType, List<string> _successMessage, string _httpStatusCode, bool _apiStatus, ApiSuccessResponse.DataValue _dataValue);
        Task<string> ConfigResponse(string _type, IApiSettings _apiSettings, string _httpStatusCode, bool _apiStatus);

        string CustomerTokenResponse(string _type, string _accessToken, CustomerUserInfo _customerUserInfo, int _expiresIn, string _httpStatusCode, bool _apiStatus);
        string TokenResponse(string _type, string _accessToken, CoreUserInfo _coreUserInfo, List<string> _userPermissions, int _expiresIn, string _httpStatusCode, bool _apiStatus, string _username, string _userType);
    }
}
