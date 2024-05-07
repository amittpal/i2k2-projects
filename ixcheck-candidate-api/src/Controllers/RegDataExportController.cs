using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Globals;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class RegDataExportController : ControllerBase
    {
        private readonly IRegDataExportFunction _regDataExportFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IStats _stats;

        public RegDataExportController(IRegDataExportFunction __regDataExportFunctions, IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats)
        {

            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _regDataExportFunctions = __regDataExportFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
        }

        [HttpGet]
        [Route("insertregistrationdata/{_guid}")]
        public async Task<IActionResult> InsertData(string _guid)
        {
            //*************************************************************
            // Required Permission: admin:RegDataImport:AdminExamListDropdownView
            string _userPermission = PermissionConstants.AdminRegDataImportView;
            //*************************************************************
            string _methodName = "C:RegDataImport:InsertData";
            try
            {
                string _jsonReturn = string.Empty;
                string _token = string.Empty;
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
                    //if (User.Identity.IsAuthenticated)
                    //{
                    //    var jwtEncodedString = await HttpContext.GetTokenAsync("access_token");
                    //    var tokeng = new JwtSecurityToken(jwtEncodedString: jwtEncodedString);
                    //    _token = tokeng.RawData;
                    //}
                    (_jsonReturn, _functionReturn) = await _regDataExportFunctions.ExportRegistrationsAsync(_guid);
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

        [HttpGet]
        [Route("registrationdata/{_guid}")]
        public async Task<IActionResult> InsertDataByExamGuid(string _guid)
        {
            //*************************************************************
            // Required Permission: admin:RegDataImport:AdminExamListDropdownView
            string _userPermission = PermissionConstants.AdminRegDataImportView;
            //*************************************************************
            string _methodName = "C:RegDataImport:InsertDataByExamGuid";
            try
            {
                if (string.IsNullOrEmpty(_guid))
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.DataRequired, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                string _jsonReturn = string.Empty;
                string _token = string.Empty;
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
                    //if (User.Identity.IsAuthenticated)
                    //{
                    //    var jwtEncodedString = await HttpContext.GetTokenAsync("access_token");
                    //    var tokeng = new JwtSecurityToken(jwtEncodedString: jwtEncodedString);
                    //    _token = tokeng.RawData;
                    //}
                    (_jsonReturn, _functionReturn) = await _regDataExportFunctions.ExportRegistrationDetailsAsync(_guid);
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
    }
}