using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

namespace IXCheckCommonLib.AppValidations
{
    public static class CommonFunctions
    {
        /// <summary>
        /// Get Minimum Level
        /// </summary>
        /// <param name="minimumLevel"></param>
        /// <returns>int</returns>
        public static int GetMinimumLevel(ReadOnlySpan<char> minimumLevel)
        {
            ReadOnlySpan<char> _minimumLevel = (minimumLevel == null) ? string.Empty : minimumLevel.ToString().Trim();
            int _minLevel = 4;
            switch (_minimumLevel.ToString().ToLower())
            {
                case Constants.LogLevel.VERBOSE:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Verbose;
                    break;
                case Constants.LogLevel.TRACE:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Verbose;
                    break;
                case Constants.LogLevel.DEBUG:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Debug;
                    break;
                case Constants.LogLevel.INFORMATION:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Information;
                    break;
                case Constants.LogLevel.WARNING:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Warning;
                    break;
                case Constants.LogLevel.ERROR:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Error;
                    break;
                case Constants.LogLevel.CRITICAL:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Fatal;
                    break;
                case Constants.LogLevel.FATAL:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Fatal;
                    break;
                default:
                    _minLevel = (int)Serilog.Events.LogEventLevel.Error;
                    break;
            }
            return _minLevel;
        }

        /// <summary>
        /// Set Data Value
        /// </summary>
        /// <param name="id"></param>
        /// <param name="number"></param>
        /// <param name="status"></param>
        /// <param name="statusText"></param>
        /// <returns>ApiSuccessResponse.DataValue</returns>
        public static ApiSuccessResponse.DataValue SetDataValue(ulong id, ulong number, ReadOnlySpan<char> status, ReadOnlySpan<char> statusText)
        {
            ApiSuccessResponse.DataValue _dataValue = new ApiSuccessResponse.DataValue()
            {
                Id = Convert.ToInt32(id),
                Number = Convert.ToInt32(number),
                Status = status.ToString(),
                StatusText = statusText.ToString()
            };
            return _dataValue;
        }

        /// <summary>
        /// Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).
        /// </summary>
        /// <param name="date"></param>
        /// <returns>long</returns>
        public static long ToUnixEpochDate(DateTime date)
        => (long)Math.Round((date.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)).TotalSeconds);

        /// <summary>
        /// Get Status Text
        /// </summary>
        /// <param name="_status"></param>
        /// <returns>string</returns>
        public static string GetStatusText(string _status)
        {
            string retVal = "";
            switch (_status)
            {
                case "0":
                    retVal = "Inactive";
                    break;
                case "1":
                    retVal = "Active";
                    break;
                default:
                    retVal = "Inactive";
                    break;
            }

            return retVal;
        }

        /// <summary>
        /// Get Status CSS Tag
        /// </summary>
        /// <param name="_status"></param>
        /// <returns>string</returns>
        public static string GetStatusCSSTag(string _status)
        {
            string retVal = "";
            switch (_status)
            {
                case "0":
                    retVal = "badge-danger";
                    break;
                case "1":
                    retVal = "badge-success";
                    break;
                case "2":
                    retVal = "badge-warning";
                    break;
                case "3":
                    retVal = "badge-success";
                    break;
                default:
                    retVal = "badge-secondary";
                    break;
            }

            return retVal;
        }

        /// <summary>
        /// Get Invoice Status CSS Tag
        /// </summary>
        /// <param name="_status"></param>
        /// <returns>string</returns>
        public static string GetInvoiceStatusCSSTag(string _status)
        {
            string retVal = "";
            switch (_status)
            {
                case "0":
                    retVal = "badge-danger";
                    break;
                case "1":
                    retVal = "badge-success";
                    break;
                case "2":
                    retVal = "badge-warning";
                    break;
                case "3":
                    retVal = "badge-success";
                    break;
                default:
                    retVal = "badge-secondary";
                    break;
            }

            return retVal;
        }

        /// <summary>
        /// Get Invoice Status CSS Tag
        /// </summary>
        /// <param name="_status"></param>
        /// <returns>string</returns>
        public static string GetPaymentStatusCSSTag(string _status)
        {
            string retVal = "";
            switch (_status)
            {
                case "0":
                    retVal = "badge-danger";
                    break;
                case "1":
                    retVal = "badge-success";
                    break;
                case "2":
                    retVal = "badge-warning";
                    break;
                case "3":
                    retVal = "badge-success";
                    break;
                default:
                    retVal = "badge-secondary";
                    break;
            }

            return retVal;
        }

        /// <summary>
        /// Get Tds Status CSS Tag
        /// </summary>
        /// <param name="_status"></param>
        /// <returns>string</returns>
        public static string GetTdsStatusCSSTag(string _status)
        {
            string retVal = "";
            switch (_status)
            {
                case "0":
                    retVal = "badge-danger";
                    break;
                case "1":
                    retVal = "badge-secondary";
                    break;
                case "2":
                    retVal = "badge-success";
                    break;
                case "3":
                    retVal = "badge-success";
                    break;
                default:
                    retVal = "badge-secondary";
                    break;
            }

            return retVal;
        }

        /// <summary>
        /// Generate Random Number
        /// </summary>
        /// <returns>int</returns>
        public static int GenerateRandomNumber()
        {
            return new Random().Next(1000, 1000000000);
        }

        /// <summary>
        /// Filter Query
        /// </summary>
        /// <param name="_httpParams"></param>
        /// <returns>ReadOnlySpan<char></returns>
        public static ReadOnlySpan<char> FilterQuery(dynamic _httpParams)
        {
            StringBuilder _sqlFilter = new StringBuilder();
            if (_httpParams != null)
            {
                string _filterId = "";
                string _filterCode = "";
                string _filterName = "";
                string _filterDescription = "";
                string _filterStatus = "";

                Type _type = _httpParams.GetType();

                System.Globalization.TextInfo _textInfo = new System.Globalization.CultureInfo("en-US", false).TextInfo;

                string ID = _type.GetProperty(_textInfo.ToTitleCase(JsonReturnConstants.PropertyNames.Id))?.Name.ToLower();
                string CODE = _type.GetProperty(_textInfo.ToTitleCase(JsonReturnConstants.PropertyNames.Code))?.Name.ToLower();
                string NAME = _type.GetProperty(_textInfo.ToTitleCase(JsonReturnConstants.PropertyNames.Name))?.Name.ToLower();
                string DESC = _type.GetProperty(_textInfo.ToTitleCase(JsonReturnConstants.PropertyNames.Description))?.Name.ToLower();
                string STATUS = _type.GetProperty(_textInfo.ToTitleCase(JsonReturnConstants.PropertyNames.Status))?.Name.ToLower(); //?? "";

                //Id
                if (ID != null && !string.IsNullOrEmpty(_httpParams?.Id))
                {
                    _filterId = _httpParams.Id.Trim();
                    _filterId = Sanitization.Sanitize(_filterId);
                    _sqlFilter.Append("id = '" + _filterId + "' and ");
                }
                //Code
                if (CODE != null && !string.IsNullOrEmpty(_httpParams?.Code))
                {
                    _filterCode = _httpParams.Code.Trim();
                    _filterCode = Sanitization.Sanitize(_filterCode);
                    _sqlFilter.Append("code like '%" + _filterCode + "%' and ");
                }
                //Name
                if (NAME != null && !string.IsNullOrEmpty(_httpParams?.Name))
                {
                    _filterName = _httpParams.Name.Trim();
                    _filterName = Sanitization.Sanitize(_filterName);
                    _sqlFilter.Append("name like '%" + _filterName + "%' and ");
                }
                //Description
                if (DESC != null && !string.IsNullOrEmpty(_httpParams?.Description))
                {
                    _filterDescription = _httpParams.Description.Trim();
                    _filterDescription = Sanitization.Sanitize(_filterDescription);
                    _sqlFilter.Append("description like '%" + _filterDescription + "%' and ");
                }
                //Status
                if (STATUS != null && !string.IsNullOrEmpty(_httpParams?.Status))
                {
                    _filterStatus = _httpParams.Status.Trim();
                    _filterStatus = Sanitization.Sanitize(_filterStatus);
                    _sqlFilter.Append("status = " + _filterStatus + " and ");
                }
            }
            return _sqlFilter.ToString().AsSpan();
        }

        /// <summary>
        /// Log
        /// </summary>
        /// <param name="_logLevel"></param>
        /// <param name="_loggerFunctions"></param>
        /// <param name="_exception"></param>
        /// <param name="_methodName"></param>
        /// <returns>System.Threading.Tasks.Task<bool></returns>
        public static void Log(Enumeration.LogLevel _logLevel, ILoggerFunctions _loggerFunctions, string _exception, string _methodName)
        {
            string _randamNumber = GenerateRandomNumber().ToString();
            _randamNumber = _randamNumber.ToFixedString(10);
            _methodName = _methodName.ToFixedString(25);

            _loggerFunctions.SeriLogAsync(_logLevel, $"[{_methodName}] [{_randamNumber}]: {_exception}");
        }

        public static void Log(Enumeration.LogLevel _logLevel, ILoggerFunctions _loggerFunctions, ActivityLog _activityLog, string _exception, string _methodName)
        {
            string _randamNumber = GenerateRandomNumber().ToString();
            _randamNumber = _randamNumber.ToFixedString(10);
            _methodName = _methodName.ToFixedString(25);
            string _action = _activityLog.Action;
            string _ip = _activityLog.IP;
            string _studentGuid = _activityLog.StudentGuid;
            _loggerFunctions.SeriLogAsync(_logLevel, $"[{_methodName}] [{_randamNumber}] [{_action}] [{_ip}] [{_studentGuid}]: [{_exception}]");
        }

        /// <summary>
        /// Exception 500 Message
        /// </summary>
        /// <param name="_loggerFunctions"></param>
        /// <param name="_apiResponse"></param>
        /// <param name="_exception"></param>
        /// <param name="_methodName"></param>
        /// <returns>System.Threading.Tasks.Task<string></returns>
        public static string Exception500Message(ILoggerFunctions _loggerFunctions, IApiResponse _apiResponse, string _exception, string _methodName)
        {
            int _randamNumber = GenerateRandomNumber();
            List<string> _errorMessage = new List<string>() {
            Constants.GenericMessages.UnExpectedError,
            $"{Constants.GenericMessages.TracingNumberId} : [{_randamNumber}]",
            };
            _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{_methodName}] [{_randamNumber}]: {_exception}");
            string _errorJson = _apiResponse.ErrorResponse(Constants.ReturnMessageTypes.SystemError, Constants.ReturnMessageTypes.UnhandeledException, _errorMessage, Constants.HttpStatusCodes.InternalServerError, false);
            return _errorJson;
        }

        /// <summary>
        /// Exception 401 Message
        /// </summary>
        /// <param name="_loggerFunctions"></param>
        /// <param name="_apiResponse"></param>
        /// <param name="_functionReturn"></param>
        /// <param name="_exception"></param>
        /// <param name="_methodName"></param>
        /// <returns>System.Threading.Tasks.Task<string></returns>
        public static string Exception401Message(ILoggerFunctions _loggerFunctions, IApiResponse _apiResponse, IFunctionReturn _functionReturn, string _exception, string _methodName)
        {
            string _errorJson;
            List<string> _errorMessage = new List<string>();
            _methodName = (string.IsNullOrEmpty(_functionReturn?.MethodName)) ? _methodName : _functionReturn?.MethodName;
            if (_functionReturn?.Message != null)
            {
                _errorMessage = _functionReturn?.Message;
            }
            if (_errorMessage.Count <= 0)
            {
                _errorMessage.Add(_exception);
            }

            if (_functionReturn?.HttpStatusCode == Constants.HttpStatusCodes.InternalServerError)
            {
                _errorJson = Exception500Message(_loggerFunctions, _apiResponse, _functionReturn?.Message[0], _methodName);
            }
            else
            {
                int _randamNumber = GenerateRandomNumber();
                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{_methodName}] [{_randamNumber}]: {_exception}");
                _errorJson = (_functionReturn?.HttpStatusCode) switch
                {
                    Constants.HttpStatusCodes.NoContent => _apiResponse.ErrorResponse(Constants.ReturnMessageTypes.GoodReturn, Constants.ReturnMessageTypes.SuccessMessage, _errorMessage, Constants.HttpStatusCodes.NoContent, false),
                    _ => _apiResponse.ErrorResponse(Constants.ReturnMessageTypes.AppError, Constants.ReturnMessageTypes.AppError, _errorMessage, Constants.HttpStatusCodes.Unauthorized, false),
                };
            }
            return _errorJson;
        }

        public static IFunctionReturn SystemError(string _errorMessage, string _methodName)
        {
            IFunctionReturn _functionReturn = new FunctionReturn()
            {
                Status = false,
                MessageType = Constants.ReturnMessageTypes.SystemError,
                HttpStatusCode = Constants.HttpStatusCodes.InternalServerError,
                Message = new List<string>
                        {
                            _errorMessage
                        },
                MethodName = _methodName
            };

            return _functionReturn;
        }

        public static IFunctionReturn AppError(string _errorMessage, string _methodName)
        {
            IFunctionReturn _functionReturn = new FunctionReturn()
            {
                Status = false,
                MessageType = Constants.ReturnMessageTypes.AppError,
                HttpStatusCode = Constants.HttpStatusCodes.Unauthorized,
                Message = new List<string>
                {
                    _errorMessage
                },
                MethodName = _methodName
            };

            return _functionReturn;
        }

        public static IFunctionReturn AppSuccess(string _successMessage, string _methodName)
        {
            IFunctionReturn _functionReturn = new FunctionReturn()
            {
                Status = true,
                MessageType = Constants.ReturnMessageTypes.GoodReturn,
                HttpStatusCode = Constants.HttpStatusCodes.OK,
                Message = new List<string>
                {
                    _successMessage
                },
                MethodName = _methodName
            };

            return _functionReturn;
        }

        public static bool IsFileReady(string _path)
        {
            bool _isFileReady = false;
            int _waitTime = 0;
            bool _isFileNotCompleted = true;
            int _fileCheckCountAttempt = 0;
            //One exception per file rather than several like in the polling pattern 
            while (_isFileNotCompleted)
            {
                try
                {
                    if (File.Exists(_path))
                    {
                        // check file download is complated
                        FileStream _fileStreem;
                        _fileStreem = File.Open(_path, FileMode.Open, FileAccess.Read, FileShare.Read);
                        _fileStreem.Close();
                        _isFileNotCompleted = false;
                        _isFileReady = true;
                        break;
                    }
                    else
                    {
                        _fileCheckCountAttempt++;
                        // check file download is complated
                        if (_fileCheckCountAttempt >= 5)
                        {
                            _isFileNotCompleted = false;
                            _isFileReady = false;
                        }
                        else
                        {
                            Thread.Sleep(10);
                            _isFileNotCompleted = true;
                            _isFileReady = false;
                        }
                    }
                }
                catch (IOException)
                {
                    _isFileNotCompleted = true;
                    Thread.Sleep(100);
                    _waitTime = _waitTime + 1000;
                    if (_waitTime > 360000)
                    {
                        _isFileNotCompleted = false;
                        _isFileReady = false;
                        break;
                    }
                }
            }
            return _isFileReady;
        }

        public static void CreateFile(string _path, string _fileName, byte[] _fileData)
        {
            if (!Directory.Exists(_path))
            {
                Directory.CreateDirectory(_path);
            }
            if (!string.IsNullOrEmpty(_fileName))
            {
                string _filepath = Path.Combine(_path, _fileName);
                if (File.Exists(_filepath))
                {
                    File.Delete(_filepath);
                }
                using (Stream file = System.IO.File.OpenWrite(_filepath))
                {
                    file.Write(_fileData, 0, _fileData.Length);
                }
            }
        }


        public static DateTime FormatDate(string _Date, string _startTime, double _offsetTime)
        {
            DateTime dateValue = Convert.ToDateTime(_Date + " " + _startTime);
            return dateValue.AddMinutes(_offsetTime);
        }

        public static ApiSuccessResponse.DataValue InvoiceDataValue(ulong _invoiceId, ulong _orderId, int _approvalStatus)
        {
            //valid return -- No need to make changes in case of exisitng invoice Id for the code
            ApiSuccessResponse.DataValue _dataValue = new ApiSuccessResponse.DataValue
            {
                Id = Convert.ToInt32(_invoiceId),
                Number = Convert.ToInt32(_invoiceId)
            };
            if (_orderId < 0 && _approvalStatus > 0)
            {
                _dataValue.Status = ((int)Enumeration.InvoiceStatus.Unassigned).ToString(); //"Unassigned-Approved";
                _dataValue.StatusText = Enumeration.InvoiceStatus.Unassigned.ToString();
            }
            else if (_orderId < 0 && _approvalStatus < 0)
            {
                _dataValue.Status = ((int)Enumeration.InvoiceStatus.Unassigned).ToString(); //"Unassigned-Unapproved";
                _dataValue.StatusText = Enumeration.InvoiceStatus.Unassigned.ToString();
            }
            else if (_orderId > 0 && _approvalStatus > 0)
            {
                _dataValue.Status = ((int)Enumeration.InvoiceStatus.Approved).ToString(); //"Approved";
                _dataValue.StatusText = Enumeration.InvoiceStatus.Approved.ToString();
            }
            else if (_orderId > 0 && _approvalStatus <= 0)
            {
                _dataValue.Status = ((int)Enumeration.InvoiceStatus.Unapproved).ToString(); //"Assigned-Unapproved";
                _dataValue.StatusText = Enumeration.InvoiceStatus.Unapproved.ToString();
            }
            return _dataValue;
        }

        public static string ConvertStringToSHA256(string _inputString)
        {
            var _crypt = new System.Security.Cryptography.SHA256Managed();
            var _hash = new StringBuilder();
            byte[] crypto = _crypt.ComputeHash(Encoding.UTF8.GetBytes(_inputString));
            foreach (byte _byte in crypto)
             {
                _hash.Append(_byte.ToString("x2"));
            }
            return _hash.ToString();
        }

        public static string ConvertHtmlToPlainText(string _html)
        {
            const string _imageTagPattern = @"<img\s+src\s*=\s*[""']([^""']+)[""']\s*/*>"; 
            const string _tagWhiteSpace = @"(>|$)(\W|\n|\r)+<";//matches one or more (white space or line breaks) between '>' and '<'
            const string _stripFormatting = @"<[^>]*(>|$)";//match any character between '<' and '>', even when end tag is missing
            const string _lineBreak = @"<(br|BR)\s{0,1}\/{0,1}>";//matches: <br>,<br/>,<br />,<BR>,<BR/>,<BR />
            var _lineBreakRegex = new Regex(_lineBreak, RegexOptions.Multiline);
            var _stripFormattingRegex = new Regex(_stripFormatting, RegexOptions.Multiline);
            var _tagWhiteSpaceRegex = new Regex(_tagWhiteSpace, RegexOptions.Multiline);

            //Remove Image Tag
            var _returnText = _html;
            _returnText = Regex.Replace(_returnText, _imageTagPattern, "$1");

            //Decode html specific characters
            _returnText = System.Net.WebUtility.HtmlDecode(_returnText);

            //Remove tag whitespace/line breaks
            _returnText = _tagWhiteSpaceRegex.Replace(_returnText, "><");
            //Replace <br /> with line breaks
            _returnText = _lineBreakRegex.Replace(_returnText, Environment.NewLine);
            //Strip formatting
            _returnText = _stripFormattingRegex.Replace(_returnText, string.Empty);

            return _returnText;
        }

        public static string getUniqueHashId (string _applicationGuId, string _userGuId, string _tokenType)
        {
            return _applicationGuId + "~" + _userGuId + "~" + _tokenType;
        }
    }
}
