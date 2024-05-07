using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using IXCheckCandidateApi.Globals;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class ImportController : ControllerBase
    {
        private readonly IImportFunctions _importFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IStats _stats;

        public ImportController(IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats, IImportFunctions __importFunctions)
        {

            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
            _importFunctions = __importFunctions;
        }

        [HttpPost]
        [Route("layout")]
        public async Task<IActionResult> ImportLayoutData(LayoutListBase _layout)
        {
            Data obj = new Data();
            obj.DataStatus = "hghghgh";

            //*************************************************************
            string _userPermission = PermissionConstants.AdminLayoutDropdownView;
            //*************************************************************
            string _methodName = "C:Import:ImportLayoutData";
            try
            
            {
                if (_layout == null)
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
                    string _token = string.Empty;
                    if (User.Identity.IsAuthenticated)
                    {
                        var jwtEncodedString = await HttpContext.GetTokenAsync("access_token");
                        var tokeng = new JwtSecurityToken(jwtEncodedString: jwtEncodedString);
                        _token = tokeng.RawData;
                    }
                    (_jsonReturn, _functionReturn) = await _importFunctions.ImportLayoutJsonAsync(_layout);

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
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

    }
}