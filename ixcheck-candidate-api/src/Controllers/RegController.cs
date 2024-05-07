using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Globals;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using IXCheckCandidateApi.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using IxcheckRegApi.Models;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class RegController : ControllerBase
    {
        #region Constructors and Variables
        private readonly IRegistrationFunctions _registrationFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IStats _stats;

        public RegController(IRegistrationFunctions __registrationFunctions, IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats)
        {

            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _registrationFunctions = __registrationFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
        }
        #endregion

        //[Authorize]
        [HttpPost]
        [Route("postForm")]
        public async Task<IActionResult> AddLayoutJsonAsync([FromBody] TemplateForm _templateForm)
        {
            //*************************************************************
            // Required Permission: admin:test:add
            string _userPermission = PermissionConstants.AdminLayoutAdd;
            //**************************************************************
            string _methodName = "C:Reg:AddLayoutJsonAsync";
            try
            {
                string _jsonReturn = string.Empty;

                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();

                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                // _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.AddLayoutJsonAsync(_templateForm);

                    if (!_functionReturn.Status)
                    {
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
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        //[Authorize]
        [HttpPost]
        [Route("postFormValue")]
        public async Task<IActionResult> AddLayoutJsonValueAsync([FromBody] TemplateList _templateFormValue)
        {
            //*************************************************************
            // Required Permission: admin:test:add
            string _userPermission = PermissionConstants.AdminLayoutValueSave;
            //**************************************************************
            string _methodName = "C:Reg:AddLayoutJsonValueAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();

                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.AddLayoutJsonValueAsync(_templateFormValue);

                    if (!_functionReturn.Status)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        var _successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        _functionReturn = null;
                        return new OkObjectResult(_successJson);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson =
                        CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        //[Authorize]
        [HttpPost]
        [Route("editForm")]
        public async Task<IActionResult> EditLayoutJsonAsync([FromBody] TemplateForm _templateForm)
        {
            //*************************************************************
            // Required Permission: admin:test:add
            string _userPermission = PermissionConstants.AdminLayoutEdit;
            //**************************************************************
            string _methodName = "C:Reg:EditLayoutJsonAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();

                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                //  _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.EditLayoutJsonAsync(_templateForm);

                    if (!_functionReturn.Status)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        var successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        return new OkObjectResult(successJson);
                    }
                }

            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }

        }

        //[Authorize]
        [HttpGet]
        [Route("{_id:int}/getForm")]
        public async Task<IActionResult> LayoutJsonByIdAsync(UInt64 _id)
        {
            //*************************************************************
            // Required Permission: forms:get:json
            string _userPermission = PermissionConstants.AdminLayoutJsonByIdAsync;
            //*************************************************************
            string _methodName = "C:Reg:LayoutJsonByIdAsync";
            //_id = 10;

            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();

                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;

                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.LayoutJsonByIdAsync(_id);

                    if (!_functionReturn.Status)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("{_guid}/candidateInitialInfo")]
        public async Task<IActionResult> CandidateInitialInfoByIdAsync(string _guid)
        {
            //*************************************************************
            // Required Permission: admin:Exam:Type:view
            string _userPermission = PermissionConstants.AdminCandidateInitialInfo;
            //*************************************************************
            string _methodName = "C:Registration:CandidateInitialInfoByIdAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();

                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _registrationFunctions.CandidateInitialInfoByIdAsync(_guid);

                    if (!_functionReturn.Status)
                    {
                        //error
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("registrationsubmit")]
        public async Task<IActionResult> RegistrationSubmitAsync([FromBody] RegistrationData _registrationData)
        {
            //*************************************************************
            // Required Permission: admin:Exam:Type:view
            string _userPermission = PermissionConstants.AdminCandidateInitialInfo;
            //*************************************************************
            string _methodName = "C:Registration:RegistrationSubmitAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();

                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                // _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    _functionReturn = await _registrationFunctions.RegistrationSubmitAsync(_registrationData);

                    if (_functionReturn.Status == false)
                    {
                        //error
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        var _successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        _functionReturn = null;
                        return new OkObjectResult(_successJson);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("updateemailinfo")]
        public async Task<IActionResult> UpdateEmailAsync([FromBody] RegistrationData _registrationData)
        {
            //*************************************************************
            // Required Permission: admin:Exam:Type:view
            string _userPermission = PermissionConstants.AdminUpdateEmailInfo;
            //*************************************************************
            string _methodName = "C:Registration:UpdateEmailAsync";
            try
            {
                string _jsonReturn = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();

                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                // _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    _functionReturn = await _registrationFunctions.UpdateEmailAsync(_registrationData);

                    if (!_functionReturn.Status)
                    {
                        //error
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        var _successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        _functionReturn = null;
                        return new OkObjectResult(_successJson);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpPut]
        [Authorize]
        [Route("user/changepassword")]
        public async Task<IActionResult> ChangeCustomerUserPassword([FromBody] CustomerUser _customerUser)
        {
            string _methodName = "Reg:ChangeCustomerUserPassword";
            //*************************************************************
            // Required Permission: regplan:reg:changepassword
            string _userPermission = PermissionConstants.RegplanRegChangePassword;
            //*************************************************************
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                if (_customerUser == null)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    //_functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                    //if (!_functionReturn.Status)
                    //{
                    //    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    //    return new UnauthorizedObjectResult(_errorJson);
                    //}
                    //else
                    //{
                    _functionReturn = await _registrationFunctions.ChangeCustomerUserPasswordAsync(_customerUser);
                    if (!_functionReturn.Status)
                    {
                        string _errorJson = _apiResponse.ErrorResponse(Constants.ReturnMessageTypes.AppError, Constants.ReturnMessageTypes.AppError, _functionReturn.Message, Constants.HttpStatusCodes.Unauthorized, true);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        string _sucessResponseJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.SuccessMessage, Constants.ReturnMessageTypes.SuccessMessage, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        return new OkObjectResult(_sucessResponseJson);
                    }
                    //}
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [Authorize, HttpPut]
        [Route("user/{_userName}/{_candidateGuid}/resetpassword/email")]
        public async Task<IActionResult> ResetUserPasswordEmail(string _userName, string _candidateGuid)
        {
            string _methodName = "Controller:ResetUserPasswordEmail";
            //*************************************************************
            // Required Permission: regplan:reg:resetpassword:email
            string _userPermission = PermissionConstants.RegplanRegResetPasswordEmail;
            //*************************************************************
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                if (string.IsNullOrEmpty(_userName) || string.IsNullOrEmpty(_candidateGuid))
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    //_functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);

                    //if (!_functionReturn.Status)
                    //{
                    //    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    //    return new UnauthorizedObjectResult(_errorJson);
                    //}
                    //else
                    //{
                    _functionReturn = await _registrationFunctions.ResetUserPasswordEmailAsync(_userName, _candidateGuid);
                    if (!_functionReturn.Status)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        string _sucessResponseJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.SuccessMessage, Constants.ReturnMessageTypes.SuccessMessage, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        return new OkObjectResult(_sucessResponseJson);
                    }
                    //}
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        
        [HttpPost]
        [AllowAnonymous]
        [Route("postRegGridValue")]
        public async Task<IActionResult> AddRegGridComponentValueAsync([FromBody] RegGridComponentValues _regGridComponentList)
        {
            //*************************************************************
            // Required Permission: regplan:reg:form:value:add
            string _userPermission = PermissionConstants.RegplanRegFormValueAdd;
            //**************************************************************
            string _methodName = "C:Reg:AddRegGridComponentValueAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);
                    (_jsonReturn, _functionReturn) = await _registrationFunctions.AddRegGridComponentValueAsync(_regGridComponentList);

                    if (!_functionReturn.Status)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        var _successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        _functionReturn = null;
                        return new OkObjectResult(_jsonReturn);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson =
                        CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("deleteRegGridValue")]
        public async Task<IActionResult> DeleteRegGridComponentValueAsync([FromBody] RegGridComponent _regGridComponent)
        {
            //*************************************************************
            // Required Permission: regplan:reg:form:value:add
            string _userPermission = PermissionConstants.RegplanRegFormValueAdd;
            //**************************************************************
            string _methodName = "C:Reg:DeleteRegGridComponentValueAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);
                    (_jsonReturn, _functionReturn) = await _registrationFunctions.DeleteRegGridComponentValueAsync(_regGridComponent);

                    if (!_functionReturn.Status)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        var _successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                        _functionReturn = null;
                        //return new OkObjectResult(_jsonReturn);
                        return new OkObjectResult(_successJson);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson =
                        CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("getRegGridComponentList/{_candidateGuid}")]
        public async Task<IActionResult> RegGridComponentListAsync(string _candidateGuid)
        {

            //*************************************************************
            // Required Permission: regplan:reg:registrations:view
            string _userPermission = PermissionConstants.RegplanRegRegistrationsView;
            //*************************************************************
            string _methodName = "C:Reg:RegGridComponentListAsync";
            //_id = 10;

            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.RegGridComponentListAsync(_candidateGuid);

                    if (_functionReturn.Status == false)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("{_candidateGuid}/getLayoutComponentList/{_id:int}")]
        public async Task<IActionResult> LayoutComponentListAsync(string _candidateGuid, UInt64 _id)
        {

            //*************************************************************
            // Required Permission: regplan:reg:registrations:view
            string _userPermission = PermissionConstants.RegplanRegRegistrationsView;
            //*************************************************************
            string _methodName = "C:Reg:LayoutComponentListAsync";
            //_id = 10;

            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.LayoutComponentListAsync(_candidateGuid, _id);

                    if (_functionReturn.Status == false)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);
                    }
                }

            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }

        }

        [HttpGet]
        [AllowAnonymous]
        [Route("getRegGridComponentViewList/{_candidateGuid}")]
        public async Task<IActionResult> RegGridComponentViewListAsync(string _candidateGuid)
        {

            //*************************************************************
            // Required Permission: regplan:reg:registrations:view
            string _userPermission = PermissionConstants.RegplanRegRegistrationsView;
            //*************************************************************
            string _methodName = "C:Reg:RegGridComponentListAsync";
            //_id = 10;

            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.RegGridComponentViewListAsync(_candidateGuid);

                    if (_functionReturn.Status == false)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("getCandidateEligibility/{_candidateGuid}")]
        public async Task<IActionResult> GetCandidateEligibilityAsync(string _candidateGuid)
        {

            //*************************************************************
            // Required Permission: regplan:reg:registrations:view
            string _userPermission = PermissionConstants.RegplanRegRegistrationsView;
            //*************************************************************
            string _methodName = "C:Reg:GetCandidateEligibilityAsync";
            //_id = 10;

            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.GetCandidateEligibilityAsync(_candidateGuid);

                    if (_functionReturn.Status == false)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);
                    }
                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }
        [HttpGet]
        [AllowAnonymous]
        [Route("saveExamEligibilityCriteriaAsync/{_candidateGuid},{_registrationGuid}")]
        public async Task<IActionResult> SaveExamEligibilityCriteriaAsync(string _candidateGuid, string _registrationGuid)
        {

            //*************************************************************
            // Required Permission: regplan:reg:registrations:view
            string _userPermission = PermissionConstants.RegplanRegRegistrationsView;
            //*************************************************************
            string _methodName = "C:Reg:SaveExamEligibilityCriteriaAsync";
            //_id = 10;

            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);

                    (_jsonReturn, _functionReturn) = await _registrationFunctions.SaveExamEligibilityCriteriaAsync(_candidateGuid, _registrationGuid);

                    if (_functionReturn.Status == false)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);
                    }
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