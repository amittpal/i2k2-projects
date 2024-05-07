using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCandidateApi.AppFunctions.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using IXCheckCandidateApi.Models;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class OpenRegistrationController : ControllerBase
    {
        private readonly IOpenRegistrationFunctions _openregistrationFunctions;
        private readonly IRegistrationFunctions _registrationFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IStats _stats;


        public OpenRegistrationController(IRegistrationFunctions __registrationFunctions, IOpenRegistrationFunctions __openregistrationFunctions, IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats)
        {

            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _openregistrationFunctions = __openregistrationFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
            _registrationFunctions = __registrationFunctions;
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("{_layoutType}/getForm")]
        public async Task<IActionResult> LayoutJsonByIdAsync(string _layoutType)
        {
            // Required Permission: forms:get:json
            // string _userPermission = PermissionConstants.AdminLayoutJsonByIdAsync;
            String _methodName = "C:OpenRegistration:LayoutJsonByIdAsync";
            if (string.IsNullOrEmpty(_layoutType))
            {
                string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.DataRequired, _methodName);
                return new UnauthorizedObjectResult(_errorJson);
            }
            else
            {
                try
                {
                    string _jsonReturn = string.Empty;
                    _functionReturn = new FunctionReturn();
                    (_jsonReturn, _functionReturn) = await _openregistrationFunctions.LayoutJsonByIdAsync(_layoutType);
                    if (!_functionReturn.Status)
                    {
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
                    }
                    else
                    {
                        return new OkObjectResult(_jsonReturn);
                    }
                }
                catch (Exception ex)
                {
                    string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                    return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
                }
            }
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("getExamList")]
        public async Task<IActionResult> GetExamListAsync()
        {
            // Required Permission: forms:get:json
            // string _userPermission = PermissionConstants.AdminLayoutJsonByIdAsync;
            string _methodName = "C:OpenReg:LayoutJsonByIdAsync";
            try
            {
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _openregistrationFunctions.GetExamListAsync();
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("postFormValue")]
        public async Task<IActionResult> AddLayoutJsonValueAsync([FromBody] TemplateList _templateFormValue)
        {
            // Required Permission: admin:test:add
            string _methodName = "C:OpenReg:AddLayoutJsonValueAsync";
            if (_templateFormValue==null)
            {
                string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.DataRequired, _methodName);
                return new UnauthorizedObjectResult(_errorJson);
            }
            try
            {
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _registrationFunctions.AddLayoutJsonValueAsync(_templateFormValue);

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
            catch (Exception ex)
            {
                string _errorJson =
                        CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("generateotp")]
        public async Task<IActionResult> GenerateOTPAsync([FromBody] ValidationOTP _validationOTP)
        {
            string _methodName = "C:OpenReg:GenerateOTPAsync";
            try
            {
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();
                _functionReturn = await _registrationFunctions.GenerateOTPAsync(_validationOTP);
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
            catch (Exception ex)
            {
                string _errorJson =
                        CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("validateotp")]
        public async Task<IActionResult> ValidateOTPAsync([FromBody] ValidationOTP _validationOTP)
        {
            string _methodName = "C:OpenReg:ValidateOTPAsync";
            try
            {
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();
                _functionReturn = await _registrationFunctions.ValidateOTPAsync(_validationOTP);
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
            catch (Exception ex)
            {
                string _errorJson =
                        CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("{_candidateGuid}/getCandidateDetail")]
        public async Task<IActionResult> CandidateJsonByGuidAsync(string _candidateGuid)
        {
            // Required Permission: forms:get:json
            // string _userPermission = PermissionConstants.AdminLayoutJsonByIdAsync;
            string _methodName = "C:OpenReg:LayoutJsonByIdAsync";
            try
            {
                if (string.IsNullOrEmpty(_candidateGuid))
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.DataRequired, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _registrationFunctions.CandidateJsonByGuidAsync(_candidateGuid);
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }
    }
}