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
using System.Text;
using System.Threading.Tasks;
using IXCheckCandidateApi.Models;
using IXCheckCandidateApi.Models.HttpPost;
using IXCheckCandidateApi.AppFunctions;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class SyncRegistrationsController : ControllerBase
    {
        private readonly ISyncRegistrationFunctions _syncRegistrationFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IFileAndDirFunctions _fileAndDirFunctions;
        private readonly IStats _stats;

        public SyncRegistrationsController(ISyncRegistrationFunctions __syncRegistrationFunctions, IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats, IFileAndDirFunctions __fileAndDirFunctions)
        {

            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _syncRegistrationFunctions = __syncRegistrationFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
            _fileAndDirFunctions = __fileAndDirFunctions;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("createregistrationdata")]
        public async Task<IActionResult> CreateRegistrationsData(SyncRegistration _syncRegistration)
        {
            //*************************************************************
            string _userPermission = PermissionConstants.AdminLayoutDropdownView;
            //*************************************************************
            string _methodName = "C:SyncRegistration:CreateRegistrationsData";
            try
            {
                if (_syncRegistration == null)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.DataRequired, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();

                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _syncRegistrationFunctions.CreateRegistrationDataAsync(_syncRegistration);

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


        [HttpPost]
        [AllowAnonymous]
        [RequestSizeLimit(52428800000)]
        [Route("file/chunk")]
        public async Task<IActionResult> GetFileChunk([FromBody] HttpFileParams _httpFileParams)
        {
            //*************************************************************
            // Required Permission: admin:test:view
            //string _userPermission = AppPermissions.AdminTestView;
            //*************************************************************
            string _methodName = "C:SyncRegistration:GetFileChunk";
            FileData _fileData;
            string _errorJson;           
            try
            {
                CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "Get Stream File Controller Call Started", _methodName);

                if (_httpFileParams == null && _httpFileParams?.FolderPath == null && _httpFileParams?.DestinationPath == null && _httpFileParams?.FileName == null)
                {
                    _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                (_fileData, _functionReturn) = await _fileAndDirFunctions.StreamFileChunkAsync(_httpFileParams);
                if (!_functionReturn.Status)
                {
                    _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "Get Stream File Controller Call Ended", _methodName);
                //good return
                return new OkObjectResult(_fileData);
            }
            catch (Exception ex)
            {
                _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }
    }
}