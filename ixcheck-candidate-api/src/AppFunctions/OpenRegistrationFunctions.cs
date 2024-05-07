using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCommonLib.Security;
using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Globals;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using IXCheckCandidateApi.AppValidations;
using IXCheckCandidateApi.Models;

namespace IXCheckCandidateApi.AppFunctions
{
    public class OpenRegistrationFunctions : IOpenRegistrationFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly IDatabaseFunctions _databaseFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiSettings _apiSettings;
        private readonly IStats _stats;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFunctions _httpClientFunctions;
        private readonly ISharedFunctions _sharedFunctions;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__databaseSettings"></param>
        /// <param name="__jwtIssuerOptions"></param>
        public OpenRegistrationFunctions(IDatabaseSettings __databaseSettings, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration, IHttpClientFunctions __httpClientFunctions, ISharedFunctions __sharedFunctions)
        {
            _sharedFunctions = __sharedFunctions;
            _databaseSettings = __databaseSettings;
            _loggerFunctions = __loggerFunctions;
            _apiSettings = __apiSettings;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _configuration = __configuration;
            _httpClientFunctions = __httpClientFunctions;
        }

        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetExamListAsync()
        {
            return Task.Run(() => GetExamList());
        }

        private (string jsonReturn, IFunctionReturn functionReturn) GetExamList()
        {
            string _jsonReturn = string.Empty;
            string _errorMessage = string.Empty;
            string _methodName = "F:Exam:GetHttpExamList";
            IFunctionReturn _functionReturn = new FunctionReturn();
            string _jsonRequest = string.Empty;
            StringBuilder _sqlQuery = null;
            _functionReturn = new FunctionReturn();
            try
            {
                //GET DATA
                _sqlQuery = new StringBuilder();
                _sqlQuery.Append(" select exam_guid, name  ");
                _sqlQuery.Append(" from exams_setup_main ");
                _sqlQuery.Append(" WHERE ");
                _sqlQuery.Append(" status = 1;");

                //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                        {
                        { ApplicationDatabaseConstants.ColumnNames.ExamGuid, (ApplicationJsonReturnConstants.PropertyNames.ExamGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String)},
                        };

                //Call Function
                (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Exams, _dictionary, _stats.CacheCheckTime);
            }
            catch (Exception ex)
            {
                //ERROR
                _jsonReturn = string.Empty;
                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Get Layout Json Async
        /// </summary>
        /// <param name="_layoutType"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> LayoutJsonByIdAsync(string _layoutType)
        {
            return Task.Run(() => LayoutJsonById(_layoutType));
        }

        /// <summary>
        /// Get Layout Json
        /// </summary>
        /// <param name="_layoutType"></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) LayoutJsonById(string _layoutType)
        {
            #region Local Variables
            string _methodName = "F:Registration:GetLayoutListByExamId";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _errorMessage = "";
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (string.IsNullOrEmpty(_layoutType))
                _errorMessage = ApplicationConstants.ValidationMessages.LayoutTypeCodeRequired;

            if (!string.IsNullOrEmpty(_errorMessage))
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            else
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _sqlQuery.Clear();
                    if (_layoutType == "registrationlayout")
                    {
                        _sqlQuery.Append("SELECT LM.layout_json,LT.code layout_type_code,RTL.registration_guid layout_registration_guid ");
                        _sqlQuery.Append("FROM layout_main LM ");
                        _sqlQuery.Append(" JOIN registration_to_layout RTL ON LM.id = RTL.layout_id ");
                        _sqlQuery.Append(" JOIN layout_types LT ON LT.layout_type_guid = LM.layout_type_guid ;");
                    }
                    else
                    {
                        _sqlQuery.Append("SELECT LM.layout_json,LT.code layout_type_code,RTL.registration_guid layout_registration_guid ");
                        _sqlQuery.Append("FROM layout_main LM ");
                        _sqlQuery.Append("JOIN registration_to_layout RTL ON LM.id = RTL.initial_layout_id ");
                        _sqlQuery.Append("JOIN layout_types LT ON LT.layout_type_guid = LM.layout_type_guid;");
                    }
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.LayoutJson, (ApplicationJsonReturnConstants.PropertyNames.LayoutJson, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.LayoutTypeCode, (ApplicationJsonReturnConstants.PropertyNames.LayoutTypeCode, DatabaseConstants.DataTypes.String)},
                        { ApplicationDatabaseConstants.ColumnNames.LayoutRegistrationGuid, (ApplicationJsonReturnConstants.PropertyNames.LayoutRegistrationGuid, DatabaseConstants.DataTypes.String)}
                    };

                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Layout, _dictionary, _stats.CacheCheckTime);
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// AuthenticateUser
        /// </summary>
        /// <param name="_username"></param>
        /// <param name="_password"></param>
        /// <returns></returns>
        private (ICoreUserInfo coreUserInfo, IFunctionReturn functionReturn) AuthenticateUser(string _username, string _password, string _examGuid,string _appGuid)
        {
            #region Local Variables
            string _methodName = "F:OpenRegistration:AuthenticateUser";
            IFunctionReturn _functionReturn = new FunctionReturn();
            ICoreUserInfo _coreUserInfo = new CoreUserInfo();
            DataTable _dataTable = null;
            DataTable _dataTablePermissions = null;
            StringBuilder _sqlQuery = null;
            string _sqlConnectionString = string.Empty;
            #endregion
            #region Sanitization and General Validation
            //Validate input
            string _errorMessage = "";

            try
            {
                //Sanitize Input 
                _username = Sanitization.Sanitize(_username);
                _password = Sanitization.Sanitize(_password);
                _examGuid = Sanitization.Sanitize(_examGuid);
                if (string.IsNullOrEmpty(_username) && string.IsNullOrEmpty(_password))
                {
                    _errorMessage = Constants.UserMessages.UsernamePasswordBothRequired;
                }
                else if (string.IsNullOrEmpty(_username))
                {
                    _errorMessage = Constants.UserMessages.UsernameRequired;
                }
                else if (string.IsNullOrEmpty(_password))
                {
                    _errorMessage = Constants.UserMessages.UserPasswordRequired;
                }
                else if (string.IsNullOrEmpty(_examGuid))
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.ExamGuidRequired;
                }
            }
            catch (Exception ex)
            {
                //ERROR - 
                _errorMessage = ex.Message;
            }
            #endregion
            string _passwordHashFromDB;
            try
            {
                //Valid User
                if (string.IsNullOrEmpty(_errorMessage))
                {
                    //user basic details fetch
                    _sqlQuery = new StringBuilder();
                    _sqlQuery.Append(" SELECT candidate_guid user_id,qry.candidate_guid,username,password_hash FROM ");
                    _sqlQuery.Append(" ( SELECT DSML.candidate_guid,  ");
                    _sqlQuery.Append(" MAX(if(CM.name='NgxIxcheckUsername',DSML.datavalue,null)) AS username, ");
                    _sqlQuery.Append(" MAX(if(CM.name='NgxIxcheckPassword',DSML.datavalue,null)) AS password_hash ");
                    _sqlQuery.Append(" FROM components_main CM  ");
                    _sqlQuery.Append(" INNER JOIN data_save_main_live DSML on CM.id = DSML.comp_id ");
                    _sqlQuery.Append(" INNER JOIN registration_main_live RML ON RML.candidate_guid=DSML.candidate_guid ");
                    _sqlQuery.Append(" WHERE CM.status=1 AND DSML.status=1 AND CM.name in ('NgxIxcheckUsername','ngxixcheckpassword') ");
                    _sqlQuery.Append(" GROUP BY DSML.candidate_guid ");
                    _sqlQuery.Append(" )qry WHERE qry.username ='" + _username + "'; ");
                 //   _sqlQuery.Append(" AND qry.candidate_guid in ( SELECT candidate_guid FROM registration_main_live ");
                 //   _sqlQuery.Append(" WHERE registration_guid ='" + _examGuid + "' );");
                    //user permissions
                    _sqlQuery.Append(" SELECT DISTINCT pg.id, pg.group_name NAME, pg.perm_seq as perm_seq");
                    _sqlQuery.Append(" FROM permission_groups pg WHERE pg.status=1 AND pg.fixed_permission = 1 ");
                    _sqlQuery.Append(" ORDER BY perm_seq;");

                    //Call Function
                    (IFunctionReturn functionReturn, DataSet dataSet, TimeSpan? sqlconnTime, TimeSpan? queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), ApplicationConstants.MethodNames.GenerateToken);
                    _functionReturn = functionReturn;

                    int _tableCount = dataSet?.Tables?.Count ?? 0;
                    if (_tableCount <= 0)
                    {
                        _errorMessage = Constants.UserMessages.UserNotFound;
                    }
                    else
                    {
                        if (dataSet.Tables[0].Rows == null || dataSet.Tables[0].Rows.Count <= 0)
                        {
                            _errorMessage = Constants.UserMessages.UserNotFound;
                        }
                        _dataTable = dataSet.Tables[0];
                        if (_tableCount > 1)
                        {
                            _dataTablePermissions = dataSet.Tables[1];
                        }
                    }
                    int _rowCount = _dataTable?.Rows?.Count ?? 0;
                    for (int i = 0; i < _rowCount; i++)
                    {
                        DataRow _dataRow = _dataTable.Rows[i];
                        if (_dataRow[ApplicationDatabaseConstants.ColumnNames.PasswordHash] != DBNull.Value)
                        {
                            _passwordHashFromDB = _dataRow[ApplicationDatabaseConstants.ColumnNames.PasswordHash].ToString();

                            //Verify Hashed Password
                            var result = SecurityHash.VerifyHashedPassword(_passwordHashFromDB, _password);
                            if (!result)
                            {
                                //Password Hash Dont Match..not a valid password
                                _errorMessage = Constants.UserMessages.UserPasswordHashFail;
                            }
                            else
                            {
                                // _coreUserInfo.ExamId = _dataRow[ApplicationDatabaseConstants.ColumnNames.ExamId].ToString();
                                // _coreUserInfo.CustomerID = _dataRow[ApplicationDatabaseConstants.ColumnNames.ExamId].ToString();
                                _coreUserInfo.UserGuId = _dataRow[ApplicationDatabaseConstants.ColumnNames.UserId].ToString();
                                _coreUserInfo.UserID = _dataRow[ApplicationDatabaseConstants.ColumnNames.UserId].ToString();
                                //  _coreUserInfo.UserType = _dataRow[ApplicationDatabaseConstants.ColumnNames.UserType].ToString();
                                //  _coreUserInfo.UserTypeId = _dataRow[ApplicationDatabaseConstants.ColumnNames.UserTypeId].ToString();
                                _coreUserInfo.UserName = _username;
                                //  _coreUserInfo.UserType = _dataRow[ApplicationDatabaseConstants.ColumnNames.UserTypeDesc].ToString();
                                _coreUserInfo.UserUniqueId = _dataRow[ApplicationDatabaseConstants.ColumnNames.CandidateGuid].ToString();
                            }
                        }
                    }
                }
                // User Permissions
                if (string.IsNullOrEmpty(_errorMessage))
                {
                    int _rowCountPermissions = _dataTablePermissions?.Rows?.Count ?? 0;
                    if (_rowCountPermissions == 0)
                    {
                        _errorMessage = Constants.PermissionsMessages.PermissionMissing;
                    }
                    else
                    {
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.GoodReturn;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(Constants.UserMessages.UserAuthorized);
                        _coreUserInfo.UserPermissions = new List<IXCheckCommonLib.Models.Interfaces.IUserPermission>();
                        for (int j = 0; j < _rowCountPermissions; j++)
                        {
                            DataRow _dataRow = _dataTablePermissions.Rows[j];
                            if (_dataRow[ApplicationDatabaseConstants.ColumnNames.Name] != DBNull.Value)
                            {
                                IUserPermission _userPermission = new IXCheckCommonLib.Models.UserPermission()
                                {
                                    Name = _dataRow[ApplicationDatabaseConstants.ColumnNames.Name].ToString().Trim(),
                                    Action = "1"
                                };
                                _coreUserInfo.UserPermissions.Add(_userPermission);
                            }
                        }
                        var _result = _sharedFunctions.LogCandidateActivityAsync(_coreUserInfo.UserGuId, ApplicationConstants.PaymentActivityTypes.Login, ApplicationConstants.GenericMessages.CandidateLogin);
                    }
                }
                //App Error
                if (!string.IsNullOrEmpty(_errorMessage))
                {
                    _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                    _functionReturn.Status = false;
                }
                else
                    _functionReturn.Status = true;
            }
            catch (Exception ex)
            {
                //ERROR
                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
            }
            finally
            {
                _passwordHashFromDB = string.Empty;
                _dataTable = null;
                _dataTablePermissions = null;
                _sqlQuery = null;
            }
            return (_coreUserInfo, _functionReturn);
        }

        /// <summary>
        /// Authenticate User Async 
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>(CoreUserInfo coreUserInfo, FunctionReturn functionReturn)</returns>
        public Task<(ICoreUserInfo coreUserInfo, IFunctionReturn functionReturn)> AuthenticateUserAsync(string _username, string _password, string _examGuid,string _appGuid)
        {
            return Task.Run(() => AuthenticateUser(_username, _password, _examGuid, _appGuid));
        }


        /// <summary>
        /// Captcha Validation
        /// </summary>
        /// <param name="_captchaValidation"></param>
        /// <returns></returns>
        private IFunctionReturn CaptchaValidation(CaptchaValidation _captchaValidation)
        {
            #region Local Variables
            string _methodName = "F:OpenRegistration:CaptchaValidation";
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            string _sqlConnectionString = string.Empty;
            string _captchaId = "";
            string _captchaCode = "";
            Int64 _isExist = 0;
            #endregion
            #region Sanitization and General Validation
            //Validate input
            string _errorMessage = "";

            try
            {
                //Sanitize Input 
                _captchaId = Sanitization.Sanitize(_captchaValidation.CaptchaId);
                _captchaCode = Sanitization.Sanitize(_captchaValidation.CaptchaCode);

                if (string.IsNullOrEmpty(_captchaValidation.CaptchaCode))
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.CaptchaCodeRequired;
                }
                else if (string.IsNullOrEmpty(_captchaValidation.CaptchaId))
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.CaptchaIdRequired;
                }

            }
            catch (Exception ex)
            {
                //ERROR - 
                _errorMessage = ex.Message;
            }
            #endregion
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                _functionReturn.Status = false;
            }
            else
            {
                try
                {

                    _sqlConnectionString = _databaseSettings.MySqlConnection;
                    using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                    {
                        try
                        {
                            _mySqlCommand = new MySqlCommand();
                            // Open connection;
                            _sqlconnStart = DateTime.Now;
                            _mySqlConnection.Open();
                            _mySqlCommand.Connection = _mySqlConnection;
                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                            _sqlQuery = new StringBuilder();

                            //Check captcha Id exist
                            _sqlQuery.Clear();
                            _sqlQuery.Append(" SELECT COUNT(1) FROM captcha_validation");
                            _sqlQuery.Append(" where captcha_id='" + _captchaId + "' AND captcha_code='" + _captchaCode + "';");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _isExist = Convert.ToInt64(_mySqlCommand.ExecuteScalar());
                            if (_isExist > 0)
                            {
                                //Success
                                _functionReturn = new FunctionReturn();
                                _functionReturn.Status = true;
                                _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                                _functionReturn.Message.Add(ApplicationConstants.GenericMessages.CaptchaValidateSuccessfully);
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                            }
                            else
                            {

                                if (_functionReturn == null)
                                    _functionReturn = new FunctionReturn();
                                //No Data // Need to send blank JSON object instead of error
                                _functionReturn.Status = false;
                                _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                                _functionReturn.Message.Add(ApplicationConstants.GenericMessages.InvalidCaptchaCode);
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                            }
                            //Cleanup
                            _mySqlCommand.Dispose();

                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _functionReturn = new FunctionReturn();
                                _functionReturn.Status = false;
                                _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                                _functionReturn.Message.Add(ex.Message);
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = new FunctionReturn();
                                _functionReturn.Status = false;
                                _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                                _functionReturn.Message.Add(exTran.Message);
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {exTran.Message}", _methodName);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    //ERROR

                    _functionReturn.Status = false;
                    _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    _functionReturn.Message.Add(ex.Message);
                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }

            return _functionReturn;
        }
        /// <summary>
        /// Captcha Validation Async
        /// </summary>
        /// <param name="_captchaValidation"></param>
        /// <returns></returns>
        public Task<IFunctionReturn> CaptchaValidationAsync(CaptchaValidation _captchaValidation)
        {
            return Task.Run(() => CaptchaValidation(_captchaValidation));
        }
    }
}