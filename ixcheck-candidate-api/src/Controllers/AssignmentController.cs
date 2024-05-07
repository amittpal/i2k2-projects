using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;
using IXCheckCandidateApi.AppFunctions.Interfaces;

namespace IXCheckCandidateApi.Controllers 
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
	{
        #region Variable & Constructor

        private readonly IAssignmentFunctions _assignment;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;

        public AssignmentController(ILoggerFunctions __loggerFunctions, IAssignmentFunctions __assignment, ICacheFunctions __cacheFunctions, IApiResponse __apiResponse)
        {
            _loggerFunctions = __loggerFunctions;
            _assignment = __assignment;
            _cacheFunctions = __cacheFunctions;
            _apiResponse = __apiResponse;
        }

		#endregion


		[HttpGet]
		[AllowAnonymous]
		[Route("getExamInfo")]
		public async Task<IActionResult> GetExamInfoAsync()
		{
			string _methodName = "C:Asignment:GetExamInfoAsync";
			try
			{
				//bool _status = false;
				string _jsonReturn = string.Empty;

				_functionReturn = new FunctionReturn();

				(_jsonReturn, _functionReturn) = await _assignment.GetRegistrationLinkAsync();

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