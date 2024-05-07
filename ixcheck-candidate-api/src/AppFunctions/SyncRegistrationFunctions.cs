using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Globals;
using IXCheckCandidateApi.Models;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions
{
    public class SyncRegistrationFunctions : ISyncRegistrationFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly IDatabaseFunctions _databaseFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiSettings _apiSettings;
        private readonly IStats _stats;
        private readonly IConfiguration _configuration;


        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__databaseSettings"></param>
        /// <param name="__jwtIssuerOptions"></param>
        public SyncRegistrationFunctions(IDatabaseSettings __databaseSettings, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration)
        {

            _databaseSettings = __databaseSettings;
            _loggerFunctions = __loggerFunctions;
            _apiSettings = __apiSettings;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _configuration = __configuration;


        }


        /// <summary>
        /// Sync Registration  Async
        /// </summary>
        /// <param name="_syncRegistration"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> CreateRegistrationDataAsync(SyncRegistration _syncRegistration)
        {
            return Task.Run(() => CreateRegistrationData(_syncRegistration));
        }

        /// <summary>
        /// Create Registration Data
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) CreateRegistrationData(SyncRegistration _syncRegistration)
        {
            #region Local Variables
            string _methodName = "F:Sync:SyncRegistrationData";
            MySqlConnection _mySqlConnection = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            string _sqlConnectionString = string.Empty;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime;
            DataTable _dataTable;
            DataTable _dataTable_data;
            DataTable _dataTable_response;
            DataTable _dataTable_activity_log; ;
            DataTable _dataTableAiLogMain; ;
            DataSet _dataSetAiLogColorFaces; ;
            DataTable _dataTableGridValues;
            string _sync_server_guid = string.Empty;
            string _sync_date = string.Empty;
            string _first_sync = string.Empty;
            string _candidate_guid = string.Empty;
            string _candidate_code = string.Empty;
            string _registration_guid = string.Empty;
            string _email_verified = string.Empty;
            string _payment_status = string.Empty;
            string _payment_date = string.Empty;
            string _registration_date = string.Empty;
            string _modify_date = string.Empty;
            string _registration_status_guid = string.Empty;
            string _status = string.Empty;
            string _form_id = string.Empty;
            string _page_id = string.Empty;
            string _section_id = string.Empty;
            string _comp_id = string.Empty;
            string _datavalue = string.Empty;
            string _imageValue = string.Empty;
            string _showingrid = string.Empty;
            string _order_id = string.Empty;
            string _email = string.Empty;
            string _name = string.Empty;
            string _mobile_number = string.Empty;
            string _fee_amount = string.Empty;
            string _request_datetime = string.Empty;
            string _pay_detail = string.Empty;
            string _payment_gateway_id = string.Empty;
            string _check_sum_hash = string.Empty;
            string _txn_status = string.Empty;
            string _activity_type_id = string.Empty;
            string _log_description = string.Empty;
            string _timestamp = string.Empty;
            string _mid = string.Empty;
            string _txn_id = string.Empty;
            string _txn_amount = string.Empty;
            string _payment_mode = string.Empty;
            string _currency = string.Empty;
            string _txn_date = string.Empty;
            string _response_code = string.Empty;
            string _response_msg = string.Empty;
            string _gateway_name = string.Empty;
            string _bank_txn_id = string.Empty;
            string _bank_name = string.Empty;
            string _file_path = string.Empty;
            string _record_count = string.Empty;
            string _file_name = string.Empty;
            int _filesize;
            bool _success = true;
            string _last_record_date_time = string.Empty;
            string _sync_date_time = string.Empty;
            RegistrationMainLives _registrationMainLives = new RegistrationMainLives();
            List<RegAiLogsMain> _regAiLogsMains = new List<RegAiLogsMain>(); ;

            //JSON data
            string _jsonReturn = string.Empty;
            #endregion
            #region  Validation and Sanitization
            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_syncRegistration == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.SyncDataRequired; ;
                }
                else
                {
                    // Sanitize Input
                    _sync_server_guid = Sanitization.Sanitize(_syncRegistration.SyncServerGuid);
                    _sync_date = Sanitization.Sanitize(_syncRegistration.SyncDate);
                    _first_sync = Sanitization.Sanitize(_syncRegistration.FirstSync);
                    _record_count = Sanitization.Sanitize(_syncRegistration.RecordCount);
                    _file_name = Sanitization.Sanitize(_syncRegistration.FileName);

                    if (string.IsNullOrEmpty(_sync_server_guid))
                        _errorMessage = ApplicationConstants.ValidationMessages.SyncServerGuidRequired;
                    if (string.IsNullOrEmpty(_sync_date))
                        _errorMessage = ApplicationConstants.ValidationMessages.SyncDateRequired;
                    if (string.IsNullOrEmpty(_first_sync))
                        _errorMessage = ApplicationConstants.ValidationMessages.FirstSyncRequired;
                    if (string.IsNullOrEmpty(_record_count))
                        _errorMessage = ApplicationConstants.ValidationMessages.RecordCountRequired;
                    if (string.IsNullOrEmpty(_file_name))
                        _errorMessage = ApplicationConstants.ValidationMessages.FileNameRequired;
                }
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }

            #endregion
            if (!string.IsNullOrEmpty(_errorMessage))
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);

            else
            {
                try
                {
                    _file_path = _configuration["ApiSettings:FilePath"];
                    //build mysql connection string
                    _sqlConnectionString = _databaseSettings.MySqlConnection;
                    using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                    {
                        _sync_date = Convert.ToDateTime(_syncRegistration.SyncDate).ToString("yyyy-MM-dd  HH:mm:ss");
                        _sqlQuery = new StringBuilder();
                        _sqlQuery.Append(" SELECT  max(modify_date) From (");
                        _sqlQuery.Append(" SELECT modify_date from  registration_main_live  ");

                        if (_syncRegistration.FirstSync != "1")
                            _sqlQuery.Append(" where  modify_date  > '" + _sync_date + "'");

                        _sqlQuery.Append(" order by modify_date limit " + _record_count + ")qry");

                        //  _mySqlCommand.CommandText = _sqlQuery.ToString();
                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                        if (_dataTable != null && _dataTable.Rows.Count > 0)
                        {
                            if (_dataTable.Rows[0][0].ToString() == "")
                                _success = false;
                            else
                            {
                                _last_record_date_time = Convert.ToString(_dataTable.Rows[0][0]);

                                _last_record_date_time = Convert.ToDateTime(_last_record_date_time).ToString("yyyy-MM-dd  HH:mm:ss");
                            }
                        }

                        if (_success)
                        {
                            _sqlQuery.Clear();
                            if (_syncRegistration.FirstSync != "1")
                            {
                                _sqlQuery.Append("SELECT candidate_guid,candidate_code,registration_guid,email_verified,modify_date,");
                                _sqlQuery.Append("payment_status_guid,payment_date,registration_date,registration_status_guid ");
                                _sqlQuery.Append("FROM registration_main_live ");
                                //_sqlQuery.Append("WHERE candidate_guid='908457fe-801e-11eb-8f5e-5a28b94f0bf6';");
                                _sqlQuery.Append("WHERE modify_date <='" + _last_record_date_time + "' AND modify_date > '" + _sync_date + "';");
                            }
                            else
                            {
                                _sqlQuery.Append("SELECT candidate_guid,candidate_code,registration_guid,email_verified ");
                                _sqlQuery.Append(" ,payment_status_guid ,payment_date ,registration_date  ,modify_date  ,registration_status_guid ");
                                _sqlQuery.Append(" FROM registration_main_live ");
                             //   _sqlQuery.Append("WHERE candidate_guid='1116b4f6-9b8f-11eb-8f5e-5a28b94f0bf6';");
                                _sqlQuery.Append(" WHERE modify_date <='" + _last_record_date_time + "';");
                            }

                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            List<RegistrationMainLive> _regMainLiveList = new List<RegistrationMainLive>();

                            foreach (DataRow row in _dataTable.Rows)
                            {
                                RegistrationMainLive _regMainLive = new RegistrationMainLive();
                                _candidate_guid = row["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(row["candidate_guid"]);
                                _candidate_code = row["candidate_code"] == DBNull.Value ? "" : Convert.ToString(row["candidate_code"]);
                                _registration_guid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                                _email_verified = row["email_verified"] == DBNull.Value ? "" : Convert.ToString(row["email_verified"]);
                                _payment_status = row["payment_status_guid"] == DBNull.Value ? "" : Convert.ToString(row["payment_status_guid"]);
                                _payment_date = row["payment_date"] == DBNull.Value ? "" : Convert.ToString(row["payment_date"]);
                                _registration_date = row["registration_date"] == DBNull.Value ? "" : Convert.ToString(row["registration_date"]);
                                _modify_date = row["modify_date"] == DBNull.Value ? "" : Convert.ToString(row["modify_date"]);
                                _registration_status_guid = row["registration_status_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_status_guid"]);

                                _regMainLive.CandidateGuid = _candidate_guid;
                                _regMainLive.CandidateCode = _candidate_code;
                                _regMainLive.RegistrationGuid = _registration_guid;
                                _regMainLive.EmailVerified = _email_verified;
                                _regMainLive.PaymentDate = _payment_date;
                                _regMainLive.RegistrationDate = _registration_date;
                                _regMainLive.PaymentStatusGuid = _payment_status;
                                _regMainLive.ModifyDate = _modify_date;
                                _regMainLive.RegistrationStatusGuid = _registration_status_guid;

                                _sqlQuery.Clear();
                                _sqlQuery.Append(" select candidate_guid, form_id, page_id, section_id, ");
                                _sqlQuery.Append(" comp_id, datavalue, imageValue, status, showingrid  ");
                                _sqlQuery.Append(" from  data_save_main_live ");
                                _sqlQuery.Append(" where  candidate_guid = '" + _candidate_guid + "';");
                                (_functionReturn, _dataTable_data, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                List<DataSaveMain> _dataMainList = new List<DataSaveMain>();
                                foreach (DataRow rowdata in _dataTable_data.Rows)
                                {
                                    _candidate_guid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]);
                                    _form_id = rowdata["form_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["form_id"]);
                                    _page_id = rowdata["page_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["page_id"]);
                                    _section_id = rowdata["section_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["section_id"]);
                                    _comp_id = rowdata["comp_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["comp_id"]);
                                    _datavalue = rowdata["datavalue"] == DBNull.Value ? "" : Sanitization.Sanitize(Convert.ToString(rowdata["datavalue"]));
                                    _imageValue = rowdata["imageValue"] == DBNull.Value ? "" : Convert.ToString(rowdata["imageValue"]);
                                    _status = rowdata["status"] == DBNull.Value ? "" : Convert.ToString(rowdata["status"]);
                                    _showingrid = rowdata["showingrid"] == DBNull.Value ? "" : Convert.ToString(rowdata["showingrid"]);

                                    DataSaveMain _dataList = new DataSaveMain();
                                    _dataList.CandidateGuid = _candidate_guid;
                                    _dataList.FormId = _form_id;
                                    _dataList.PageId = _page_id;
                                    _dataList.SectionId = _section_id;
                                    _dataList.ComponentId = _comp_id;
                                    _dataList.DataValue = _datavalue;
                                    _dataList.ImageValue = _imageValue;
                                    _dataList.Status = _status;
                                    _dataList.ShowinGrid = _showingrid;
                                    _dataMainList.Add(_dataList);
                                }
                                _regMainLive.DataSaveMaintList = _dataMainList;
                                // datasave

                                _regMainLiveList.Add(_regMainLive);

                                /*reg_data_gridvalues*/
                                _sqlQuery.Clear();
                                _sqlQuery.Append("SELECT id,reg_component_id,row_guid,grid_component_id,value,imageValue,status");
                                _sqlQuery.Append(" FROM reg_data_gridvalues WHERE candidate_guid = '" + _candidate_guid + "';");
                                (_functionReturn, _dataTableGridValues, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                List<RegGridComponent> RegGridComponentValues = new List<RegGridComponent>();
                                foreach (DataRow _dtr in _dataTableGridValues.Rows)
                                {
                                    RegGridComponent regGrid = new RegGridComponent
                                    {
                                        Id = _dtr["id"] == DBNull.Value ? 0 : Convert.ToUInt64(_dtr["id"]),
                                        CandidateGuid = _candidate_guid,
                                        RegComponentId = _dtr["reg_component_id"] == DBNull.Value ? 0 : Convert.ToUInt64(_dtr["reg_component_id"]),
                                        RowGuid = _dtr["row_guid"] == DBNull.Value ? "" : Convert.ToString(_dtr["row_guid"]),
                                        GridComponentId = _dtr["grid_component_id"] == DBNull.Value ? 0 : Convert.ToUInt64(_dtr["grid_component_id"]),
                                        Value = _dtr["value"] == DBNull.Value ? "" : Convert.ToString(_dtr["value"]),
                                        ImageValue = _dtr["imageValue"] == DBNull.Value ? "" : Convert.ToString(_dtr["imageValue"]),
                                        Status = _dtr["status"] == DBNull.Value ? "" : Convert.ToString(_dtr["status"]),
                                    };
                                    RegGridComponentValues.Add(regGrid);
                                }
                                _regMainLive.RegGridComponentValues = RegGridComponentValues;
                                /*reg_data_gridvalues*/
                            }
                            _registrationMainLives.RegistrationMainLiveList = _regMainLiveList;
                            _regMainLiveList = null;

                            #region Activity-log

                            _sqlQuery.Clear();
                            if (_first_sync == "1")
                            {
                                _sqlQuery.Append("SELECT candidate_guid,activity_type_id,log_description,timestamp ");
                                _sqlQuery.Append(" from reg_activity_log ");
                                _sqlQuery.Append(" where  timestamp <= '" + _last_record_date_time + "';");
                            }
                            else
                            {
                                _sqlQuery.Append(" SELECT candidate_guid,activity_type_id,log_description,timestamp ");
                                _sqlQuery.Append(" from reg_activity_log ");
                                _sqlQuery.Append(" where  timestamp <= '" + _last_record_date_time + "' and timestamp > '" + _sync_date + "';");
                            }
                            (_functionReturn, _dataTable_activity_log, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            List<RegActivityLog> _regActivityLogList = new List<RegActivityLog>();
                            foreach (DataRow rowdata in _dataTable_activity_log.Rows)
                            {
                                _candidate_guid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]);
                                _activity_type_id = rowdata["activity_type_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["activity_type_id"]);
                                _log_description = rowdata["log_description"] == DBNull.Value ? "" : Sanitization.Sanitize(Convert.ToString(rowdata["log_description"]));
                                _timestamp = rowdata["timestamp"] == DBNull.Value ? "" : Sanitization.Sanitize(Convert.ToString(rowdata["timestamp"]));

                                RegActivityLog _regActivityLog = new RegActivityLog();
                                _regActivityLog.CandidateGuid = _candidate_guid;
                                _regActivityLog.ActivityTypeId = _activity_type_id;
                                _regActivityLog.LogDescription = _log_description;
                                _regActivityLog.TimeStamp = _timestamp;
                                _regActivityLogList.Add(_regActivityLog);
                            }
                            _registrationMainLives.RegActivityLogList = _regActivityLogList;
                            #endregion

                            #region reg_ai_logs_main

                            _sqlQuery.Clear();
                            if (_first_sync == "1")
                            {
                                _sqlQuery.Append("SELECT id,reg_guid,endpoint,algo_guid,image_type,image_width,image_height,log_date");
                                _sqlQuery.Append(" FROM reg_ai_logs_main ");
                                _sqlQuery.Append(" WHERE  log_date <= '" + _last_record_date_time + "';");
                            }
                            else
                            {
                                _sqlQuery.Append("SELECT id,reg_guid,endpoint,algo_guid,image_type,image_width,image_height,log_date");
                                _sqlQuery.Append(" FROM reg_ai_logs_main ");
                                _sqlQuery.Append("WHERE log_date <= '" + _last_record_date_time + "' AND log_date > '" + _sync_date + "';");
                            }
                            (_functionReturn, _dataTableAiLogMain, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            foreach (DataRow _dtr in _dataTableAiLogMain.Rows)
                            {
                                string Id = _dtr["id"] == DBNull.Value ? "" : Convert.ToString(_dtr["id"]);
                                string RegGuid = _dtr["reg_guid"] == DBNull.Value ? "" : Convert.ToString(_dtr["reg_guid"]);
                                string EndPoint = _dtr["endpoint"] == DBNull.Value ? "" : Convert.ToString(_dtr["endpoint"]);
                                string AlgoGuid = _dtr["algo_guid"] == DBNull.Value ? "" : Convert.ToString(_dtr["algo_guid"]);
                                string ImageType = _dtr["image_type"] == DBNull.Value ? "" : Convert.ToString(_dtr["image_type"]);
                                string ImageWidth = _dtr["image_width"] == DBNull.Value ? "" : Convert.ToString(_dtr["image_width"]);
                                string ImageHeight = _dtr["image_height"] == DBNull.Value ? "" : Convert.ToString(_dtr["image_height"]);
                                string LogDate = _dtr["log_date"] == DBNull.Value ? "" : Convert.ToString(_dtr["log_date"]);

                                /*reg_ai_logs_color & faces starts*/
                                _sqlQuery.Clear();
                                _sqlQuery.Append("SELECT id,reg_ai_log_id,color,color_percent,color_portion_image FROM reg_ai_logs_color WHERE reg_ai_log_id=" + Id + ";");
                                _sqlQuery.Append("SELECT id,reg_ai_log_id,x_cordinate,y_cordinate,height,width,percent FROM reg_ai_logs_faces WHERE reg_ai_log_id=" + Id + ";");
                                (_functionReturn, _dataSetAiLogColorFaces, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);
                                List<RegAiLogsColor> regAiLogsColors = new List<RegAiLogsColor>();
                                if (_functionReturn.Status && _dataSetAiLogColorFaces.Tables.Count > 0 && _dataSetAiLogColorFaces.Tables[0].Rows.Count > 0)
                                {
                                    foreach (DataRow item in _dataSetAiLogColorFaces.Tables[0].Rows)
                                    {
                                        regAiLogsColors.Add(new RegAiLogsColor
                                        {
                                            Id = item["id"] == DBNull.Value ? "" : Convert.ToString(item["id"]),
                                            RegAiLogId = Id,
                                            Color = item["color"] == DBNull.Value ? "" : Convert.ToString(item["color"]),
                                            ColorPercent = item["color_percent"] == DBNull.Value ? "" : Convert.ToString(item["color_percent"]),
                                            ColorPortionImage = item["color_portion_image"] == DBNull.Value ? "" : Convert.ToString(item["color_portion_image"])
                                        }
                                        );
                                    }
                                }
                                List<RegAiLogsFaces> regAiLogsFaces = new List<RegAiLogsFaces>();
                                if (_functionReturn.Status && _dataSetAiLogColorFaces.Tables.Count > 1 && _dataSetAiLogColorFaces.Tables[1].Rows.Count > 0)
                                {
                                    foreach (DataRow item in _dataSetAiLogColorFaces.Tables[1].Rows)
                                    {
                                        regAiLogsFaces.Add(new RegAiLogsFaces
                                        {
                                            Id = item["id"] == DBNull.Value ? "" : Convert.ToString(item["id"]),
                                            RegAiLogId = Id,
                                            X = item["x_cordinate"] == DBNull.Value ? "" : Convert.ToString(item["x_cordinate"]),
                                            Y = item["y_cordinate"] == DBNull.Value ? "" : Convert.ToString(item["y_cordinate"]),
                                            Height = item["height"] == DBNull.Value ? "" : Convert.ToString(item["height"]),
                                            Width = item["width"] == DBNull.Value ? "" : Convert.ToString(item["width"]),
                                            FacePercent = item["percent"] == DBNull.Value ? "" : Convert.ToString(item["percent"])
                                        });
                                    }
                                }
                                /*reg_ai_logs_color & faces ends*/

                                _regAiLogsMains.Add(new RegAiLogsMain
                                {
                                    Id = Id,
                                    RegGuid = RegGuid,
                                    EndPoint = EndPoint,
                                    AlgoGuid = AlgoGuid,
                                    ImageType = ImageType,
                                    ImageWidth = ImageWidth,
                                    ImageHeight = ImageHeight,
                                    LogDate = LogDate,
                                    RegAiLogsColor = regAiLogsColors,
                                    RegAiLogsFaces = regAiLogsFaces
                                });
                            }
                            #endregion

                            #region Payment-Gateways

                            _sqlQuery.Clear();
                            _sqlQuery.Append("SELECT code FROM payment_gateway_types;");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            if (_dataTable.Rows.Count > 0 && Convert.ToString(_dataTable.Rows[0][0]).ToUpper() == "PAYTM")
                            {
                                _sqlQuery.Clear();
                                if (_first_sync == "1")
                                {
                                    _sqlQuery.Append("SELECT order_id,registration_guid,email,name,mobile_number,fee_amount,request_datetime,pay_detail,payment_gateway_id,check_sum_hash,txn_status,status,candidate_guid ");
                                    _sqlQuery.Append("FROM paytm_request_detail ");
                                    _sqlQuery.Append("WHERE request_datetime <= '" + _last_record_date_time + "';");
                                }
                                else
                                {
                                    _sqlQuery.Append("SELECT order_id,registration_guid,email,name,mobile_number,fee_amount,request_datetime,pay_detail,payment_gateway_id,check_sum_hash,txn_status,status,candidate_guid ");
                                    _sqlQuery.Append("FROM paytm_request_detail ");
                                    _sqlQuery.Append("WHERE request_datetime <= '" + _last_record_date_time + "' AND request_datetime > '" + _sync_date + "';");
                                }
                                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                #region PAYTM
                                List<PaytmRequestDetail> _paytmReq = new List<PaytmRequestDetail>();
                                if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow rowdata in _dataTable.Rows)
                                    {
                                        _sqlQuery.Clear();
                                        _sqlQuery.Append("SELECT id,order_id,mid,txn_id,txn_amount,payment_mode,currency,txn_date,response_code,response_msg,gateway_name,bank_txn_id,bank_name,check_sum_hash,txn_status FROM paytm_response_detail WHERE order_id=" + (rowdata["order_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["order_id"])) + ";");
                                        (_functionReturn, _dataTable_response, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                        _paytmReq.Add(new PaytmRequestDetail
                                        {
                                            OrderId = rowdata["order_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["order_id"]),
                                            RegistrationsGuid = rowdata["registration_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["registration_guid"]),
                                            Email = rowdata["email"] == DBNull.Value ? "" : Convert.ToString(rowdata["email"]),
                                            Name = rowdata["name"] == DBNull.Value ? "" : Convert.ToString(rowdata["name"]),
                                            MobileNumber = rowdata["mobile_number"] == DBNull.Value ? "" : Convert.ToString(rowdata["mobile_number"]),
                                            FeeAmount = rowdata["fee_amount"] == DBNull.Value ? "" : Convert.ToString(rowdata["fee_amount"]),
                                            RequestDateTime = rowdata["request_datetime"] == DBNull.Value ? "" : Convert.ToString(rowdata["request_datetime"]),
                                            PayDetail = rowdata["pay_detail"] == DBNull.Value ? "" : Convert.ToString(rowdata["pay_detail"]),
                                            PaymentGatewayId = rowdata["payment_gateway_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["payment_gateway_id"]),
                                            CheckSumHash = rowdata["check_sum_hash"] == DBNull.Value ? "" : Convert.ToString(rowdata["check_sum_hash"]),
                                            TxnStatus = rowdata["txn_status"] == DBNull.Value ? "" : Convert.ToString(rowdata["txn_status"]),
                                            Status = rowdata["status"] == DBNull.Value ? "" : Convert.ToString(rowdata["status"]),
                                            CandidateGuid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]),
                                            PaytmResponseDetail = _dataTable_response.Rows.Count <= 0 ? null : new PaytmResponseDetail
                                            {
                                                Id = _dataTable_response.Rows[0]["id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["id"]),
                                                OrderId = _dataTable_response.Rows[0]["order_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["order_id"]),
                                                Mid = _dataTable_response.Rows[0]["mid"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["mid"]),
                                                TxnId = _dataTable_response.Rows[0]["txn_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_id"]),
                                                TxnAmount = _dataTable_response.Rows[0]["txn_amount"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_amount"]),
                                                PaymentMode = _dataTable_response.Rows[0]["payment_mode"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["payment_mode"]),
                                                Currency = _dataTable_response.Rows[0]["currency"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["currency"]),
                                                TxnDate = _dataTable_response.Rows[0]["txn_date"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_date"]),
                                                ResponseCode = _dataTable_response.Rows[0]["response_code"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["response_code"]),
                                                ResponseMsg = _dataTable_response.Rows[0]["response_msg"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["response_msg"]),
                                                GatewayName = _dataTable_response.Rows[0]["gateway_name"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["gateway_name"]),
                                                BankTxnId = _dataTable_response.Rows[0]["bank_txn_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["bank_txn_id"]),
                                                BankName = _dataTable_response.Rows[0]["bank_name"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["bank_name"]),
                                                CheckSumHash = _dataTable_response.Rows[0]["check_sum_hash"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["check_sum_hash"]),
                                                TxnStatus = _dataTable_response.Rows[0]["txn_status"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_status"])
                                            }
                                        });
                                    }
                                    _registrationMainLives.PaytmRequestDetail = _paytmReq;
                                }
                                #endregion
                            }
                            else if (_dataTable.Rows.Count > 0 && Convert.ToString(_dataTable.Rows[0][0]).ToUpper() == "PAYUMONEY")
                            {
                                _sqlQuery.Clear();
                                if (_first_sync == "1")
                                {
                                    _sqlQuery.Append("SELECT order_id,registration_guid,email,name,mobile_number,fee_amount,request_datetime,product_info,payment_gateway_id,check_sum_hash,txn_status,status,candidate_guid ");
                                    _sqlQuery.Append("FROM payumoney_request_detail ");
                                    _sqlQuery.Append("WHERE request_datetime <= '" + _last_record_date_time + "';");
                                }
                                else
                                {
                                    _sqlQuery.Append("SELECT order_id,registration_guid,email,name,mobile_number,fee_amount,request_datetime,product_info,payment_gateway_id,check_sum_hash,txn_status,status,candidate_guid ");
                                    _sqlQuery.Append("FROM payumoney_request_detail ");
                                    _sqlQuery.Append("WHERE request_datetime <= '" + _last_record_date_time + "' AND request_datetime > '" + _sync_date + "';");
                                }
                                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                #region PAYUMONEY
                                List<PayUMoneyRequestDetail> _payUMoneyReq = new List<PayUMoneyRequestDetail>();
                                if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow rowdata in _dataTable.Rows)
                                    {
                                        _sqlQuery.Clear();
                                        _sqlQuery.Append("SELECT id,order_id,first_name,txn_amount,payment_mode,paumoney_id,txn_date,mobile,email,gateway_name,bank_txn_id,product_info,check_sum_hash,txn_status FROM payumoney_response_detail WHERE order_id=" + (rowdata["order_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["order_id"])) + ";");
                                        (_functionReturn, _dataTable_response, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                        _payUMoneyReq.Add(new PayUMoneyRequestDetail
                                        {
                                            OrderId = rowdata["order_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["order_id"]),
                                            RegistrationsGuid = rowdata["registration_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["registration_guid"]),
                                            Email = rowdata["email"] == DBNull.Value ? "" : Convert.ToString(rowdata["email"]),
                                            Name = rowdata["name"] == DBNull.Value ? "" : Convert.ToString(rowdata["name"]),
                                            MobileNumber = rowdata["mobile_number"] == DBNull.Value ? "" : Convert.ToString(rowdata["mobile_number"]),
                                            FeeAmount = rowdata["fee_amount"] == DBNull.Value ? "" : Convert.ToString(rowdata["fee_amount"]),
                                            RequestDateTime = rowdata["request_datetime"] == DBNull.Value ? "" : Convert.ToString(rowdata["request_datetime"]),
                                            ProductInfo = rowdata["product_info"] == DBNull.Value ? "" : Convert.ToString(rowdata["product_info"]),
                                            PaymentGatewayId = rowdata["payment_gateway_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["payment_gateway_id"]),
                                            CheckSumHash = rowdata["check_sum_hash"] == DBNull.Value ? "" : Convert.ToString(rowdata["check_sum_hash"]),
                                            TxnStatus = rowdata["txn_status"] == DBNull.Value ? "" : Convert.ToString(rowdata["txn_status"]),
                                            Status = rowdata["status"] == DBNull.Value ? "" : Convert.ToString(rowdata["status"]),
                                            CandidateGuid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]),
                                            PayUMoneyResponseDetail = _dataTable_response.Rows.Count <= 0 ? null : new PayUMoneyResponseDetail
                                            {
                                                Id = _dataTable_response.Rows[0]["id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["id"]),
                                                OrderId = _dataTable_response.Rows[0]["order_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["order_id"]),
                                                TxnAmount = _dataTable_response.Rows[0]["txn_amount"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_amount"]),
                                                PaymentMode = _dataTable_response.Rows[0]["payment_mode"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["payment_mode"]),
                                                PayUMoneyId = _dataTable_response.Rows[0]["paumoney_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["paumoney_id"]),
                                                TxnDate = _dataTable_response.Rows[0]["txn_date"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_date"]),
                                                Mobile = _dataTable_response.Rows[0]["mobile"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["mobile"]),
                                                Email = _dataTable_response.Rows[0]["email"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["email"]),
                                                GatewayName = _dataTable_response.Rows[0]["gateway_name"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["gateway_name"]),
                                                BankTxnId = _dataTable_response.Rows[0]["bank_txn_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["bank_txn_id"]),
                                                ProductInfo = _dataTable_response.Rows[0]["product_info"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["product_info"]),
                                                CheckSumHash = _dataTable_response.Rows[0]["check_sum_hash"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["check_sum_hash"]),
                                                TxnStatus = _dataTable_response.Rows[0]["txn_status"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_status"])
                                            }
                                        });
                                    }
                                    _registrationMainLives.PayUMoneyRequestDetail = _payUMoneyReq;
                                }
                                #endregion
                            }
                            else if (_dataTable.Rows.Count > 0 && Convert.ToString(_dataTable.Rows[0][0]).ToUpper() == "RAZORPAY")
                            {
                                _sqlQuery.Clear();
                                if (_first_sync == "1")
                                {
                                    _sqlQuery.Append("SELECT order_id,registration_guid,email,name,mobile_number,fee_amount,request_datetime,description,payment_gateway_id,txn_status,status,candidate_guid,product_info,razorpay_order_id ");
                                    _sqlQuery.Append("FROM razorpay_request_detail ");
                                    _sqlQuery.Append("WHERE request_datetime <= '" + _last_record_date_time + "';");
                                }
                                else
                                {
                                    _sqlQuery.Append("SELECT order_id,registration_guid,email,name,mobile_number,fee_amount,request_datetime,description,payment_gateway_id,txn_status,status,candidate_guid,product_info,razorpay_order_id ");
                                    _sqlQuery.Append("FROM razorpay_request_detail ");
                                    _sqlQuery.Append("WHERE request_datetime <= '" + _last_record_date_time + "' AND request_datetime > '" + _sync_date + "';");
                                }
                                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                #region RAZORPAY
                                List<RazorpayRequestDetail> _razorpayReq = new List<RazorpayRequestDetail>();
                                if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow rowdata in _dataTable.Rows)
                                    {
                                        _sqlQuery.Clear();
                                        _sqlQuery.Append("SELECT id,order_id,razorpay_order_id,razorpay_payment_id,razorpay_singnature,txn_amount,payment_mode,currency,txn_date,response_code,response_msg,gateway_name,bank_txn_id,bank_name,txn_status FROM razorpay_response_detail WHERE order_id=" + (rowdata["order_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["order_id"])) + ";");
                                        (_functionReturn, _dataTable_response, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                        _razorpayReq.Add(new RazorpayRequestDetail
                                        {
                                            OrderId = rowdata["order_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["order_id"]),
                                            RazorPayOrderId = rowdata["razorpay_order_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["razorpay_order_id"]),
                                            RegistrationsGuid = rowdata["registration_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["registration_guid"]),
                                            Email = rowdata["email"] == DBNull.Value ? "" : Convert.ToString(rowdata["email"]),
                                            Name = rowdata["name"] == DBNull.Value ? "" : Convert.ToString(rowdata["name"]),
                                            MobileNumber = rowdata["mobile_number"] == DBNull.Value ? "" : Convert.ToString(rowdata["mobile_number"]),
                                            FeeAmount = rowdata["fee_amount"] == DBNull.Value ? "" : Convert.ToString(rowdata["fee_amount"]),
                                            RequestDateTime = rowdata["request_datetime"] == DBNull.Value ? "" : Convert.ToString(rowdata["request_datetime"]),
                                            ProductInfo = rowdata["product_info"] == DBNull.Value ? "" : Convert.ToString(rowdata["product_info"]),
                                            PaymentGatewayId = rowdata["payment_gateway_id"] == DBNull.Value ? "" : Convert.ToString(rowdata["payment_gateway_id"]),
                                            TxnStatus = rowdata["txn_status"] == DBNull.Value ? "" : Convert.ToString(rowdata["txn_status"]),
                                            Status = rowdata["status"] == DBNull.Value ? "" : Convert.ToString(rowdata["status"]),
                                            CandidateGuid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]),
                                            RazorPayResponseDetail = _dataTable_response.Rows.Count <= 0 ? null : new RazorPayResponseDetail
                                            {
                                                Id = _dataTable_response.Rows[0]["id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["id"]),
                                                OrderId = _dataTable_response.Rows[0]["order_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["order_id"]),
                                                TxnAmount = _dataTable_response.Rows[0]["txn_amount"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_amount"]),
                                                PaymentMode = _dataTable_response.Rows[0]["payment_mode"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["payment_mode"]),
                                                TxnDate = _dataTable_response.Rows[0]["txn_date"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_date"]),
                                                GatewayName = _dataTable_response.Rows[0]["gateway_name"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["gateway_name"]),
                                                BankTxnId = _dataTable_response.Rows[0]["bank_txn_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["bank_txn_id"]),
                                                TxnStatus = _dataTable_response.Rows[0]["txn_status"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["txn_status"]),
                                                RazorPayOrderId = _dataTable_response.Rows[0]["razorpay_order_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["razorpay_order_id"]),
                                                RazorPayPaymentId = _dataTable_response.Rows[0]["razorpay_payment_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["razorpay_payment_id"]),
                                                RazorPaySignature = _dataTable_response.Rows[0]["razorpay_singnature"] == DBNull.Value ? "" : Convert.ToString(_dataTable_response.Rows[0]["razorpay_singnature"])
                                            }
                                        });
                                    }
                                    _registrationMainLives.RazorpayRequestDetail = _razorpayReq;
                                }
                                #endregion
                            }

                            else if (_dataTable.Rows.Count > 0 && Convert.ToString(_dataTable.Rows[0][0]).ToUpper() == "SBI COLLECT")
                            {
                                _sqlQuery.Clear();
                                if (_first_sync == "1")
                                {
                                    _sqlQuery.Append("SELECT id,candidate_guid,name,payment_date,payment_amount,status ");
                                    _sqlQuery.Append("FROM payment_sbicollect_detail ");
                                    _sqlQuery.Append("WHERE payment_date <= '" + _last_record_date_time + "';");
                                }
                                else
                                {
                                    _sqlQuery.Append("SELECT id,candidate_guid,name,payment_date,payment_amount,status ");
                                    _sqlQuery.Append("FROM payment_sbicollect_detail ");
                                    _sqlQuery.Append("WHERE payment_date <= '" + _last_record_date_time + "' AND payment_date > '" + _sync_date + "';");
                                }
                                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                #region SBI-COLLECT
                                List<PaymentSbiCollectDetail> _sbiCollect = new List<PaymentSbiCollectDetail>();
                                if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow rowdata in _dataTable.Rows)
                                    {
                                        _sbiCollect.Add(new PaymentSbiCollectDetail
                                        {
                                            Id = rowdata["id"] == DBNull.Value ? "" : Convert.ToString(rowdata["id"]),
                                            CandidateGuid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]),
                                            Name = rowdata["name"] == DBNull.Value ? "" : Convert.ToString(rowdata["name"]),
                                            PaymentDate = rowdata["payment_date"] == DBNull.Value ? "" : Convert.ToString(rowdata["payment_date"]),
                                            PaymentAmount = rowdata["payment_amount"] == DBNull.Value ? "" : Convert.ToString(rowdata["payment_amount"]),
                                            Status = rowdata["status"] == DBNull.Value ? "" : Convert.ToString(rowdata["status"])
                                        });
                                    }
                                    _registrationMainLives.PaymentSbiCollectDetail = _sbiCollect;
                                }
                                #endregion
                            }

                            else if (_dataTable.Rows.Count > 0 && Convert.ToString(_dataTable.Rows[0][0]).ToUpper() == "CHALLAN")
                            {
                                _sqlQuery.Clear();
                                if (_first_sync == "1")
                                {
                                    _sqlQuery.Append("SELECT id,candidate_guid,bank_name,challannumber,challan_date,challan_amount,status ");
                                    _sqlQuery.Append("FROM payment_challan_detail ");
                                    _sqlQuery.Append("WHERE challan_date <= '" + _last_record_date_time + "';");
                                }
                                else
                                {
                                    _sqlQuery.Append("SELECT id,candidate_guid,bank_name,challannumber,challan_date,challan_amount,status ");
                                    _sqlQuery.Append("FROM payment_challan_detail ");
                                    _sqlQuery.Append("WHERE challan_date <= '" + _last_record_date_time + "' AND challan_date > '" + _sync_date + "';");
                                }
                                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                #region PaymentChallanDetail
                                List<PaymentChallanDetail> _challan = new List<PaymentChallanDetail>();
                                if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow rowdata in _dataTable.Rows)
                                    {
                                        _challan.Add(new PaymentChallanDetail
                                        {
                                            Id = rowdata["id"] == DBNull.Value ? "" : Convert.ToString(rowdata["id"]),
                                            CandidateGuid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]),
                                            BankName = rowdata["bank_name"] == DBNull.Value ? "" : Convert.ToString(rowdata["bank_name"]),
                                            ChallanNumber = rowdata["challannumber"] == DBNull.Value ? "" : Convert.ToString(rowdata["challannumber"]),
                                            ChallanDate = rowdata["challan_date"] == DBNull.Value ? "" : Convert.ToString(rowdata["challan_date"]),
                                            ChallanAmount = rowdata["challan_amount"] == DBNull.Value ? "" : Convert.ToString(rowdata["challan_amount"]),
                                            Status = rowdata["status"] == DBNull.Value ? "" : Convert.ToString(rowdata["status"])
                                        });
                                    }
                                    _registrationMainLives.PaymentChallanDetail = _challan;
                                }
                                #endregion
                            }
                            else if (_dataTable.Rows.Count > 0 && Convert.ToString(_dataTable.Rows[0][0]).ToUpper() == "CHEQUE/DD")
                            {
                                _sqlQuery.Clear();
                                if (_first_sync == "1")
                                {
                                    _sqlQuery.Append("SELECT id,candidate_guid,mode_cheque_dd,bank_name,cheque_dd_number,cheque_dd_date,cheque_dd_amount,status ");
                                    _sqlQuery.Append("FROM payment_cheque_detail ");
                                    _sqlQuery.Append("WHERE cheque_dd_date <= '" + _last_record_date_time + "';");
                                }
                                else
                                {
                                    _sqlQuery.Append("SELECT id,candidate_guid,mode_cheque_dd,bank_name,cheque_dd_number,cheque_dd_date,cheque_dd_amount,status ");
                                    _sqlQuery.Append("FROM payment_cheque_detail ");
                                    _sqlQuery.Append("WHERE cheque_dd_date <= '" + _last_record_date_time + "' AND cheque_dd_date > '" + _sync_date + "';");
                                }
                                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                #region Cheque/DD
                                List<PaymentChequeDetail> _chequeDD = new List<PaymentChequeDetail>();
                                if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow rowdata in _dataTable.Rows)
                                    {
                                        _chequeDD.Add(new PaymentChequeDetail
                                        {
                                            Id = rowdata["id"] == DBNull.Value ? "" : Convert.ToString(rowdata["id"]),
                                            CandidateGuid = rowdata["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(rowdata["candidate_guid"]),
                                            ModeChequeDD = rowdata["mode_cheque_dd"] == DBNull.Value ? "" : Convert.ToString(rowdata["mode_cheque_dd"]),
                                            BankName = rowdata["bank_name"] == DBNull.Value ? "" : Convert.ToString(rowdata["bank_name"]),
                                            ChequeNumber = rowdata["cheque_dd_number"] == DBNull.Value ? "" : Convert.ToString(rowdata["cheque_dd_number"]),
                                            ChequeDate = rowdata["cheque_dd_date"] == DBNull.Value ? "" : Convert.ToString(rowdata["cheque_dd_date"]),
                                            ChequeAmount = rowdata["cheque_dd_amount"] == DBNull.Value ? "" : Convert.ToString(rowdata["cheque_dd_amount"]),
                                            Status = rowdata["status"] == DBNull.Value ? "" : Convert.ToString(rowdata["status"])
                                        });
                                    }
                                    _registrationMainLives.PaymentChequeDetail = _chequeDD;
                                }
                                #endregion
                            }
                            #endregion
                        }
                    }
                    string json = JsonConvert.SerializeObject(_registrationMainLives);

                    //  _filesize = json.Length;

                    //write string to file
                    //   System.IO.File.Delete(@_file_path);
                    System.IO.File.WriteAllText(@_file_path + "/" + _file_name, json);
                    DirectoryInfo directoryInfo = new DirectoryInfo(@_file_path);
                    FileInfo[] _currentDirFiles = directoryInfo.GetFiles(_file_name, SearchOption.TopDirectoryOnly);
                    _filesize = Convert.ToInt32(_currentDirFiles[0].Length.ToString());
                    JsonFile _jfile = new JsonFile();
                    _jfile.FileSize = Convert.ToString(_filesize);
                    _jfile.FileName = _file_name;
                    _jfile.LastRecordDateTime = _last_record_date_time;
                    _jsonReturn = JsonConvert.SerializeObject(_jfile);
                    if (_success)
                        _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.JsonCreatedSuccesFully, _methodName);
                    else
                        _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.RecordNotFound, _methodName);
                }
                catch (Exception ex)
                {
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != System.Data.ConnectionState.Closed)
                    {
                        _mySqlConnection?.Close();
                        _mySqlConnection = null;
                    }
                    _registrationMainLives = null;
                    _sqlQuery = null;
                    _sqlConnectionString = string.Empty;
                }
            }
            return (_jsonReturn, _functionReturn);
        }
    }
}