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
using IxcheckRegApi.Models;
using System.IdentityModel.Tokens.Jwt;
using IXCheckCandidateApi.Models.Interfaces;
using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Models;
using IXCheckCandidateApi.AppValidations;

namespace IXCheckCandidateApi.Controllers
{
    [Route("api/" + Constants.Api.Version + "/[controller]")]
    [ApiController]
    public class PaymentGatewaysController : ControllerBase
    {
        private readonly IPaymentGatewayFunctions _paymentGatewayFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiResponse _apiResponse;
        private readonly ICacheFunctions _cacheFunctions;
        private IFunctionReturn _functionReturn;
        private readonly IStats _stats;
        private readonly IPaymentSettings _paymentSettings;

        public PaymentGatewaysController(IPaymentGatewayFunctions __paymentGatewayFunctions, IApiResponse __apiResponse,
                                    ICacheFunctions __cacheFunctions, ILoggerFunctions __loggerFunctions, IStats __stats, IPaymentSettings __paymentSettings)
        {
            _apiResponse = __apiResponse;
            _cacheFunctions = __cacheFunctions;
            _paymentGatewayFunctions = __paymentGatewayFunctions;
            _loggerFunctions = __loggerFunctions;
            _stats = __stats;
            _paymentSettings = __paymentSettings;
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("payments/{_candidateGuid}/info")]
        public async Task<IActionResult> GetPaymentsInfo([FromBody] Payments _payments, string _candidateGuid)
        {
            //*************************************************************
            // Required Permission: admin:ExamShift:AdminExamListDropdownView
            // string _userPermission = PermissionConstants.AdminExamListDropdownView;
            //*************************************************************
            string _methodName = "C:PaymentGateways:GetPaymentsInfo";
            try
            {
                if (_payments == null || _payments?.CandidateGuid == null || _payments?.CandidateGuid != _candidateGuid)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                //bool _status = false;
                string _jsonReturn = string.Empty;
                string _token = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _paymentGatewayFunctions.GetPaymentInfoListListAsync(_payments);
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

        [AllowAnonymous]
        [HttpGet]
        [Route("payments/{_registrationsGuid}/{_candidateGuid}/status")]
        public async Task<IActionResult> GetPaymentStatus(string _registrationsGuid, string _candidateGuid)
        {
            //*************************************************************
            // Required Permission: admin:ExamShift:AdminExamListDropdownView
            string _userPermission = PermissionConstants.RegplanPaymentStatus;
            //*************************************************************
            string _methodName = "C:PaymentGateways:GetPaymentStatus";

            try
            {
                if (string.IsNullOrEmpty(_registrationsGuid) || string.IsNullOrEmpty(_candidateGuid))
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                //bool _status = false;
                string _jsonReturn = string.Empty;
                string _token = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                if (!_functionReturn.Status)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                else
                {
                    TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);
                    (_jsonReturn, _functionReturn) = await _paymentGatewayFunctions.GetPaymentStatusAsync(_cachecheckTime, _candidateGuid, _registrationsGuid);
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

        [AllowAnonymous]
        [HttpPost]
        [Route("{_registrationGuid}/add/{_candidateGuid}")]
        public async Task<IActionResult> PaymentsGatewayAdd(string _registrationGuid, string _candidateGuid)
        {
            //*************************************************************
            // Required Permission: admin:ExamShift:AdminExamListDropdownView
            // string _userPermission = PermissionConstants.AdminExamListDropdownView;
            //*************************************************************
            string _methodName = "C:PaymentGateways:PaymentsGatewayAdd";
            try
            {
                if (string.IsNullOrEmpty(_registrationGuid) || string.IsNullOrWhiteSpace(_candidateGuid))
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.RequiredParametersMissing, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                string _jsonReturn = string.Empty;
                string _token = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _paymentGatewayFunctions.AddPaymentAsync(_registrationGuid, _candidateGuid);
                _functionReturn.Status = true;
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
        [Route("payment/response/{_candidateGuid}")]
        public async Task<IActionResult> GetPaymentResponseList(string _candidateGuid)
        {
            string _methodName = "PaymentGatewaysController:GetPaymentResponseList";
            //*************************************************************
            // Required Permission: admin:ExamShift:AdminExamListDropdownView
            // string _userPermission = PermissionConstants.AdminExamListDropdownView;
            //*************************************************************           
            try
            {
                if (string.IsNullOrEmpty(_candidateGuid))
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                string _jsonReturn = string.Empty;
                string _token = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;

                TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);
                (_jsonReturn, _functionReturn) = await _paymentGatewayFunctions.GetPaymentResponseListAsync(_cachecheckTime, _candidateGuid);

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

        [HttpGet]
        [AllowAnonymous]
        [Route("payments/response/{_id:int}")]
        public async Task<IActionResult> GetPaymentResponseById(int _id)
        {
            string _methodName = "PaymentGatewaysController:GetPaymentResponseById";
            //*************************************************************
            // Required Permission: admin:ExamShift:AdminExamListDropdownView
            // string _userPermission = PermissionConstants.AdminExamListDropdownView;
            //*************************************************************           
            try
            {
                if (_id <= 0)
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.InvalidObject, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                //bool _status = false;
                string _jsonReturn = string.Empty;
                string _token = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                DateTime _cachecheckStart = DateTime.Now;
                // _functionReturn = await _cacheFunctions.CheckRoleAndPermissionInCacheAsync(_userPermission, _userIdentity);
                DateTime _cachecheckEnd = DateTime.Now;
                _functionReturn.Status = true;
                //if (_functionReturn.Status == false)
                //{
                //    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.PermissionDenied, _methodName);
                //    return new UnauthorizedObjectResult(_errorJson);
                //}
                //else
                //{
                TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);
                (_jsonReturn, _functionReturn) = await _paymentGatewayFunctions.GetPaymentResponseIdAsync(_cachecheckTime, _id);
                _functionReturn.Status = true;
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
                //}
            }
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("payments/response")]
        public ActionResult PaymentConfirmation()
        {
            string actualOrderId = string.Empty;
            string _methodName = "PayemntGateways:PaymentConfirmation";
            string _jsonReturn = "";
            string _orderId = "";
            string _resCurrency = "";
            decimal _tranAmount = 0;
            string _responseStatus = "";
            string _responseCode = "";
            string _resMessage = "";
            string _resBankTranId = "";
            string _resGateway = "";
            string _resBankName = "";
            string _resPaymentMode = "";
            string _resPaytmResTranId = "";
            string _resTranDate = "";
            string _mid = "";
            string _checksumHash = "";
            string _appCallbackUrl = "";
            try
            {
                //_appCallbackUrl = "http://localhost:4300/#/registration/payments/paytm/response";// _paymentSettings.AppUrl;
                CommonFunctions.Log(Enumeration.LogLevel.Information, _loggerFunctions, "AppURL " + _appCallbackUrl, _methodName);
                Dictionary<string, string> parameters = new Dictionary<string, string>();
                // string paytmChecksum = "";
                if (Request?.Form?.Keys != null)
                {
                    foreach (string key in Request.Form.Keys)
                    {
                        parameters.Add(key.Trim(), Request.Form[key]);
                    }
                    if (parameters.Count > 0)
                    {
                        DateTime _cachecheckStart = DateTime.Now;
                        DateTime _cachecheckEnd = DateTime.Now;
                        TimeSpan _cachecheckTime = (_cachecheckEnd - _cachecheckStart);
                        string _paymentCode;
                        _paymentCode = _paymentGatewayFunctions.GetActivePaymentGatewayAsync().Result;

                        if (!string.IsNullOrEmpty(_paymentCode) && _paymentCode.ToUpper() == "PAYTM")
                        {
                            _orderId = parameters["ORDERID"];
                            _tranAmount = Convert.ToDecimal(parameters["TXNAMOUNT"]);
                            _mid = parameters["MID"];
                            _resCurrency = parameters["CURRENCY"];
                            _responseStatus = parameters["STATUS"];
                            _responseCode = parameters["RESPCODE"];
                            _resMessage = parameters["RESPMSG"];
                            _resBankTranId = parameters["BANKTXNID"];
                            _resGateway = parameters.ContainsKey("GATEWAYNAME") ? parameters["GATEWAYNAME"] : "";
                            _resBankName = parameters.ContainsKey("BANKNAME") ? parameters["BANKNAME"] : "";
                            _resPaymentMode = parameters.ContainsKey("PAYMENTMODE") ? parameters["PAYMENTMODE"] : "";
                            _resPaytmResTranId = parameters.ContainsKey("TXNID") ? parameters["TXNID"] : "";
                            _resTranDate = parameters.ContainsKey("TXNDATE") ? parameters["TXNDATE"] : "";
                            _checksumHash = parameters.ContainsKey("CHECKSUMHASH") ? parameters["CHECKSUMHASH"] : "";

                            PaytmResponseDetail _paytmResponse = new PaytmResponseDetail();
                            _paytmResponse.OrderId = _orderId;
                            _paytmResponse.TxnAmount = Convert.ToString(_tranAmount);
                            _paytmResponse.Currency = _resCurrency;
                            _paytmResponse.TxnStatus = _responseStatus;
                            _paytmResponse.ResponseCode = _responseCode;
                            _paytmResponse.ResponseMsg = _resMessage;
                            _paytmResponse.BankTxnId = _resBankTranId;
                            _paytmResponse.GatewayName = _resGateway;
                            _paytmResponse.BankName = _resBankName;
                            _paytmResponse.PaymentMode = _resPaymentMode;
                            _paytmResponse.TxnId = _resPaytmResTranId;
                            _paytmResponse.TxnDate = _resTranDate;
                            _paytmResponse.Mid = _mid;
                            _paytmResponse.CheckSumHash = _checksumHash;
                            (_jsonReturn, _functionReturn) = _paymentGatewayFunctions.AddPAYTMPaymentResponseAsync(_paytmResponse).Result;
                        }

                        else if (!string.IsNullOrEmpty(_paymentCode) && _paymentCode.ToUpper() == "PAYUMONEY")
                        {
                            PayUMoneyResponseDetail _payu = new PayUMoneyResponseDetail
                            {
                                FirstName = Request.Form["firstname"],
                                TxnAmount = Request.Form["amount"],
                                CheckSumHash = Request.Form["hash"],
                                ProductInfo = Request.Form["productinfo"],
                                Mobile = Request.Form["mobile"],
                                OrderId = Request.Form["txnid"],
                                PayUMoneyId = Request.Form["payuMoneyId"],
                                PaymentMode = Request.Form["mode"],
                                TxnStatus = Request.Form["status"],
                                Email = Request.Form["email"]
                            };
                            _orderId = _payu.OrderId;
                            (_jsonReturn, _functionReturn) = _paymentGatewayFunctions.AddPAYUMONEYPaymentResponseAsync(_payu).Result;
                        }

                        else if (!string.IsNullOrEmpty(_paymentCode) && _paymentCode.ToUpper() == "RAZORPAY")
                        {
                            _orderId = parameters["razorpay_order_id"];
                            _resMessage = parameters["razorpay_payment_id"];  
                            _responseCode = parameters["razorpay_signature"];
                            

                            RazorPayResponseDetail _paytmResponse = new RazorPayResponseDetail();
                            _paytmResponse.RazorPayOrderId = _orderId;
                            _paytmResponse.RazorPayPaymentId = _resMessage;
                            _paytmResponse.RazorPaySignature = _responseCode;
                            
                            (_jsonReturn, _functionReturn) = _paymentGatewayFunctions.AddRazorPayPaymentResponseAsync(_paytmResponse).Result;
                        }

                        if (!_functionReturn.Status)
                        {
                            string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.ErrorInFetchingRecord, _methodName);
                            // return new UnauthorizedObjectResult(_errorJson);
                        }
                        else
                        {
                            //good return
                            string _sucessResponseJson = _apiResponse.SuccessResponse(Constants.ReturnMessageTypes.SuccessMessage, Constants.ReturnMessageTypes.SuccessMessage, _functionReturn.Message, Constants.HttpStatusCodes.OK, true);
                            //return new OkObjectResult(_sucessResponseJson);
                        }
                    }
                    else
                    {
                        CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, "no response params returned ", _methodName);
                    }
                }
                else
                {
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, "no response params returned ", _methodName);
                }
            }
            catch (Exception ex)
            {
                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, ex.Message, _methodName);
            }
            //good return
            _appCallbackUrl = _paymentSettings.AppUrl + "/orders";
            return Redirect(_appCallbackUrl);
            //return new OkObjectResult(_jsonReturn);
        }



        [AllowAnonymous]
        [HttpPost]
        [Route("offline/{_candidateGuid}")]
        public async Task<IActionResult> PaymentsGatewayOfflineAdd([FromBody] OfflinePayments _payments, string _candidateGuid)
        {
            //*************************************************************
            // Required Permission: admin:ExamShift:AdminExamListDropdownView
            // string _userPermission = PermissionConstants.AdminExamListDropdownView;
            //*************************************************************
            string _methodName = "C:PaymentGateways:PaymentsGatewayOfflineAdd";
            try
            {
                if (string.IsNullOrWhiteSpace(_candidateGuid))
                {
                    string _errorJson = CommonFunctions.Exception401Message(_loggerFunctions, _apiResponse, _functionReturn, Constants.GenericMessages.RequiredParametersMissing, _methodName);
                    return new UnauthorizedObjectResult(_errorJson);
                }
                string _jsonReturn = string.Empty;
                string _token = string.Empty;

                var _userIdentity = (ClaimsIdentity)User.Identity;
                _functionReturn = new FunctionReturn();
                (_jsonReturn, _functionReturn) = await _paymentGatewayFunctions.AddOfflinePaymentsGatewayAsync(_payments, _candidateGuid);
                _functionReturn.Status = true;
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
            catch (Exception ex)
            {
                string _errorJson = CommonFunctions.Exception500Message(_loggerFunctions, _apiResponse, ex.Message, _methodName);
                return StatusCode(StatusCodes.Status500InternalServerError, _errorJson);
            }
        }
    }
}