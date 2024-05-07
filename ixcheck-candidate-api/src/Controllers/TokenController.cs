using IXCheckCommonLib.Globals;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.Models;
using Newtonsoft.Json;
using System;
using Microsoft.AspNetCore.Http;
using IXCheckCandidateApi.Models.Interfaces;
using IXCheckCandidateApi.Globals;
using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Models;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly IJwtIssuerOptions _jwtIssuerOptions;
        private ICoreUserInfo _coreUserInfo;
        private ILoggerFunctions _loggerFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IApiResponse _apiResponse;
        private readonly IOpenRegistrationFunctions _openFunctions;
        private readonly ICacheFunctions _cacheFunctions;

        public TokenController(IJwtIssuerOptions __jwtIssuerOptions, IApiResponse __apiResponse, IOpenRegistrationFunctions __openFunctions, ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions)
        {
            _jwtIssuerOptions = __jwtIssuerOptions;
            _apiResponse = __apiResponse;
            _openFunctions = __openFunctions;
            _cacheFunctions = __cacheFunctions;
            _loggerFunctions = __loggerFunctions;
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("")]
        public async Task<IActionResult> GenerateToken([FromBody] UserLogin _userLogin)
        {
            _functionReturn = new FunctionReturn();
            try
            {
                //Input check
                string _error = ValidationFunctions.ValidateUserLoginInput(_userLogin);
                if (!string.IsNullOrEmpty(_error))
                {
                    _functionReturn.Message.Add(_error);
                }
                if (_functionReturn.Message.Count > 0)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ValidationFailed, ApplicationConstants.MethodNames.GenerateToken);
                    return new UnauthorizedObjectResult(_errorJson);
                }

                (_coreUserInfo, _functionReturn) = await _openFunctions.AuthenticateUserAsync(_userLogin.UserName, _userLogin.Password, "Exam1",_userLogin.AppGuid);

                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, ApplicationConstants.MethodNames.GenerateToken);
                    return new UnauthorizedObjectResult(_errorJson);
                }

                _functionReturn = null;

                // _coreUserInfo.ApplicationId = Constants.ApplicationNames.InstituteService;
                _coreUserInfo.ApplicationId = Constants.ApplicationNames.AuthService; //may be change later
                _coreUserInfo.ApplicationGuId = _userLogin.AppGuid;
                // Uncomment first line and comment second line from below code to allow only single session of a user
                //_coreUserInfo.GlobalSH = Guid.NewGuid().ToString();
                _coreUserInfo.GlobalSH = Constants.ApplicationGlobalSH.AuthService;
                var _jtiValue = await _jwtIssuerOptions.JtiGenerator();
                _coreUserInfo.JTIValue = _jtiValue;
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, _coreUserInfo.UserID),
                    new Claim(JwtRegisteredClaimNames.Sub, _jwtIssuerOptions.Subject),
                    //new Claim(JwtRegisteredClaimNames.Jti, await _jwtIssuerOptions.JtiGenerator()),
                    new Claim(JwtRegisteredClaimNames.Jti,  _coreUserInfo.JTIValue),
                    new Claim(JwtRegisteredClaimNames.Iat, CommonFunctions.ToUnixEpochDate(_jwtIssuerOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
                    new Claim(Constants.TokenValues.AID, _coreUserInfo.ApplicationGuId),
                    new Claim(Constants.TokenValues.CUT,_coreUserInfo.UserType),
                    new Claim(Constants.TokenValues.UTID, _coreUserInfo.UserTypeId),
                    new Claim(Constants.TokenValues.GSH, _coreUserInfo.GlobalSH),
                    new Claim(Constants.TokenValues.UUID,_coreUserInfo.UserID),
                    new Claim(Constants.TokenValues.CID,_coreUserInfo.ExamId),
                    new Claim(Constants.TokenValues.ExamId,_coreUserInfo.ExamId)
                 };

                DateTime _tokenExpireDateTime = _jwtIssuerOptions.IssuedAt.Add(TimeSpan.FromMinutes(_jwtIssuerOptions.ValidForMinutes));
                int _tokenExpire = _jwtIssuerOptions.ValidForMinutes * 60;

                //******************************************
                // Setup Redis Cache with user permisions
                //******************************************
                //Insert into Redis Cache
                _functionReturn = new FunctionReturn();
                _functionReturn = await _cacheFunctions.InsertInCacheAsync(_coreUserInfo, _tokenExpire);
                if (_functionReturn.Status)
                {
                    //User information saved in cache
                    CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, Constants.GenericMessages.UserInformationSavedInCache, ApplicationConstants.MethodNames.GenerateToken);
                }
                else
                {
                    //ERROR saving User information saved in cache
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, Constants.GenericMessages.ErrorInSavingUserInformationInCache, ApplicationConstants.MethodNames.GenerateToken);
                }

                // Create the JWT security token and encode it.
                var jwt = new JwtSecurityToken(
                issuer: _jwtIssuerOptions.Issuer,
                audience: _jwtIssuerOptions.Audience,
                claims: claims,
                notBefore: _jwtIssuerOptions.NotBefore,
                expires: _tokenExpireDateTime,
                signingCredentials: _jwtIssuerOptions.SigningCredentials);

                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
                CoreUserInfo _user = new CoreUserInfo();
                _user.UserUniqueId = _coreUserInfo.UserUniqueId;

                List<string> _userPermissions = new List<string>();
                foreach (UserPermission up in _coreUserInfo.UserPermissions)
                {
                    _userPermissions.Add(up.Name);
                }
                if (_userPermissions.Count <= 0)
                {
                    _userPermissions.Add("");
                }

                var _json = _apiResponse.TokenResponse(Constants.ReturnMessageTypes.TokeReturn, encodedJwt, _user, _userPermissions, _tokenExpire, Constants.HttpStatusCodes.OK, true, _coreUserInfo.UserName, _coreUserInfo.UserType);
                return new OkObjectResult(_json);
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, ApplicationConstants.MethodNames.GenerateToken);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
            finally { _functionReturn = null; }
        }



        [HttpPost]
        [AllowAnonymous]
        [Route("captcha/validate")]

        public async Task<IActionResult>CaptchaValidate([FromBody] CaptchaValidation _captchaValidation)
        {
            //*************************************************************
            // Required Permission: admin:ExamShift:AdminExamListDropdownView
            // string _userPermission = PermissionConstants.AdminExamListDropdownView;
            //*************************************************************
            string _methodName = "C:Token:CaptchaValidate";
            try
            {
                if (_captchaValidation == null || _captchaValidation?.CaptchaId == null || _captchaValidation?.CaptchaCode == null)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                //bool _status = false;
                _functionReturn = new FunctionReturn();
                _functionReturn = await _openFunctions.CaptchaValidationAsync(_captchaValidation);
                if (!_functionReturn.Status)
                {
                    //error
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    //good return                                    
                    var _successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                    _functionReturn = null;
                    return new OkObjectResult(_successJson);
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }
    }
}