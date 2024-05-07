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

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class SharedController : ControllerBase
    {
        private readonly ISharedFunctions _sharedFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IStats _stats;


        public SharedController(ISharedFunctions __sharedFunctions, IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats)
        {

            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _sharedFunctions = __sharedFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("category/list")]
        public async Task<IActionResult> GetCategoryListAsync()
        {
            //*************************************************************


            //*************************************************************
            string _methodName = "C:Registration:GetCategoryListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetCategoryListAsync();
                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("gender/list")]
        public async Task<IActionResult> GetGenderListAsync()
        {
            string _methodName = "C:Registration:GetGenderListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetGenderListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("city/list")]
        public async Task<IActionResult> GetCityListAsync([FromQuery(Name = "stateid")] int stateid)
        {
            string _methodName = "C:Registration:GetCityListAsync";
            try
            {
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetCityListAsync(stateid);
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("city/list/priority/{_registrationGuid}")]
        public async Task<IActionResult> GetCityListPriorityAsync(string _registrationGuid)
        {
            //*************************************************************
            // Required Permission: regplan:shared:city:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedStateViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetCityListPriorityAsync";
            try
            {
                string _jsonReturn = string.Empty;
                IFunctionReturn _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetCityListPriorityAsync(_registrationGuid);

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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("state/list")]
        public async Task<IActionResult> GetStateListAsync()
        {
            //*************************************************************
            // Required Permission: regplan:shared:state:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedStateViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetStateListAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetStateListAsync();

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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("special_category/list")]
        public async Task<IActionResult> GetSpecialCategoryListAsync()
        {

            string _methodName = "C:Registration:GetSpecialCategoryListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetSpecialCategoryListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("post/list")]
        public async Task<IActionResult> GetPostListAsync()
        {

            string _methodName = "C:Registration:GetPostListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetPostListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }
        [HttpGet]
        [AllowAnonymous]
        [Route("qualification/list")]
        public async Task<IActionResult> GetQualificationListAsync()
        {

            string _methodName = "C:Registration:GetQualificationListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetQualificationListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("title/list")]
        public async Task<IActionResult> GetTitleListAsync()
        {

            string _methodName = "C:Registration:GetTitleListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;
                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetTitleListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("id_proof/list")]
        public async Task<IActionResult> GetIdProofListAsync()
        {
            string _methodName = "C:Registration:GetIdProofListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetIdProofListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("relation/list")]
        public async Task<IActionResult> GetRelationListAsync()
        {

            string _methodName = "C:Registration:GetRelationListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetRelationListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("religion/list")]
        public async Task<IActionResult> GetReligionListAsync()
        {

            string _methodName = "C:Registration:GetReligionListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();


                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetReligionListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("course/list")]
        public async Task<IActionResult> GetCourseListAsync()
        {

            string _methodName = "C:Registration:GetCourseListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetCourseListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("nationality/list")]
        public async Task<IActionResult> GetNationalityListAsync()
        {
            string _methodName = "C:Registration:GetNationalityListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetNationalityListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("board/list")]
        public async Task<IActionResult> GetBoardListAsync()
        {

            string _methodName = "C:Registration:GetBoardListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetBoardListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("university/list")]
        public async Task<IActionResult> GetUniversityListAsync()
        {

            string _methodName = "C:Registration:GetUniversityListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetUniversityListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("stream/list")]
        public async Task<IActionResult> GetStreamListAsync()
        {

            string _methodName = "C:Registration:GetStreamListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetStreamListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("marital_status/list")]
        public async Task<IActionResult> GetMartialStatusListAsync()
        {

            string _methodName = "C:Registration:GetMartialStatusListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetMartialStatusListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("exam_medium/list")]
        public async Task<IActionResult> GetExamMediumListAsync()
        {
            string _methodName = "C:Registration:GetExamMediumListAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;

                _functionReturn = new FunctionReturn();

                (_jsonReturn, _functionReturn) = await _sharedFunctions.GetExamMediumListAsync();

                if (_functionReturn.Status == false)
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ValidateUniqueComponent")]
        public async Task<IActionResult> ValidateUniqueComponentAsync([FromBody] ValidateComponent _validateComponent)
        {
            //*************************************************************
            // Required Permission: regplan:reg:validateuniquecomponen
            string _userPermission = PermissionConstants.RegplanRegValidateUniqueComponent;
            //*************************************************************
            string _methodName = "C:Shared:ValidateUniqueComponentAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _sharedFunctions.ValidateUniqueComponentAsync(_validateComponent);
                if (!_functionReturn.Status)
                {
                    string _errorJson = _apiResponse.ErrorResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, _functionReturn.HttpStatusCode, true);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    //good return
                    var successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, _functionReturn.HttpStatusCode, true);
                    return new OkObjectResult(successJson);
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
        [Route("captcha/{_captchaId}")]
        public async Task<IActionResult> GetCaptcha(UInt64 _captchaId)
        {
            //***********************************************
            // Required Permission: centreplan:imported:centre:unmapping
            //  string _userPermission = "";//PermissionConstants.CentreplanImportedCentreUnMapping;
            //**************************************************************
            string _methodName = "C:Shared:GetCaptcha";

            try
            {
                //bool _status = false; 
                // for check Permission
                string _jsonReturn = string.Empty;
                //var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                if (_captchaId <= 0)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    //DateTime _cachecheckStart = DateTime.Now;
                    // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                    // DateTime _cachecheckEnd = DateTime.Now;
                    // _functionReturn.Status = true;
                    //if (_functionReturn.Status == false)
                    //{
                    //    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    //    return new UnauthorizedObjectResult(_errorJson);
                    //}
                    //else
                    //{
                    // TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetCaptchaAsync(_captchaId);
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
                    //}

                }
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ValidateCityComponent")]
        public async Task<IActionResult> ValidateCityComponentAsync([FromBody] ValidateComponent _validateComponent)
        {
            //*************************************************************
            // Required Permission: regplan:reg:validateuniquecomponen
            string _userPermission = PermissionConstants.RegplanRegValidateUniqueComponent;
            //*************************************************************
            string _methodName = "C:Shared:ValidateCityComponentAsync";
            try
            {
                //bool _status = false;
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User?.Identity;
                _functionReturn = new FunctionReturn();
                _functionReturn = await _sharedFunctions.ValidateCityComponentAsync(_validateComponent);
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    //good return
                    var successJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.GoodReturn, _functionReturn.MessageType, _functionReturn.Message, _functionReturn.HttpStatusCode, true);
                    return new OkObjectResult(successJson);
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
        [Route("{_regGuid}/reg_type/list")]
        public async Task<IActionResult> GetRegTypeListAsync(string _regGuid)
        {
            //*************************************************************
            // Required Permission: regplan:shared:regtype:view:dropdown
            string _userPermission = PermissionConstants.RegTypeListViewDropdown;
            //*************************************************************
            string _methodName = "C:Registration:GetRegTypeListAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetRegTypeListAsync(_regGuid);

                    if (_functionReturn.Status == false)
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
        [AllowAnonymous]
        [Route("certificate-issuing-authority/list")]
        public async Task<IActionResult> GetCertificateIssuingAuthority()
        {
            //*************************************************************
            // Required Permission: regplan:shared:certificate:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedCertificateIssuingAuthorityViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetCertificateIssuingAuthority";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetCertificateIssuingAuthorityAsync();

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
        [AllowAnonymous]
        [Route("certificate-issuing-district/list")]
        public async Task<IActionResult> GetCertificateIssuingDistrict()
        {
            //*************************************************************
            // Required Permission: regplan:shared:certificate:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedCertificateIssuingDistrictViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetCertificateIssuingDistrict";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetCertificateIssuingDistrictAsync();

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

        [HttpPost]
        [AllowAnonymous]
        [Route("images/ai/validations/list")]
        public async Task<IActionResult> AiValidations([FromBody] AiImageValidation _aiImageValidation)
        {
            //*************************************************************
            // Required Permission: regplan:shared:regtype:view:dropdown
            string _userPermission = PermissionConstants.RegTypeListViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:AiValidations";
            try
            {
                if (_aiImageValidation == null)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
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
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.AiValidationsAsync(_aiImageValidation);

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

        [HttpPost]
        [AllowAnonymous]
        [Route("analyze/photos")]
        public async Task<IActionResult> AnalyzePhotos([FromBody] AiImageValidation _aiImageValidation)
        {
            //*************************************************************
            // Required Permission: regplan:shared:regtype:view:dropdown
            string _userPermission = PermissionConstants.RegTypeListViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:AnalyzePhotos";
            try
            {
                if (_aiImageValidation == null)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
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
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.AnalyzePhotosAsync(_aiImageValidation);

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


        [HttpPost]
        [AllowAnonymous]
        [Route("images/ai/validate")]
        public async Task<IActionResult> AiValidateImage([FromBody] AiImageValidation _aiImageValidation)
        {
            
            string _methodName = "C:Shared:AiValidateImage";
            try
            {
                
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();

                //_functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);

                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.AiValidateImageAsync(_aiImageValidation);

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
        [AllowAnonymous]
        [Route("degree/list/{_qualificationtypeGuid}")]
        public async Task<IActionResult> GetDegreeListAsync(string _qualificationtypeGuid)
        {
            //*************************************************************
            // Required Permission: regplan:shared:qualificationtype:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedDegreeViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetDegreeListAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetDegreeListAsync(_qualificationtypeGuid);

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
        [AllowAnonymous]
        [Route("university/list/{_stateGuid}")]
        public async Task<IActionResult> GetUniversityListAsync(string _stateGuid)
        {
            //*************************************************************
            // Required Permission: regplan:shared:university:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedUniversityViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetUniversityListAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                //   _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetUniversityListAsync(_stateGuid);

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
        [AllowAnonymous]
        [Route("qualification-type/list")]
        public async Task<IActionResult> GetQualificationTypeListAsync()
        {
            //*************************************************************
            // Required Permission: regplan:shared:qualificationtype:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedQualificationTypeViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetQualificationTypeListAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetQualificationTypeAsync();

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
        [AllowAnonymous]
        [Route("stream/list/{_degreeGuid}")]
        public async Task<IActionResult> GetStreamListByDegreeAsync(string _degreeGuid)
        {
            //*************************************************************
            // Required Permission: regplan:shared:university:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedStreamViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetStreamListByDegreeAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                //   _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetStreamListByDegreeAsync(_degreeGuid);

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
        [AllowAnonymous]
        [Route("marks-type/list")]
        public async Task<IActionResult> GetMarksTypeListAsync()
        {
            //*************************************************************
            // Required Permission: regplan:shared:qualificationtype:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedQualificationTypeViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetMarksTypeListAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetMarksTypeListAsync();

                    if (_functionReturn.Status)
                    {
                        //good return
                        return new OkObjectResult(_jsonReturn);


                    }
                    else
                    {
                        //error
                        string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        return new UnauthorizedObjectResult(_errorJson);
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
        [Route("grade/list")]
        public async Task<IActionResult> GetGradeListAsync()
        {
            //*************************************************************
            // Required Permission: regplan:shared:qualificationtype:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedQualificationTypeViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:GetGradeListAsync";
            try
            {
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                _functionReturn.Status = true;
                if (_functionReturn.Status == false)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.GetGradeListAsync();

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
        [AllowAnonymous]
        [Route("dob/{_dob}")]
        public async Task<IActionResult> DOBDifference(DateTime? _dob)
        {
            //*************************************************************
            // Required Permission: regplan:shared:qualificationtype:view:dropdown
            string _userPermission = PermissionConstants.RegplanSharedQualificationTypeViewDropdown;
            //*************************************************************
            string _methodName = "C:Shared:DOBDiffrence";
            try
            {
                if (!_dob.HasValue)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.RequiredParametersMissing, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                string _jsonReturn = string.Empty;
                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);

                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    (_jsonReturn, _functionReturn) = await _sharedFunctions.DOBDifferenceAsync(_dob);

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