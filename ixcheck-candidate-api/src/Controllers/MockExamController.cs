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
using System.Security.Claims;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class MockExamController : ControllerBase
    {
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IStats _stats;
        private readonly IMockExamFunctions _mockExamFunctions;

        public MockExamController(IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats, IMockExamFunctions __mockExamFunctions)
        {
            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
            _mockExamFunctions = __mockExamFunctions;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("all/questions")]
        public async Task<IActionResult> GetFullExamFile()
        {
            string _methodName = "C:MockExam:GetFullExamFile";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                string _tokenUserGuid = _userIdentity.FindFirst(Constants.TokenValues.UUID)?.Value?.ToString();
                _functionReturn = new FunctionReturn();
                //_functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);                
                //_functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _mockExamFunctions.GetMockExamVistaDBAsync();
                    if (!_functionReturn.Status)
                    {
                        //error
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
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