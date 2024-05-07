using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Models;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCandidateApi.Globals;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using IXCheckCommonLib.Models.Paging;
using IXCheckCandidateApi.AppValidations;
using IXCheckCandidateApi.Models.Interfaces;
using System.IO;
using Newtonsoft.Json;
using paytm;
using System.Security.Cryptography;
using System.Collections;
using Razorpay.Api;

namespace IXCheckCandidateApi.AppFunctions
{
    public class PaymentGatewayFunctions : IPaymentGatewayFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly IDatabaseFunctions _databaseFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiSettings _apiSettings;
        private readonly IStats _stats;
        private readonly IHttpClientFunctions _httpClientFunctions;
        private readonly IConfiguration _configuration;
        private readonly ISharedFunctions _sharedFunctions;
        public PaymentGatewayFunctions(IDatabaseSettings __databaseSettings, IHttpClientFunctions __httpClientFunctions,
            ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration, ISharedFunctions __sharedFunctions)
        {
            _sharedFunctions = __sharedFunctions;
            _databaseSettings = __databaseSettings;
            _loggerFunctions = __loggerFunctions;
            _apiSettings = __apiSettings;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _httpClientFunctions = __httpClientFunctions;
            _configuration = __configuration;
        }



        private (string jsonReturn, IFunctionReturn functionReturn) GetPaymentInfoList(Payments _payments)
        {
            string _jsonReturn = string.Empty;
            string _errorMessage = string.Empty;
            string _methodName = "F:PaymentGateway:GetPaymentInfoList";
            IFunctionReturn _functionReturn = new FunctionReturn();
            string _jsonRequest = string.Empty;
            string _RegistrationGuid = "";
            string _candidateGuid = "";
            StringBuilder _sqlQuery = null;
            DataTable _dataTable = null;
            DataSet _dataSet = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            string _sqlConnectionString = string.Empty;
            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            int _rowsAffected = 0;
            MySqlTransaction _mytransaction = null;
            StringWriter _sw = new StringWriter(); ;
            JsonTextWriter _writer = new JsonTextWriter(_sw);
            bool _success = true;
            _functionReturn = new FunctionReturn();
            try
            {
                if (_payments == null)
                {
                    _errorMessage = "Payment Data is Required";
                }
                else
                {
                    _RegistrationGuid = Sanitization.Sanitize(_payments.RegistrationGuid);
                    _candidateGuid = Sanitization.Sanitize(_payments.CandidateGuid);
                    if (string.IsNullOrEmpty(_candidateGuid))
                        _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;
                    if (string.IsNullOrEmpty(_RegistrationGuid))
                        _errorMessage = ApplicationConstants.ValidationMessages.RegistrationGUIDRequired;
                }
            }
            catch (Exception ex)
            {
                _functionReturn = CommonFunctions.SystemError(_errorMessage, _methodName);
                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, _errorMessage, _methodName);
            }

            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
            else
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _sqlQuery.Append("select d.candidate_guid,  max(if(c.name='NgxIxcheckFirstname',d.datavalue,null)) as first_name, max(if(c.name='NgxIxcheckLastname',d.datavalue,null)) as last_name, max(if(c.name='NgxIxcheckEmail',d.datavalue,null)) as Email, max(if(c.name='NgxIxcheckMobilenumber',d.datavalue,null)) AS mobile_number, rml.fee_amount ");
                    _sqlQuery.Append(" , pgt.online_payment, rpg.payment_gateway_type_id ");
                    _sqlQuery.Append(" from components_main c ");
                    _sqlQuery.Append(" join data_save_main_live d on c.id=d.comp_id ");
                    _sqlQuery.Append(" join registration_main_live rml on rml.candidate_guid = d.candidate_guid ");
                    _sqlQuery.Append(" join registration_to_payment_gateways rpg on rpg.registration_guid = rml.registration_guid ");
                    _sqlQuery.Append(" join payment_gateway_types pgt on pgt.id = rpg.payment_gateway_type_id ");
                    _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "' AND rml.registration_guid='" + _RegistrationGuid + "';");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    if (Convert.ToString(_dataTable.Rows[0]["payment_gateway_type_id"]) == "3")
                    {
                        _sqlConnectionString = _databaseSettings.MySqlConnection;
                        using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                        {
                            _mySqlCommand = new MySqlCommand();
                            _mySqlCommand.CommandTimeout = _databaseSettings.MySqlTimeout;

                            // Open connection;
                            _sqlconnStart = DateTime.Now;
                            _mySqlConnection.Open();

                            _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                            _mySqlCommand.Connection = _mySqlConnection;
                            _mySqlCommand.Transaction = _mytransaction;

                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);
                            _sqlQuery.Clear();
                            _sqlQuery.Append("SELECT registration_pay_gateway_id,pay_gateway_environment_id,key_id,key_secret,bank_name,return_url,status FROM payment_gateway_razorpay WHERE status=1;");

                            _sqlQuery.Append("SELECT d.candidate_guid, max(if(c.name='NgxIxcheckFirstname',d.datavalue,null)) as first_name, max(if(c.name='NgxIxcheckLastname',d.datavalue,null)) as last_name, max(if(c.name='NgxIxcheckEmail',d.datavalue,null)) as email, max(if(c.name='NgxIxcheckMobilenumber',d.datavalue,null)) AS mobile_number, rml.fee_amount ");
                            _sqlQuery.Append(" FROM components_main c ");
                            _sqlQuery.Append(" JOIN data_save_main_live d on c.id=d.comp_id ");
                            _sqlQuery.Append(" JOIN registration_main_live rml on rml.candidate_guid = d.candidate_guid ");
                            _sqlQuery.Append(" WHERE d.candidate_guid='" + _candidateGuid + "' AND rml.registration_guid='" + _RegistrationGuid + "';");

                            (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                            if (_functionReturn.Status && _dataSet.Tables.Count > 1 && _dataSet.Tables[0].Rows.Count > 0 && _dataSet.Tables[1].Rows.Count > 0)
                            {
                                _sqlQuery.Clear();
                                _sqlQuery.Append("INSERT INTO razorpay_request_detail (");
                                _sqlQuery.Append("`registration_guid`");
                                _sqlQuery.Append(",`email`");
                                _sqlQuery.Append(",`name`");
                                _sqlQuery.Append(",`mobile_number`");
                                _sqlQuery.Append(",`fee_amount` ");
                                _sqlQuery.Append(",`request_datetime`");
                                _sqlQuery.Append(",`payment_gateway_id`");
                                _sqlQuery.Append(",`candidate_guid`");
                                _sqlQuery.Append(", `status` ");
                                _sqlQuery.Append(", `product_info` ");
                                _sqlQuery.Append(") VALUES (");
                                _sqlQuery.Append("'" + _RegistrationGuid + "'");
                                _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]) + "'");
                                _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]) + "'");
                                _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]) + "'");
                                _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]) + "'");
                                _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                                _sqlQuery.Append(",'" + Convert.ToString(_dataTable.Rows[0]["payment_gateway_type_id"]) + "'");
                                _sqlQuery.Append(",'" + _candidateGuid + "'");
                                _sqlQuery.Append(",'1'");
                                _sqlQuery.Append(",'Registration'");
                                _sqlQuery.Append(");");
                                //Call Function    
                                _sqlQuery.Append("SELECT LAST_INSERT_ID(); ");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                UInt64 _orderId = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                if (_orderId <= 0)
                                    _success = false;
                                if (_success)
                                {
                                    string _razorpay_order_id = "";
                                    Dictionary<string, object> input = new Dictionary<string, object>();
                                    input.Add("amount", Convert.ToUInt64(_dataSet.Tables[1].Rows[0]["fee_amount"]) * 100); // this amount should be same as transaction amount
                                    input.Add("currency", "INR");
                                    input.Add("receipt", _orderId.ToString());
                                    input.Add("payment_capture", 1);

                                    string key = Convert.ToString(_dataSet.Tables[0].Rows[0]["key_id"]).Trim();
                                    string secret = Convert.ToString(_dataSet.Tables[0].Rows[0]["key_secret"]).Trim();

                                    RazorpayClient client = new RazorpayClient(key, secret);
                                    System.Net.ServicePointManager.SecurityProtocol = (System.Net.SecurityProtocolType)3072;
                                    Razorpay.Api.Order order = client.Order.Create(input);
                                    _razorpay_order_id = order["id"].ToString();
                                    if (string.IsNullOrEmpty(_razorpay_order_id))
                                        _success = false;
                                    if (_success)
                                    {
                                        _sqlQuery.Clear();
                                        //_sqlQuery.Append("UPDATE payumoney_request_detail SET");
                                        _sqlQuery.Append("UPDATE razorpay_request_detail SET ");
                                        _sqlQuery.Append(" `razorpay_order_id`='" + _razorpay_order_id + "' ");
                                        _sqlQuery.Append(" WHERE order_id='" + _orderId + "';");
                                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                        _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                        if (_rowsAffected <= 0)
                                            _success = false;

                                        // create json
                                        if (_success)
                                        {
                                            _writer.WriteStartObject();
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayDetails);
                                            _writer.WriteStartArray();
                                            _writer.WriteStartObject();

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                                            _writer.WriteValue(_candidateGuid);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                                            _writer.WriteValue(Convert.ToUInt64(_dataTable.Rows[0]["payment_gateway_type_id"]));
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                                            _writer.WriteValue(Convert.ToString(_dataTable.Rows[0]["payment_gateway_type_id"]));
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OnlinePayment);
                                            _writer.WriteValue(true);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                                            _writer.WriteValue(_razorpay_order_id);
                                            _writer.WritePropertyName("key");
                                            _writer.WriteValue(key);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FeeAmount);
                                            _writer.WriteValue(Convert.ToUInt64(_dataSet.Tables[1].Rows[0]["fee_amount"]));
                                            _writer.WritePropertyName(ApplicationDatabaseConstants.ColumnNames.FirstName);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]));
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]));
                                            _writer.WritePropertyName(ApplicationDatabaseConstants.ColumnNames.MobileNumber);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]));
                                            _writer.WritePropertyName("productinfo");
                                            _writer.WriteValue("Registration");
                                            _writer.WritePropertyName(ApplicationDatabaseConstants.ColumnNames.LastName);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["last_name"]));
                                            _writer.WritePropertyName(ApplicationDatabaseConstants.ColumnNames.ReturnURL);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"]));

                                            _writer.WriteEndObject();
                                            _writer.WriteEndArray();
                                            _writer.WriteEndObject();
                                        }

                                        _jsonReturn = _sw.ToString();
                                        _writer = null;
                                        _functionReturn.Status = true;
                                    }
                                }
                                if (!_success)
                                {
                                    _success = false;
                                    _mytransaction?.Rollback();
                                }
                                else
                                {
                                    _functionReturn = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, "Payment Requested.");
                                    _mytransaction?.Commit();
                                }
                            }
                            else
                                _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInFetchingRecord, _methodName);
                        }
                    }
                    else
                    {
                        //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                        Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                            {
                            { ApplicationDatabaseConstants.ColumnNames.CandidateGuid, (ApplicationJsonReturnConstants.PropertyNames.CandidateGuid, DatabaseConstants.DataTypes.String) },
                            { ApplicationDatabaseConstants.ColumnNames.FirstName, (ApplicationJsonReturnConstants.PropertyNames.FirstName, DatabaseConstants.DataTypes.String) },
                            { ApplicationDatabaseConstants.ColumnNames.LastName, (ApplicationJsonReturnConstants.PropertyNames.LastName, DatabaseConstants.DataTypes.String) },
                            { ApplicationDatabaseConstants.ColumnNames.Email, (ApplicationJsonReturnConstants.PropertyNames.Email, DatabaseConstants.DataTypes.String) },
                            { ApplicationDatabaseConstants.ColumnNames.MobileNumber, (ApplicationJsonReturnConstants.PropertyNames.Email, DatabaseConstants.DataTypes.String) },
                            { ApplicationDatabaseConstants.ColumnNames.FeeAmount, (ApplicationJsonReturnConstants.PropertyNames.FeeAmount, DatabaseConstants.DataTypes.String)},
                            { ApplicationDatabaseConstants.ColumnNames.PaymentGatewayTypeId, (ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId, DatabaseConstants.DataTypes.String) },
                            { ApplicationDatabaseConstants.ColumnNames.OnlinePayment, (ApplicationJsonReturnConstants.PropertyNames.OnlinePayment, DatabaseConstants.DataTypes.Boolean)}
                            };
                        (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayDetails, _dictionary, _stats.CacheCheckTime);
                    }
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
        ///   Get Exam via http request
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentInfoListListAsync(Payments _payments)
        {
            return Task.Run(() => GetPaymentInfoList(_payments));
        }

        /// <summary>
        /// Get Bank By ID
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetPaymentStatus(TimeSpan _cachecheckTime, string _candidateGuid, string _registrationsGuid)
        {
            #region Local Variables
            string _methodName = "PaymentGatewayFunctions:GetPaymentStatus";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            string _order_id = "";
            string _txn_status = "";
            string _bank_txn_id = "";
            DateTime _loopStart;
            DateTime _loopEnd;
            TimeSpan _loopTime;
            #endregion

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    _registrationsGuid = Sanitization.Sanitize(_registrationsGuid);
                    _candidateGuid = Sanitization.Sanitize(_candidateGuid);
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);
                    _dataTable = new DataTable();
                    _sqlconnTime = new TimeSpan();
                    _queryTime = new TimeSpan();
                    _loopStart = DateTime.Now;

                    _writer.WriteStartObject();
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentStatus);
                    _writer.WriteStartObject();

                    _sqlQuery.Clear();
                    _sqlQuery.Append("SELECT PGT.request_table_name,PGT.response_table_name,PGT.code");
                    _sqlQuery.Append(" FROM registration_to_payment_gateways RTPG");
                    _sqlQuery.Append(" INNER JOIN payment_gateway_types PGT ON PGT.id=RTPG.payment_gateway_type_id");
                    _sqlQuery.Append(" WHERE RTPG.registration_guid='" + _registrationsGuid + "';");
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                    {
                        _sqlQuery.Clear();
                        if (Convert.ToString(_dataTable.Rows[0]["code"]).ToUpper() == "PAYTM")
                        {
                            _sqlQuery.Append("SELECT presd.order_id, presd.txn_id, presd.txn_status");
                            _sqlQuery.Append(" FROM " + Convert.ToString(_dataTable.Rows[0]["response_table_name"]) + " presd");
                            _sqlQuery.Append(" JOIN " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " preqd ON preqd.order_id=presd.order_id");
                            _sqlQuery.Append(" WHERE preqd.registration_guid='" + _registrationsGuid + "' AND preqd.candidate_guid='" + _candidateGuid + "'");
                            _sqlQuery.Append(" ORDER BY presd.order_id DESC LIMIT 1;");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            _order_id = _dataTable.Rows[0]["order_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["order_id"]);
                            _bank_txn_id = _dataTable.Rows[0]["txn_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["txn_id"]);
                            _txn_status = _dataTable.Rows[0]["txn_status"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["txn_status"]);
                            if (_txn_status.ToUpper() == "TXN_FAILURE")
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "TXN_SUCCESS")
                                _txn_status = "SUCCESS";
                            else
                                _txn_status = "FAILED";

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(_bank_txn_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);

                        }

                        else if (Convert.ToString(_dataTable.Rows[0]["code"]).ToUpper() == "PAYUMONEY")
                        {
                            _sqlQuery.Append("SELECT presd.order_id, presd.payumoney_id txn_id, preqd.txn_status");
                            _sqlQuery.Append(" FROM " + Convert.ToString(_dataTable.Rows[0]["response_table_name"]) + " presd");
                            _sqlQuery.Append(" JOIN " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " preqd ON preqd.order_id=presd.order_id");
                            _sqlQuery.Append(" WHERE preqd.registration_guid='" + _registrationsGuid + "' AND preqd.candidate_guid='" + _candidateGuid + "'");
                            _sqlQuery.Append(" ORDER BY presd.order_id DESC LIMIT 1;");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            _order_id = _dataTable.Rows[0]["order_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["order_id"]);
                            _bank_txn_id = _dataTable.Rows[0]["txn_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["txn_id"]);
                            _txn_status = _dataTable.Rows[0]["txn_status"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["txn_status"]);

                            if (_txn_status.ToUpper() == "FAILED")
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "SUCCESS")
                                _txn_status = "SUCCESS";
                            else
                                _txn_status = "FAILED";

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(_bank_txn_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);

                        }

                        else if (Convert.ToString(_dataTable.Rows[0]["code"]).ToUpper() == "RAZORPAY")
                        {
                            _sqlQuery.Append("SELECT presd.razorpay_payment_id, presd.razorpay_order_id, presd.txn_status");
                            _sqlQuery.Append(" FROM " + Convert.ToString(_dataTable.Rows[0]["response_table_name"]) + " presd");
                            _sqlQuery.Append(" JOIN " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " preqd ON preqd.order_id=presd.order_id");
                            _sqlQuery.Append(" WHERE preqd.registration_guid='" + _registrationsGuid + "' AND preqd.candidate_guid='" + _candidateGuid + "'");
                            _sqlQuery.Append(" ORDER BY presd.order_id DESC LIMIT 1;");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            if (_dataTable.Rows.Count > 0)
                            {
                                _order_id = _dataTable.Rows[0]["razorpay_order_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["razorpay_order_id"]);
                                _bank_txn_id = _dataTable.Rows[0]["razorpay_payment_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["razorpay_payment_id"]);
                                _txn_status = _dataTable.Rows[0]["txn_status"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["txn_status"]);
                            }
                            if (string.IsNullOrEmpty(_txn_status))
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "TXN_FAILURE")
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "TXN_SUCCESS")
                                _txn_status = "SUCCESS";
                            else
                                _txn_status = "FAILED";

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(_bank_txn_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);
                        }

                        else if (Convert.ToString(_dataTable.Rows[0]["code"]).ToUpper() == "SBI COLLECT")
                        {
                            _sqlQuery.Append("SELECT status FROM payment_sbicollect_detail WHERE candidate_guid='" + _candidateGuid + "';");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            if (_dataTable.Rows.Count > 0)
                                _txn_status = _dataTable.Rows[0]["status"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["status"]);

                            if (string.IsNullOrEmpty(_txn_status))
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "0")
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "1")
                                _txn_status = "SUCCESS";
                            else
                                _txn_status = "FAILED";

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);
                        }
                        else if (Convert.ToString(_dataTable.Rows[0]["code"]).ToUpper() == "CHALLAN")
                        {
                            _sqlQuery.Append("SELECT status FROM payment_challan_detail WHERE candidate_guid='" + _candidateGuid + "';");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            if (_dataTable.Rows.Count > 0)
                                _txn_status = _dataTable.Rows[0]["status"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["status"]);

                            if (string.IsNullOrEmpty(_txn_status))
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "0")
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "1")
                                _txn_status = "SUCCESS";
                            else
                                _txn_status = "FAILED";

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);
                        }
                        else if (Convert.ToString(_dataTable.Rows[0]["code"]).ToUpper() == "CHEQUE/DD")
                        {
                            _sqlQuery.Append("SELECT status FROM payment_cheque_detail WHERE candidate_guid='" + _candidateGuid + "';");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            if (_dataTable.Rows.Count > 0)
                                _txn_status = _dataTable.Rows[0]["status"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["status"]);

                            if (string.IsNullOrEmpty(_txn_status))
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "0")
                                _txn_status = "FAILED";
                            else if (_txn_status.ToUpper() == "1")
                                _txn_status = "SUCCESS";
                            else
                                _txn_status = "FAILED";

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);
                        }
                    }
                    _writer.WriteEndObject();//payment status end

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();

                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.CacheCheckTime);
                    _writer.WriteValue(_cachecheckTime.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WriteEndObject();
                    _writer.WriteEndObject();

                    _jsonReturn = _sw.ToString();

                    //dispose objects
                    _sw.Dispose();
                    _writer = null;
                    _functionReturn.Status = true;
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Get Bank By ID Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentStatusAsync(TimeSpan _cachecheckTime, string _candidateGuid, string _registrationsGuid)
        {
            return Task.Run(() => GetPaymentStatus(_cachecheckTime, _candidateGuid, _registrationsGuid));
        }

        /// <summary>
        ///  Payment Gateway Details 
        /// </summary>
        /// <param name="_registrationGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddPayment(string _registrationGuid, string _candidateGuid)
        {
            string _methodName = "PaymentGatewayFunctions:AddPayment";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            DataTable _dataTable = null;
            DataSet _dataSet = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            #region Local Variables   
            bool _success = true;
            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            DateTime _queryStart;
            StringWriter _sw = new StringWriter(); ;
            JsonTextWriter _writer = new JsonTextWriter(_sw);
            string _jsonReturn = string.Empty;
            int _rowsAffected = 0;
            string _paymentGatewayTypeId = string.Empty;
            #endregion
            //Initiate Default Function Settings
            string _errorMessage = "";
            _functionReturn = new FunctionReturn();

            _registrationGuid = Sanitization.Sanitize(_registrationGuid);
            _candidateGuid = Sanitization.Sanitize(_candidateGuid);

            if (string.IsNullOrEmpty(_registrationGuid))
                _errorMessage = ApplicationConstants.ValidationMessages.RegistrationGUIDRequired;
            else if (string.IsNullOrEmpty(_candidateGuid))
                _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;

            //Initiate Default Function Settings           
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
            else
            {
                try
                {
                    try
                    {
                        _sqlConnectionString = _databaseSettings.MySqlConnection;
                        using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                        {
                            _mySqlCommand = new MySqlCommand();
                            _mySqlCommand.CommandTimeout = _databaseSettings.MySqlTimeout;

                            // Open connection;
                            _sqlconnStart = DateTime.Now;
                            _mySqlConnection.Open();

                            _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                            _mySqlCommand.Connection = _mySqlConnection;
                            _mySqlCommand.Transaction = _mytransaction;

                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append("SELECT payment_gateway_type_id ");
                            _sqlQuery.Append("FROM registration_to_payment_gateways ");
                            _sqlQuery.Append("WHERE registration_guid='" + _registrationGuid + "';");

                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                            if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                            {
                                _paymentGatewayTypeId = _dataTable.Rows[0]["payment_gateway_type_id"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["payment_gateway_type_id"]);
                            }

                            _sqlQuery.Clear();
                            _sqlQuery.Append("SELECT id,name,code,description,info_table_name,status,request_table_name,response_table_name FROM payment_gateway_types WHERE id=" + (string.IsNullOrEmpty(_paymentGatewayTypeId) ? "1" : _paymentGatewayTypeId) + " AND status<>2;");

                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                            {
                                if (Convert.ToString(_dataTable.Rows[0]["code"]) == "PAYTM")
                                {
                                    _sqlQuery.Clear();
                                    _sqlQuery.Append("SELECT registration_pay_gateway_id,mid,merchant_key,channel_id,bank_name,return_url,paytm_url,app_url,web_site,industry_type,status FROM " + Convert.ToString(_dataTable.Rows[0]["info_table_name"]) + ";");

                                    _sqlQuery.Append("SELECT d.candidate_guid, max(if(c.name='NgxIxcheckFirstname',d.datavalue,null)) as first_name, max(if(c.name='NgxIxcheckLastname',d.datavalue,null)) as last_name, max(if(c.name='NgxIxcheckEmail',d.datavalue,null)) as email, max(if(c.name='NgxIxcheckMobilenumber',d.datavalue,null)) AS mobile_number, rml.fee_amount ");
                                    _sqlQuery.Append(" FROM components_main c ");
                                    _sqlQuery.Append(" JOIN data_save_main_live d on c.id=d.comp_id ");
                                    _sqlQuery.Append(" JOIN registration_main_live rml on rml.candidate_guid = d.candidate_guid ");
                                    _sqlQuery.Append(" WHERE d.candidate_guid='" + _candidateGuid + "' AND rml.registration_guid='" + _registrationGuid + "';");

                                    (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                                    if (_functionReturn.Status && _dataSet.Tables.Count > 1 && _dataSet.Tables[0].Rows.Count > 0 && _dataSet.Tables[1].Rows.Count > 0)
                                    {
                                        _sqlQuery.Clear();
                                        _sqlQuery.Append("INSERT INTO " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " (");
                                        _sqlQuery.Append("`registration_guid`");
                                        _sqlQuery.Append(",`email`");
                                        _sqlQuery.Append(",`name`");
                                        _sqlQuery.Append(",`mobile_number`");
                                        _sqlQuery.Append(",`fee_amount` ");
                                        _sqlQuery.Append(",`request_datetime`");
                                        _sqlQuery.Append(",`payment_gateway_id`");
                                        _sqlQuery.Append(",`candidate_guid`");
                                        _sqlQuery.Append(", `status` ");
                                        _sqlQuery.Append(") VALUES (");
                                        _sqlQuery.Append("'" + _registrationGuid + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]) + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]) + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]) + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]) + "'");
                                        _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                                        _sqlQuery.Append("," + _paymentGatewayTypeId);
                                        _sqlQuery.Append(",'" + _candidateGuid + "'");
                                        _sqlQuery.Append(",'1'");
                                        _sqlQuery.Append(");");
                                        //Call Function    
                                        _sqlQuery.Append("SELECT LAST_INSERT_ID(); ");
                                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                        _queryStart = DateTime.Now;
                                        UInt64 _orderId = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                        if (_orderId <= 0)
                                            _success = false;

                                        string _paytmUrl = Convert.ToString(_dataSet.Tables[0].Rows[0]["paytm_url"]) + _orderId;

                                        Dictionary<string, string> parameters = new Dictionary<string, string>();
                                        parameters.Add("MID", Convert.ToString(_dataSet.Tables[0].Rows[0]["mid"]));
                                        parameters.Add("CHANNEL_ID", Convert.ToString(_dataSet.Tables[0].Rows[0]["channel_id"]));
                                        parameters.Add("INDUSTRY_TYPE_ID", Convert.ToString(_dataSet.Tables[0].Rows[0]["industry_type"]));
                                        parameters.Add("WEBSITE", Convert.ToString(_dataSet.Tables[0].Rows[0]["web_site"]));
                                        parameters.Add("EMAIL", Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]));
                                        parameters.Add("MOBILE_NO", Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]));
                                        parameters.Add("CUST_ID", _candidateGuid);
                                        parameters.Add("ORDER_ID", Convert.ToString(_orderId));
                                        parameters.Add("TXN_AMOUNT", Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]));
                                        parameters.Add("CALLBACK_URL", Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"])); //This parameter is not mandatory. Use this to pass the callback url dynamically.
                                        string _checksum = CheckSum.generateCheckSum(Convert.ToString(_dataSet.Tables[0].Rows[0]["merchant_key"]), parameters);

                                        // create json

                                        if (_success)
                                        {
                                            _writer.WriteStartObject();
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayDetails);
                                            _writer.WriteStartObject();
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                                            _writer.WriteValue("PAYTM");
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CheckSum);
                                            _writer.WriteValue(_checksum);

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentUrl);
                                            _writer.WriteValue(_paytmUrl);

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Mid);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["mid"]));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ChannelId);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["channel_id"]));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.IndustryType);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["industry_type"]));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.WebSite);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["web_site"]));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Mobile);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CustomerId);
                                            _writer.WriteValue(_candidateGuid);

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                                            _writer.WriteValue(Convert.ToString(_orderId));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TaxAmount);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]));

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CallbackUrl);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"]));

                                            _writer.WriteEndObject();
                                            _writer.WriteEndObject();
                                        }

                                        _jsonReturn = _sw.ToString();
                                        _writer = null;
                                        _functionReturn.Status = true;

                                        //GET DATA
                                        _sqlQuery.Clear();
                                        _sqlQuery.Append("UPDATE " + Convert.ToString(_dataTable.Rows[0]["request_table_name"] + " SET"));
                                        _sqlQuery.Append("`pay_detail`='" + _jsonReturn + "'");
                                        _sqlQuery.Append(",`check_sum_hash`='" + _checksum + "'");
                                        _sqlQuery.Append(" WHERE order_id='" + _orderId + "';");
                                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                        _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                        if (_rowsAffected <= 0)
                                            _success = false;
                                        if (string.IsNullOrEmpty(_checksum))
                                        {
                                            _success = false;
                                            _mytransaction?.Rollback();
                                        }
                                        else
                                        {
                                            var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, "Payment Requested.");
                                            _mytransaction?.Commit();
                                        }
                                    }
                                    else
                                        _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInFetchingRecord, _methodName);
                                }

                                else if (Convert.ToString(_dataTable.Rows[0]["code"]) == "PAYUMONEY")
                                {
                                    _sqlQuery.Clear();
                                    //_sqlQuery.Append("SELECT registration_pay_gateway_id,pay_gateway_environment_id,merchant_key,merchant_salt,auth_header,payment_url,return_url,status FROM " + "payment_gateway_payumoney" + " WHERE status=1;");
                                    _sqlQuery.Append("SELECT registration_pay_gateway_id,pay_gateway_environment_id,merchant_key,merchant_salt,auth_header,payment_url,return_url,status FROM " + Convert.ToString(_dataTable.Rows[0]["info_table_name"]) + " WHERE status=1;");

                                    _sqlQuery.Append("SELECT d.candidate_guid, max(if(c.name='NgxIxcheckFirstname',d.datavalue,null)) as first_name, max(if(c.name='NgxIxcheckLastname',d.datavalue,null)) as last_name, max(if(c.name='NgxIxcheckEmail',d.datavalue,null)) as email, max(if(c.name='NgxIxcheckMobilenumber',d.datavalue,null)) AS mobile_number, rml.fee_amount ");
                                    _sqlQuery.Append(" FROM components_main c ");
                                    _sqlQuery.Append(" JOIN data_save_main_live d on c.id=d.comp_id ");
                                    _sqlQuery.Append(" JOIN registration_main_live rml on rml.candidate_guid = d.candidate_guid ");
                                    _sqlQuery.Append(" WHERE d.candidate_guid='" + _candidateGuid + "' AND rml.registration_guid='" + _registrationGuid + "';");

                                    (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                                    if (_functionReturn.Status && _dataSet.Tables.Count > 1 && _dataSet.Tables[0].Rows.Count > 0 && _dataSet.Tables[1].Rows.Count > 0)
                                    {
                                        _sqlQuery.Clear();
                                        _sqlQuery.Append("INSERT INTO " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " (");
                                        //_sqlQuery.Append("INSERT INTO payumoney_request_detail(");
                                        _sqlQuery.Append("`registration_guid`");
                                        _sqlQuery.Append(",`email`");
                                        _sqlQuery.Append(",`name`");
                                        _sqlQuery.Append(",`mobile_number`");
                                        _sqlQuery.Append(",`fee_amount` ");
                                        _sqlQuery.Append(",`request_datetime`");
                                        _sqlQuery.Append(",`payment_gateway_id`");
                                        _sqlQuery.Append(",`candidate_guid`");
                                        _sqlQuery.Append(", `status` ");
                                        _sqlQuery.Append(", `product_info` ");
                                        _sqlQuery.Append(") VALUES (");
                                        _sqlQuery.Append("'" + _registrationGuid + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]) + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]) + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]) + "'");
                                        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]) + "'");
                                        _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                                        _sqlQuery.Append("," + _paymentGatewayTypeId);
                                        _sqlQuery.Append(",'" + _candidateGuid + "'");
                                        _sqlQuery.Append(",'1'");
                                        _sqlQuery.Append(",'Registration'");
                                        _sqlQuery.Append(");");
                                        //Call Function    
                                        _sqlQuery.Append("SELECT LAST_INSERT_ID(); ");
                                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                        _queryStart = DateTime.Now;
                                        UInt64 _orderId = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                        if (_orderId <= 0)
                                            _success = false;

                                        string _paymentUrl = Convert.ToString(_dataSet.Tables[0].Rows[0]["payment_url"]);

                                        Dictionary<string, string> parameters = new Dictionary<string, string>();
                                        parameters.Add("MERCHANT_KEY", Convert.ToString(_dataSet.Tables[0].Rows[0]["merchant_key"]));
                                        parameters.Add("MERCHANT_SALT", Convert.ToString(_dataSet.Tables[0].Rows[0]["merchant_salt"]));
                                        parameters.Add("NAME", Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]));
                                        parameters.Add("EMAIL", Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]));
                                        parameters.Add("MOBILE_NO", Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]));
                                        parameters.Add("ORDER_ID", Convert.ToString(_orderId));
                                        parameters.Add("TXN_AMOUNT", Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]));
                                        parameters.Add("CALLBACK_URL", Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"])); //This parameter is not mandatory. Use this to pass the callback url dynamically.
                                        string _checksumHash = ApplicationCommonFunctions.PAYUMONEYCheckSum(parameters);
                                        Hashtable data = new Hashtable();
                                        data.Add("hash", _checksumHash);
                                        data.Add("txnid", _orderId);
                                        data.Add("key", Convert.ToString(_dataSet.Tables[0].Rows[0]["merchant_key"]));
                                        data.Add("amount", Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]));
                                        data.Add("firstname", Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]));
                                        data.Add("email", Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]));
                                        data.Add("phone", Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]));
                                        data.Add("productinfo", "Registration");
                                        data.Add("surl", Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"]));
                                        data.Add("furl", Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"]));
                                        data.Add("lastname", Convert.ToString(_dataSet.Tables[1].Rows[0]["last_name"]));
                                        data.Add("curl", string.Empty);
                                        data.Add("address1", string.Empty);
                                        data.Add("address2", string.Empty);
                                        data.Add("city", string.Empty);
                                        data.Add("state", string.Empty);
                                        data.Add("country", string.Empty);
                                        data.Add("zipcode", string.Empty);
                                        data.Add("udf1", string.Empty);
                                        data.Add("udf2", string.Empty);
                                        data.Add("udf3", string.Empty);
                                        data.Add("udf4", string.Empty);
                                        data.Add("udf5", string.Empty);
                                        data.Add("service_provider", "payu_paisa");
                                        data.Add("pg", string.Empty);
                                        string _strForm = ApplicationCommonFunctions.PreparePOSTForm(_paymentUrl, data);
                                        // create json
                                        if (_success)
                                        {
                                            _writer.WriteStartObject();//main object
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayDetails);
                                            _writer.WriteStartObject();
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                                            _writer.WriteValue("PAYUMONEY");
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentUrl);
                                            _writer.WriteValue(_paymentUrl);
                                            _writer.WritePropertyName("hash");
                                            _writer.WriteValue(_checksumHash);
                                            _writer.WritePropertyName("txnid");
                                            _writer.WriteValue(_orderId);
                                            _writer.WritePropertyName("key");
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["merchant_key"]));
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Amount);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]));
                                            _writer.WritePropertyName("firstname");
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]));
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]));
                                            _writer.WritePropertyName("phone");
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]));
                                            _writer.WritePropertyName("productinfo");
                                            _writer.WriteValue("Registration");
                                            _writer.WritePropertyName("surl");
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"]));
                                            _writer.WritePropertyName("furl");
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"]));
                                            _writer.WritePropertyName("lastname");
                                            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["last_name"]));
                                            _writer.WritePropertyName("curl");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("address1");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("address2");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("city");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("state");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("country");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("zipcode");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("udf1");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("udf2");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("udf3");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("udf4");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("udf5");
                                            _writer.WriteValue(string.Empty);
                                            _writer.WritePropertyName("service_provider");
                                            _writer.WriteValue("payu_paisa");
                                            _writer.WritePropertyName("pg");
                                            _writer.WriteValue(string.Empty);

                                            _writer.WriteEndObject();

                                            _writer.WriteEndObject();//main object
                                        }

                                        _jsonReturn = _sw.ToString();
                                        _writer = null;
                                        _functionReturn.Status = true;

                                        //GET DATA
                                        _sqlQuery.Clear();
                                        //_sqlQuery.Append("UPDATE payumoney_request_detail SET");
                                        _sqlQuery.Append("UPDATE " + Convert.ToString(_dataTable.Rows[0]["request_table_name"] + " SET"));
                                        _sqlQuery.Append(" `check_sum_hash`='" + _checksumHash + "'");
                                        _sqlQuery.Append(" WHERE order_id='" + _orderId + "';");
                                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                        _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                        if (_rowsAffected <= 0)
                                            _success = false;
                                        if (string.IsNullOrEmpty(_checksumHash))
                                        {
                                            _success = false;
                                            _mytransaction?.Rollback();
                                        }
                                        else
                                        {
                                            var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, "Payment Requested.");
                                            _mytransaction?.Commit();
                                        }
                                    }
                                    else
                                        _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInFetchingRecord, _methodName);
                                }

                                //else if (Convert.ToString(_dataTable.Rows[0]["code"]) == "RAZORPAY")
                                //{
                                //    _sqlQuery.Clear();
                                //    //_sqlQuery.Append("SELECT registration_pay_gateway_id,pay_gateway_environment_id,merchant_key,merchant_salt,auth_header,payment_url,return_url,status FROM " + "payment_gateway_payumoney" + " WHERE status=1;");
                                //    _sqlQuery.Append("SELECT registration_pay_gateway_id,pay_gateway_environment_id,key_id,key_secret,bank_name,return_url,status FROM " + Convert.ToString(_dataTable.Rows[0]["info_table_name"]) + " WHERE status=1;");

                                //    _sqlQuery.Append("SELECT d.candidate_guid, max(if(c.name='NgxIxcheckFirstname',d.datavalue,null)) as first_name, max(if(c.name='NgxIxcheckLastname',d.datavalue,null)) as last_name, max(if(c.name='NgxIxcheckEmail',d.datavalue,null)) as email, max(if(c.name='NgxIxcheckMobilenumber',d.datavalue,null)) AS mobile_number, rml.fee_amount ");
                                //    _sqlQuery.Append(" FROM components_main c ");
                                //    _sqlQuery.Append(" JOIN data_save_main_live d on c.id=d.comp_id ");
                                //    _sqlQuery.Append(" JOIN registration_main_live rml on rml.candidate_guid = d.candidate_guid ");
                                //    _sqlQuery.Append(" WHERE d.candidate_guid='" + _candidateGuid + "' AND rml.registration_guid='" + _registrationGuid + "';");

                                //    (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                                //    if (_functionReturn.Status && _dataSet.Tables.Count > 1 && _dataSet.Tables[0].Rows.Count > 0 && _dataSet.Tables[1].Rows.Count > 0)
                                //    {
                                //        _sqlQuery.Clear();
                                //        _sqlQuery.Append("INSERT INTO " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " (");
                                //        //_sqlQuery.Append("INSERT INTO payumoney_request_detail(");
                                //        _sqlQuery.Append("`registration_guid`");
                                //        _sqlQuery.Append(",`email`");
                                //        _sqlQuery.Append(",`name`");
                                //        _sqlQuery.Append(",`mobile_number`");
                                //        _sqlQuery.Append(",`fee_amount` ");
                                //        _sqlQuery.Append(",`request_datetime`");
                                //        _sqlQuery.Append(",`payment_gateway_id`");
                                //        _sqlQuery.Append(",`candidate_guid`");
                                //        _sqlQuery.Append(", `status` ");
                                //        _sqlQuery.Append(", `product_info` ");
                                //        _sqlQuery.Append(") VALUES (");
                                //        _sqlQuery.Append("'" + _registrationGuid + "'");
                                //        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]) + "'");
                                //        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]) + "'");
                                //        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]) + "'");
                                //        _sqlQuery.Append(",'" + Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]) + "'");
                                //        _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                                //        _sqlQuery.Append("," + _paymentGatewayTypeId);
                                //        _sqlQuery.Append(",'" + _candidateGuid + "'");
                                //        _sqlQuery.Append(",'1'");
                                //        _sqlQuery.Append(",'Registration'");
                                //        _sqlQuery.Append(");");
                                //        //Call Function    
                                //        _sqlQuery.Append("SELECT LAST_INSERT_ID(); ");
                                //        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                //        _queryStart = DateTime.Now;
                                //        UInt64 _orderId = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                //        if (_orderId <= 0)
                                //            _success = false;

                                //        string orderId;
                                //        Dictionary<string, object> input = new Dictionary<string, object>();
                                //        input.Add("amount", Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"])); // this amount should be same as transaction amount
                                //        input.Add("currency", "INR");
                                //        input.Add("receipt", _orderId.ToString());
                                //        input.Add("payment_capture", 1);

                                //        string key = Convert.ToString(_dataSet.Tables[0].Rows[0]["key_id"]);
                                //        string secret = Convert.ToString(_dataSet.Tables[0].Rows[0]["key_secret"]);

                                //        RazorpayClient client = new RazorpayClient(key, secret);
                                //        System.Net.ServicePointManager.SecurityProtocol = (System.Net.SecurityProtocolType)3072;
                                //        Razorpay.Api.Order order = client.Order.Create(input);
                                //        orderId = order["id"].ToString();

                                //        StringBuilder frmScript = new StringBuilder();

                                //        frmScript.Append("<form action = '" + Convert.ToString(_dataSet.Tables[0].Rows[0]["return_url"]) + "' method = 'post'>");
                                //        frmScript.Append("<script ");
                                //        frmScript.Append(" src = 'https://checkout.razorpay.com/v1/checkout.js'");
                                //        frmScript.Append(" data-key = 'rzp_test_g2A5EeqD5agULH'");
                                //        frmScript.Append(" data-amount = '" + Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]) + "'");
                                //        frmScript.Append(" data-name = 'Razorpay'");
                                //        frmScript.Append(" data-description = 'Purchase Description'");
                                //        frmScript.Append(" data-order_id = '" + orderId + "'");
                                //        frmScript.Append(" data-image = 'https://razorpay.com/favicon.png'");
                                //        frmScript.Append(" data-prefill.name = '" + Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]) + "'");
                                //        frmScript.Append(" data-prefill.email = '" + Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]) + "'");
                                //        frmScript.Append(" data-prefill.contact = '" + Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]) + "'");
                                //        frmScript.Append(" data-theme.color = '#F37254'");
                                //        frmScript.Append(" ></script>");
                                //        frmScript.Append("<input type = 'hidden' value = 'Hidden Element' name = 'hidden' />");
                                //        frmScript.Append("</form>");

                                //        // create json
                                //        if (_success)
                                //        {
                                //            _writer.WriteStartObject();//main object
                                //            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayDetails);
                                //            _writer.WriteStartObject();
                                //            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                                //            _writer.WriteValue("RAZORPAY");
                                //            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentUrl);
                                //            _writer.WriteValue("");
                                //            _writer.WritePropertyName("hash");
                                //            _writer.WriteValue(frmScript.ToString());
                                //            _writer.WritePropertyName("txnid");
                                //            _writer.WriteValue(_orderId);
                                //            _writer.WritePropertyName("key");
                                //            _writer.WriteValue(key);
                                //            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Amount);
                                //            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["fee_amount"]));
                                //            _writer.WritePropertyName("firstname");
                                //            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["first_name"]));
                                //            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                                //            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["email"]));
                                //            _writer.WritePropertyName("phone");
                                //            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["mobile_number"]));
                                //            _writer.WritePropertyName("productinfo");
                                //            _writer.WriteValue("Registration");
                                //            _writer.WritePropertyName("lastname");
                                //            _writer.WriteValue(Convert.ToString(_dataSet.Tables[1].Rows[0]["last_name"]));
                                //            _writer.WriteEndObject();
                                //            _writer.WriteEndObject();//main object
                                //        }

                                //        _jsonReturn = _sw.ToString();
                                //        _writer = null;
                                //        _functionReturn.Status = true;

                                //        //GET DATA
                                //        //_sqlQuery.Clear();
                                //        ////_sqlQuery.Append("UPDATE payumoney_request_detail SET");
                                //        //_sqlQuery.Append("UPDATE " + Convert.ToString(_dataTable.Rows[0]["request_table_name"] + " SET"));
                                //        //_sqlQuery.Append(" `description`='" + frmScript.ToString() + "'");
                                //        //_sqlQuery.Append(" WHERE order_id='" + _orderId + "';");
                                //        //_mySqlCommand.CommandText = _sqlQuery.ToString();
                                //        //_rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                //        //if (_rowsAffected <= 0)
                                //        //    _success = false;
                                //        if (string.IsNullOrEmpty(frmScript.ToString()))
                                //        {
                                //            _success = false;
                                //            _mytransaction?.Rollback();
                                //        }
                                //        else
                                //        {
                                //            var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, "Payment Requested.");
                                //            _mytransaction?.Commit();
                                //        }
                                //    }
                                //    else
                                //        _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInFetchingRecord, _methodName);
                                //}

                                else
                                    _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.PaymentGatewayNotFound, _methodName);
                            }
                            else
                                _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInFetchingRecord, _methodName);

                            //GET DATA

                        }
                    }
                    catch (Exception ex)
                    {
                        _mytransaction?.Rollback();
                        _success = false;
                        CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                        _functionReturn = CommonFunctions.SystemError(_errorMessage, _methodName);
                    }
                }
                catch (Exception ex)
                {
                    ///ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(_errorMessage, _methodName);
                }
                finally
                {
                    //Cleanup
                    _mySqlCommand?.Dispose();
                    if (_mySqlConnection != null && _mySqlConnection.State != System.Data.ConnectionState.Closed)
                    {
                        _mySqlConnection?.Close();
                        _mySqlConnection = null;
                    }
                    _mytransaction = null;
                    _mySqlCommand = null;
                    _sqlQuery = null;
                    _sqlConnectionString = string.Empty;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// BadDebts Types List Async
        /// </summary>
        /// <param name="_registrationGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddPaymentAsync(string _registrationGuid, string _candidateGuid)
        {
            return Task.Run(() => AddPayment(_registrationGuid, _candidateGuid));
        }

        /// <summary>
        /// Get payment response list
        /// </summary>
        /// <param name="_cachecheckTime"></param>
        /// <param name="_candidateGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetPaymentResponseList(TimeSpan _cachecheckTime, string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "PaymentGatewayFunctions:GetPaymentResponseList";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            UInt64 __id = 0;
            string _order_id = "";
            string _payment_mode = "";
            string _currency = "";
            double _txn_amount = 0;
            string _response_msg = "";
            string _response_code = "";
            string _txn_date = "";
            string _txn_status = "";
            string _gateway_name = "";
            string _bank_txn_id = "";
            string _bank_name = "";
            string _exam_type = "";
            string _exam_number = "";
            string _exam_code = "";
            string _exam_name = "";
            string _first_name = "";
            string _middle_name = "";
            string _last_name = "";
            string _father_name = "";
            string _mobile_number = "";
            string _email = "";
            string _address = "";
            string _city = "";
            string _state = "";
            string _pincode = "";
            int _online_payment = 0;
            string _gatway_code = string.Empty;
            string _challan_number = "";
            string _cheque_dd_number = "";
            string _mode_cheque_dd = "";
            string _razorpay_order_id = "";
            string _razorpay_payment_id = "";
            string _razorpay_singnature = "";
            UInt64 _payment_gateway_type_id = 0;
            DateTime _loopStart;
            DateTime _loopEnd;
            TimeSpan _loopTime;
            #endregion

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _dataTable = new DataTable();
                    _sqlconnTime = new TimeSpan();
                    _queryTime = new TimeSpan();
                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaytmResponse);
                    _writer.WriteStartArray();

                    _sqlQuery.Clear();
                    _sqlQuery.Append("SELECT PGT.request_table_name,PGT.response_table_name,PGT.code, RTPG.payment_gateway_type_id");
                    _sqlQuery.Append(" FROM registration_to_payment_gateways RTPG");
                    _sqlQuery.Append(" INNER JOIN payment_gateway_types PGT ON PGT.id=RTPG.payment_gateway_type_id;");
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    _gatway_code = Convert.ToString(_dataTable.Rows[0]["code"]);
                    //_gatway_code = "CHEQUE/DD";
                    _payment_gateway_type_id = _dataTable.Rows[0]["payment_gateway_type_id"] == DBNull.Value ? 0 : Convert.ToUInt64(_dataTable.Rows[0]["payment_gateway_type_id"]);

                    if (_functionReturn.Status && _dataTable.Rows.Count > 0 && _gatway_code.ToUpper() == "PAYTM")
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append("SELECT PRESD.id, PRESD.order_id,PRESD.txn_amount,PRESD.payment_mode,PRESD.currency ,  PRESD.response_code,PRESD.gateway_name,PRESD.bank_txn_id,PRESD.bank_name,PRESD.response_msg,  PRESD.txn_date,PRESD.txn_status,");
                        _sqlQuery.Append(" 1 as online_payment, PREQD.candidate_guid,GROUP_CONCAT(ESM.exam_type SEPARATOR ' , ') exam_type,GROUP_CONCAT(ESM.exam_number SEPARATOR ' , ') exam_number,GROUP_CONCAT(ESM.code SEPARATOR ' , ') exam_code, GROUP_CONCAT(ESM.name SEPARATOR ' , ') exam_name, tbl.first_name,tbl.middle_name, tbl.last_name, tbl.father_name, tbl.mobile_number,  tbl.email, tbl.address, tbl.city, tbl.state, tbl.pincode");
                        _sqlQuery.Append(" FROM " + Convert.ToString(_dataTable.Rows[0]["response_table_name"]) + " PRESD INNER JOIN " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " PREQD ON PREQD.order_id = PRESD.order_id");
                        _sqlQuery.Append(" INNER JOIN registration_to_exam RTE ON RTE.registration_guid=PREQD.registration_guid ");
                        _sqlQuery.Append(" INNER JOIN exams_main ESM ON ESM.exam_guid = RTE.exam_guid ");
                        _sqlQuery.Append(" JOIN( ");
                        _sqlQuery.Append(" select candidate_guid, max(if (c.name = 'NgxIxcheckFirstname',dsml.datavalue,null)) as first_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMiddlename',dsml.datavalue,null)) as middle_name,  ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckLastname',dsml.datavalue,null)) as last_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckFathername',dsml.datavalue,null)) as father_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMobilenumber',dsml.datavalue,null)) as mobile_number, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckEmail',dsml.datavalue,null)) as email, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckAddress',dsml.datavalue,null)) as address, ");
                        _sqlQuery.Append(" (SELECT name FROM city_main WHERE id = max(if (c.name = 'NgxIxcheckCity',dsml.datavalue,null))) as city, ");
                        _sqlQuery.Append(" (select name from states_main WHERE id = max(if (c.name = 'NgxIxcheckState',dsml.datavalue,null))) as state,");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckPincode',dsml.datavalue,null)) as pincode ");
                        _sqlQuery.Append(" from data_save_main_live dsml ");
                        _sqlQuery.Append(" join components_main c on c.id = dsml.comp_id ");
                        _sqlQuery.Append(" where dsml.candidate_guid = '" + _candidateGuid + "' ");
                        _sqlQuery.Append(" ) tbl on tbl.candidate_guid = PREQD.candidate_guid ");
                        _sqlQuery.Append("  where PREQD.candidate_guid = '" + _candidateGuid + "' GROUP BY PREQD.order_id ORDER BY PREQD.order_id DESC;");

                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                        foreach (DataRow row in _dataTable.Rows)
                        {
                            __id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _online_payment = row["online_payment"] == DBNull.Value ? 0 : Convert.ToInt32(row["online_payment"]);
                            _order_id = row["order_id"] == DBNull.Value ? "" : Convert.ToString(row["order_id"]);
                            _txn_amount = row["txn_amount"] == DBNull.Value ? 0 : Convert.ToDouble(row["txn_amount"]);
                            _response_code = row["response_code"] == DBNull.Value ? "" : Convert.ToString(row["response_code"]);
                            _response_msg = row["response_msg"] == DBNull.Value ? "" : Convert.ToString(row["response_msg"]);
                            _payment_mode = row["payment_mode"] == DBNull.Value ? "" : Convert.ToString(row["payment_mode"]);
                            _txn_date = row["txn_date"] == DBNull.Value ? "" : Convert.ToString(row["txn_date"]);
                            _currency = row["currency"] == DBNull.Value ? "" : Convert.ToString(row["currency"]);
                            _gateway_name = row["gateway_name"] == DBNull.Value ? "" : Convert.ToString(row["gateway_name"]);
                            _bank_txn_id = row["bank_txn_id"] == DBNull.Value ? "" : Convert.ToString(row["bank_txn_id"]);
                            _bank_name = row["bank_name"] == DBNull.Value ? "" : Convert.ToString(row["bank_name"]);
                            _txn_status = row["txn_status"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);

                            _exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_number"]);
                            _exam_number = row["exam_number"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_code = row["exam_code"] == DBNull.Value ? "" : Convert.ToString(row["exam_code"]);
                            _exam_name = row["exam_name"] == DBNull.Value ? "" : Convert.ToString(row["exam_name"]);
                            _first_name = row["first_name"] == DBNull.Value ? "" : Convert.ToString(row["first_name"]);
                            _middle_name = row["middle_name"] == DBNull.Value ? "" : Convert.ToString(row["middle_name"]);
                            _last_name = row["last_name"] == DBNull.Value ? "" : Convert.ToString(row["last_name"]);
                            _father_name = row["father_name"] == DBNull.Value ? "" : Convert.ToString(row["father_name"]);
                            _mobile_number = row["mobile_number"] == DBNull.Value ? "" : Convert.ToString(row["mobile_number"]);
                            _email = row["email"] == DBNull.Value ? "" : Convert.ToString(row["email"]);
                            _address = row["address"] == DBNull.Value ? "" : Convert.ToString(row["address"]);
                            _city = row["city"] == DBNull.Value ? "" : Convert.ToString(row["city"]);
                            _state = row["state"] == DBNull.Value ? "" : Convert.ToString(row["state"]);
                            _pincode = row["pincode"] == DBNull.Value ? "" : Convert.ToString(row["pincode"]);

                            _writer.WriteStartObject();
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                            _writer.WriteValue("PAYTM");
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                            _writer.WriteValue(__id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OnlinePayment);
                            _writer.WriteValue(_online_payment);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                            _writer.WriteValue(_payment_gateway_type_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnAmount);
                            _writer.WriteValue(_txn_amount);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseCode);
                            _writer.WriteValue(_response_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseMsg);
                            _writer.WriteValue(_response_msg);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentMode);
                            _writer.WriteValue(_payment_mode);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnDate);
                            _writer.WriteValue(_txn_date);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Currency);
                            _writer.WriteValue("INR");

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GatewayName);
                            _writer.WriteValue(_gateway_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(_bank_txn_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankName);
                            _writer.WriteValue(_bank_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);


                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                            _writer.WriteValue(_candidateGuid);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamType);
                            _writer.WriteValue(_exam_type);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamCode);
                            _writer.WriteValue(_exam_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamNumber);
                            _writer.WriteValue(_exam_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamName);
                            _writer.WriteValue(_exam_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FirstName);
                            _writer.WriteValue(_first_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MiddleName);
                            _writer.WriteValue(_middle_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LastName);
                            _writer.WriteValue(_last_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FatherName);
                            _writer.WriteValue(_father_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MobileNumber);
                            _writer.WriteValue(_mobile_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                            _writer.WriteValue(_email);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Address);
                            _writer.WriteValue(_address);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.City);
                            _writer.WriteValue(_city);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                            _writer.WriteValue(_state);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pincode);
                            _writer.WriteValue(_pincode);

                            _writer.WriteEndObject();
                        }
                    }

                    else if (_functionReturn.Status && _dataTable.Rows.Count > 0 && _gatway_code.ToUpper() == "PAYUMONEY")
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append("SELECT PRESD.id,PRESD.payumoney_id, PRESD.order_id,PRESD.txn_amount,PRESD.payment_mode,PRESD.gateway_name,  PRESD.txn_date,PRESD.txn_status,");
                        _sqlQuery.Append(" 1 as online_payment,PREQD.candidate_guid,GROUP_CONCAT(ESM.exam_type SEPARATOR ' , ') exam_type,GROUP_CONCAT(ESM.exam_number SEPARATOR ' , ') exam_number,GROUP_CONCAT(ESM.code SEPARATOR ' , ') exam_code, GROUP_CONCAT(ESM.name SEPARATOR ' , ') exam_name, tbl.first_name,tbl.middle_name, tbl.last_name, tbl.father_name, tbl.mobile_number,  tbl.email, tbl.address, tbl.city, tbl.state, tbl.pincode");
                        //_sqlQuery.Append(" FROM payumoney_response_detail PRESD INNER JOIN payumoney_request_detail PREQD ON PREQD.order_id = PRESD.order_id");
                        _sqlQuery.Append(" FROM " + Convert.ToString(_dataTable.Rows[0]["response_table_name"]) + " PRESD INNER JOIN " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " PREQD ON PREQD.order_id = PRESD.order_id");
                        _sqlQuery.Append(" INNER JOIN registration_to_exam RTE ON RTE.registration_guid=PREQD.registration_guid ");
                        _sqlQuery.Append(" INNER JOIN exams_main ESM ON ESM.exam_guid = RTE.exam_guid ");
                        _sqlQuery.Append(" JOIN( ");
                        _sqlQuery.Append(" SELECT candidate_guid, max(if (c.name = 'NgxIxcheckFirstname',dsml.datavalue,null)) as first_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMiddlename',dsml.datavalue,null)) as middle_name,  ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckLastname',dsml.datavalue,null)) as last_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckFathername',dsml.datavalue,null)) as father_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMobilenumber',dsml.datavalue,null)) as mobile_number, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckEmail',dsml.datavalue,null)) as email, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckAddress',dsml.datavalue,null)) as address, ");
                        _sqlQuery.Append(" (SELECT name FROM city_main WHERE id = max(if (c.name = 'NgxIxcheckCity',dsml.datavalue,null))) as city, ");
                        _sqlQuery.Append(" (SELECT name from states_main WHERE id = max(if (c.name = 'NgxIxcheckState',dsml.datavalue,null))) as state,");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckPincode',dsml.datavalue,null)) as pincode ");
                        _sqlQuery.Append(" FROM data_save_main_live dsml ");
                        _sqlQuery.Append(" JOIN components_main c on c.id = dsml.comp_id ");
                        _sqlQuery.Append(" WHERE dsml.candidate_guid = '" + _candidateGuid + "' ");
                        _sqlQuery.Append(" ) tbl on tbl.candidate_guid = PREQD.candidate_guid ");
                        _sqlQuery.Append("  WHERE PREQD.candidate_guid = '" + _candidateGuid + "' GROUP BY PREQD.order_id ORDER BY PREQD.order_id DESC;");

                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                        foreach (DataRow row in _dataTable.Rows)
                        {
                            __id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _online_payment = row["online_payment"] == DBNull.Value ? 0 : Convert.ToInt32(row["online_payment"]);
                            _order_id = row["order_id"] == DBNull.Value ? "" : Convert.ToString(row["order_id"]);
                            _txn_amount = row["txn_amount"] == DBNull.Value ? 0 : Convert.ToDouble(row["txn_amount"]);
                            _payment_mode = row["payment_mode"] == DBNull.Value ? "" : Convert.ToString(row["payment_mode"]);
                            _txn_date = row["txn_date"] == DBNull.Value ? "" : Convert.ToString(row["txn_date"]);
                            _gateway_name = row["gateway_name"] == DBNull.Value ? "" : Convert.ToString(row["gateway_name"]);
                            _bank_txn_id = row["payumoney_id"] == DBNull.Value ? "" : Convert.ToString(row["payumoney_id"]);
                            _txn_status = row["txn_status"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_number"]);
                            _exam_number = row["exam_number"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_code = row["exam_code"] == DBNull.Value ? "" : Convert.ToString(row["exam_code"]);
                            _exam_name = row["exam_name"] == DBNull.Value ? "" : Convert.ToString(row["exam_name"]);
                            _first_name = row["first_name"] == DBNull.Value ? "" : Convert.ToString(row["first_name"]);
                            _middle_name = row["middle_name"] == DBNull.Value ? "" : Convert.ToString(row["middle_name"]);
                            _last_name = row["last_name"] == DBNull.Value ? "" : Convert.ToString(row["last_name"]);
                            _father_name = row["father_name"] == DBNull.Value ? "" : Convert.ToString(row["father_name"]);
                            _mobile_number = row["mobile_number"] == DBNull.Value ? "" : Convert.ToString(row["mobile_number"]);
                            _email = row["email"] == DBNull.Value ? "" : Convert.ToString(row["email"]);
                            _address = row["address"] == DBNull.Value ? "" : Convert.ToString(row["address"]);
                            _city = row["city"] == DBNull.Value ? "" : Convert.ToString(row["city"]);
                            _state = row["state"] == DBNull.Value ? "" : Convert.ToString(row["state"]);
                            _pincode = row["pincode"] == DBNull.Value ? "" : Convert.ToString(row["pincode"]);

                            _writer.WriteStartObject();
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                            _writer.WriteValue("PAYUMONEY");
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                            _writer.WriteValue(__id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OnlinePayment);
                            _writer.WriteValue(_online_payment);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                            _writer.WriteValue(_payment_gateway_type_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnAmount);
                            _writer.WriteValue(_txn_amount);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseCode);
                            _writer.WriteValue(_response_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseMsg);
                            _writer.WriteValue(_response_msg);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentMode);
                            _writer.WriteValue(_payment_mode);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnDate);
                            _writer.WriteValue(_txn_date);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Currency);
                            _writer.WriteValue("INR");

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GatewayName);
                            _writer.WriteValue(_gateway_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(_bank_txn_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankName);
                            _writer.WriteValue(_bank_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);


                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                            _writer.WriteValue(_candidateGuid);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamType);
                            _writer.WriteValue(_exam_type);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamCode);
                            _writer.WriteValue(_exam_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamNumber);
                            _writer.WriteValue(_exam_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamName);
                            _writer.WriteValue(_exam_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FirstName);
                            _writer.WriteValue(_first_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MiddleName);
                            _writer.WriteValue(_middle_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LastName);
                            _writer.WriteValue(_last_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FatherName);
                            _writer.WriteValue(_father_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MobileNumber);
                            _writer.WriteValue(_mobile_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                            _writer.WriteValue(_email);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Address);
                            _writer.WriteValue(_address);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.City);
                            _writer.WriteValue(_city);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                            _writer.WriteValue(_state);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pincode);
                            _writer.WriteValue(_pincode);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(row["payumoney_id"] == DBNull.Value ? "" : Convert.ToString(row["payumoney_id"]));

                            _writer.WriteEndObject();
                        }
                    }

                    else if (_functionReturn.Status && _dataTable.Rows.Count > 0 && _gatway_code.ToUpper() == "RAZORPAY")
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append(" SELECT PRESD.id,PRESD.razorpay_order_id, PRESD.order_id,PRESD.txn_amount,PRESD.payment_mode,PRESD.gateway_name, ");
                        _sqlQuery.Append("  PRESD.txn_date,PRESD.txn_status, PRESD.razorpay_payment_id,PRESD.razorpay_singnature,  ");
                        _sqlQuery.Append(" 1 as online_payment, PREQD.candidate_guid,GROUP_CONCAT(ESM.exam_type SEPARATOR ' , ') exam_type,GROUP_CONCAT(ESM.exam_number SEPARATOR ' , ') exam_number,GROUP_CONCAT(ESM.code SEPARATOR ' , ') exam_code, GROUP_CONCAT(ESM.name SEPARATOR ' , ') exam_name, tbl.first_name,tbl.middle_name, tbl.last_name, tbl.father_name, tbl.mobile_number,  tbl.email, tbl.address, tbl.city, tbl.state, tbl.pincode");
                        //_sqlQuery.Append(" FROM payumoney_response_detail PRESD INNER JOIN payumoney_request_detail PREQD ON PREQD.order_id = PRESD.order_id");
                        _sqlQuery.Append(" FROM " + Convert.ToString(_dataTable.Rows[0]["response_table_name"]) + " PRESD INNER JOIN " + Convert.ToString(_dataTable.Rows[0]["request_table_name"]) + " PREQD ON PREQD.order_id = PRESD.order_id");
                        _sqlQuery.Append(" INNER JOIN registration_to_exam RTE ON RTE.registration_guid=PREQD.registration_guid ");
                        _sqlQuery.Append(" INNER JOIN exams_main ESM ON ESM.exam_guid = RTE.exam_guid ");
                        _sqlQuery.Append(" JOIN( ");
                        _sqlQuery.Append(" SELECT candidate_guid, max(if (c.name = 'NgxIxcheckFirstname',dsml.datavalue,null)) as first_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMiddlename',dsml.datavalue,null)) as middle_name,  ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckLastname',dsml.datavalue,null)) as last_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckFathername',dsml.datavalue,null)) as father_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMobilenumber',dsml.datavalue,null)) as mobile_number, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckEmail',dsml.datavalue,null)) as email, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckAddress',dsml.datavalue,null)) as address, ");
                        _sqlQuery.Append(" (SELECT name FROM city_main WHERE id = max(if (c.name = 'NgxIxcheckCity',dsml.datavalue,null))) as city, ");
                        _sqlQuery.Append(" (SELECT name from states_main WHERE id = max(if (c.name = 'NgxIxcheckState',dsml.datavalue,null))) as state,");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckPincode',dsml.datavalue,null)) as pincode ");
                        _sqlQuery.Append(" FROM data_save_main_live dsml ");
                        _sqlQuery.Append(" JOIN components_main c on c.id = dsml.comp_id ");
                        _sqlQuery.Append(" WHERE dsml.candidate_guid = '" + _candidateGuid + "' ");
                        _sqlQuery.Append(" ) tbl on tbl.candidate_guid = PREQD.candidate_guid ");
                        _sqlQuery.Append("  WHERE PREQD.candidate_guid = '" + _candidateGuid + "' GROUP BY PREQD.order_id ORDER BY PREQD.order_id DESC;");

                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                        foreach (DataRow row in _dataTable.Rows)
                        {
                            __id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _online_payment = row["online_payment"] == DBNull.Value ? 0 : Convert.ToInt32(row["online_payment"]);
                            _order_id = row["order_id"] == DBNull.Value ? "" : Convert.ToString(row["order_id"]);
                            _txn_amount = row["txn_amount"] == DBNull.Value ? 0 : Convert.ToDouble(row["txn_amount"]);
                            _payment_mode = row["payment_mode"] == DBNull.Value ? "" : Convert.ToString(row["payment_mode"]);
                            _txn_date = row["txn_date"] == DBNull.Value ? "" : Convert.ToString(row["txn_date"]);
                            _gateway_name = row["gateway_name"] == DBNull.Value ? "" : Convert.ToString(row["gateway_name"]);
                            _txn_status = row["txn_status"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);

                            _razorpay_order_id = row["razorpay_order_id"] == DBNull.Value ? "" : Convert.ToString(row["razorpay_order_id"]);
                            _razorpay_payment_id = row["razorpay_payment_id"] == DBNull.Value ? "" : Convert.ToString(row["razorpay_payment_id"]);
                            _razorpay_singnature = row["razorpay_singnature"] == DBNull.Value ? "" : Convert.ToString(row["razorpay_singnature"]);

                            _exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_number"]);
                            _exam_number = row["exam_number"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_code = row["exam_code"] == DBNull.Value ? "" : Convert.ToString(row["exam_code"]);
                            _exam_name = row["exam_name"] == DBNull.Value ? "" : Convert.ToString(row["exam_name"]);
                            _first_name = row["first_name"] == DBNull.Value ? "" : Convert.ToString(row["first_name"]);
                            _middle_name = row["middle_name"] == DBNull.Value ? "" : Convert.ToString(row["middle_name"]);
                            _last_name = row["last_name"] == DBNull.Value ? "" : Convert.ToString(row["last_name"]);
                            _father_name = row["father_name"] == DBNull.Value ? "" : Convert.ToString(row["father_name"]);
                            _mobile_number = row["mobile_number"] == DBNull.Value ? "" : Convert.ToString(row["mobile_number"]);
                            _email = row["email"] == DBNull.Value ? "" : Convert.ToString(row["email"]);
                            _address = row["address"] == DBNull.Value ? "" : Convert.ToString(row["address"]);
                            _city = row["city"] == DBNull.Value ? "" : Convert.ToString(row["city"]);
                            _state = row["state"] == DBNull.Value ? "" : Convert.ToString(row["state"]);
                            _pincode = row["pincode"] == DBNull.Value ? "" : Convert.ToString(row["pincode"]);

                            _writer.WriteStartObject();
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                            _writer.WriteValue("RAZOR PAY");
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                            _writer.WriteValue(__id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OnlinePayment);
                            _writer.WriteValue(_online_payment);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                            _writer.WriteValue(_payment_gateway_type_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.RazorPayOrderId);
                            _writer.WriteValue(_razorpay_order_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.RazorPayPaymentId);
                            _writer.WriteValue(_razorpay_payment_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.RazorPaySignature);
                            _writer.WriteValue(_razorpay_singnature);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnAmount);
                            _writer.WriteValue(_txn_amount);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseCode);
                            _writer.WriteValue(_response_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseMsg);
                            _writer.WriteValue(_response_msg);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentMode);
                            _writer.WriteValue(_payment_mode);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnDate);
                            _writer.WriteValue(_txn_date);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Currency);
                            _writer.WriteValue("INR");

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GatewayName);
                            _writer.WriteValue(_gateway_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(_bank_txn_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankName);
                            _writer.WriteValue(_bank_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                            _writer.WriteValue(_candidateGuid);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamType);
                            _writer.WriteValue(_exam_type);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamCode);
                            _writer.WriteValue(_exam_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamNumber);
                            _writer.WriteValue(_exam_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamName);
                            _writer.WriteValue(_exam_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FirstName);
                            _writer.WriteValue(_first_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MiddleName);
                            _writer.WriteValue(_middle_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LastName);
                            _writer.WriteValue(_last_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FatherName);
                            _writer.WriteValue(_father_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MobileNumber);
                            _writer.WriteValue(_mobile_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                            _writer.WriteValue(_email);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Address);
                            _writer.WriteValue(_address);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.City);
                            _writer.WriteValue(_city);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                            _writer.WriteValue(_state);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pincode);
                            _writer.WriteValue(_pincode);

                            _writer.WriteEndObject();
                        }
                    }

                    else if (_functionReturn.Status && _dataTable.Rows.Count > 0 && _gatway_code.ToUpper() == "SBI COLLECT")
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append(" SELECT SBI.id, SBI.id as order_id, SBI.name,SBI.payment_amount as txn_amount,SBI.payment_date txn_date,'SBI COLLECT' gateway_name,SBI.status txn_status, ");
                        _sqlQuery.Append(" 'Offline' as payment_mode,0 as online_payment, SBI.candidate_guid,GROUP_CONCAT(ESM.exam_type SEPARATOR ' , ') exam_type,GROUP_CONCAT(ESM.exam_number SEPARATOR ' , ') exam_number,GROUP_CONCAT(ESM.code SEPARATOR ' , ') exam_code, GROUP_CONCAT(ESM.name SEPARATOR ' , ') exam_name, tbl.first_name,tbl.middle_name, tbl.last_name, tbl.father_name, tbl.mobile_number,  tbl.email, tbl.address, tbl.city, tbl.state, tbl.pincode");
                        _sqlQuery.Append(" FROM payment_sbicollect_detail SBI ");
                        _sqlQuery.Append(" INNER JOIN registration_main_live RML ON RTE.candidate_guid=SBI.candidate_guid ");
                        _sqlQuery.Append(" INNER JOIN registration_to_exam RTE ON RTE.registration_guid=RML.registration_guid ");
                        _sqlQuery.Append(" INNER JOIN exams_main ESM ON ESM.exam_guid = RTE.exam_guid ");
                        _sqlQuery.Append(" JOIN( ");
                        _sqlQuery.Append(" SELECT candidate_guid, max(if (c.name = 'NgxIxcheckFirstname',dsml.datavalue,null)) as first_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMiddlename',dsml.datavalue,null)) as middle_name,  ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckLastname',dsml.datavalue,null)) as last_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckFathername',dsml.datavalue,null)) as father_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMobilenumber',dsml.datavalue,null)) as mobile_number, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckEmail',dsml.datavalue,null)) as email, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckAddress',dsml.datavalue,null)) as address, ");
                        _sqlQuery.Append(" (SELECT name FROM city_main WHERE id = max(if (c.name = 'NgxIxcheckCity',dsml.datavalue,null))) as city, ");
                        _sqlQuery.Append(" (SELECT name from states_main WHERE id = max(if (c.name = 'NgxIxcheckState',dsml.datavalue,null))) as state,");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckPincode',dsml.datavalue,null)) as pincode ");
                        _sqlQuery.Append(" FROM data_save_main_live dsml ");
                        _sqlQuery.Append(" JOIN components_main c on c.id = dsml.comp_id ");
                        _sqlQuery.Append(" WHERE dsml.candidate_guid = '" + _candidateGuid + "' ");
                        _sqlQuery.Append(" ) tbl on tbl.candidate_guid = SBI.candidate_guid ");
                        _sqlQuery.Append("  WHERE SBI.candidate_guid = '" + _candidateGuid + "' GROUP BY SBI.id ORDER BY SBI.id DESC;");

                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                        foreach (DataRow row in _dataTable.Rows)
                        {
                            __id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _online_payment = row["online_payment"] == DBNull.Value ? 0 : Convert.ToInt32(row["online_payment"]);
                            _first_name = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);
                            _order_id = row["order_id"] == DBNull.Value ? "" : Convert.ToString(row["order_id"]);
                            _txn_amount = row["txn_amount"] == DBNull.Value ? 0 : Convert.ToDouble(row["txn_amount"]);
                            _payment_mode = row["payment_mode"] == DBNull.Value ? "" : Convert.ToString(row["payment_mode"]);
                            _txn_date = row["txn_date"] == DBNull.Value ? "" : Convert.ToString(row["txn_date"]);
                            _gateway_name = row["gateway_name"] == DBNull.Value ? "" : Convert.ToString(row["gateway_name"]);
                            //_bank_txn_id = row["payumoney_id"] == DBNull.Value ? "" : Convert.ToString(row["payumoney_id"]);
                            _txn_status = row["txn_status"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);

                            _exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_number"]);
                            _exam_number = row["exam_number"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_code = row["exam_code"] == DBNull.Value ? "" : Convert.ToString(row["exam_code"]);
                            _exam_name = row["exam_name"] == DBNull.Value ? "" : Convert.ToString(row["exam_name"]);
                            _first_name = row["first_name"] == DBNull.Value ? "" : Convert.ToString(row["first_name"]);
                            _middle_name = row["middle_name"] == DBNull.Value ? "" : Convert.ToString(row["middle_name"]);
                            _last_name = row["last_name"] == DBNull.Value ? "" : Convert.ToString(row["last_name"]);
                            _father_name = row["father_name"] == DBNull.Value ? "" : Convert.ToString(row["father_name"]);
                            _mobile_number = row["mobile_number"] == DBNull.Value ? "" : Convert.ToString(row["mobile_number"]);
                            _email = row["email"] == DBNull.Value ? "" : Convert.ToString(row["email"]);
                            _address = row["address"] == DBNull.Value ? "" : Convert.ToString(row["address"]);
                            _city = row["city"] == DBNull.Value ? "" : Convert.ToString(row["city"]);
                            _state = row["state"] == DBNull.Value ? "" : Convert.ToString(row["state"]);
                            _pincode = row["pincode"] == DBNull.Value ? "" : Convert.ToString(row["pincode"]);

                            _writer.WriteStartObject();
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                            _writer.WriteValue("SBI COLLECT");
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                            _writer.WriteValue(__id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OnlinePayment);
                            _writer.WriteValue(_online_payment);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                            _writer.WriteValue(_payment_gateway_type_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Name);
                            _writer.WriteValue(_first_name);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnAmount);
                            _writer.WriteValue(_txn_amount);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentDate);
                            _writer.WriteValue(_txn_date);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentMode);
                            _writer.WriteValue(_payment_mode);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GatewayName);
                            _writer.WriteValue(_gateway_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue((_txn_status == "1" ? "SUCCESS" : "FAILED"));
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseCode);
                            _writer.WriteValue((_txn_status == "1" ? "PAYMENT SUCCESS" : "PAYMENT FAILED"));
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseMsg);
                            _writer.WriteValue((_txn_status == "1" ? "PAYMENT SUCCESS" : "PAYMENT FAILED"));

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                            _writer.WriteValue(_candidateGuid);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamType);
                            _writer.WriteValue(_exam_type);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamCode);
                            _writer.WriteValue(_exam_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamNumber);
                            _writer.WriteValue(_exam_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamName);
                            _writer.WriteValue(_exam_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FirstName);
                            _writer.WriteValue(_first_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MiddleName);
                            _writer.WriteValue(_middle_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LastName);
                            _writer.WriteValue(_last_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FatherName);
                            _writer.WriteValue(_father_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MobileNumber);
                            _writer.WriteValue(_mobile_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                            _writer.WriteValue(_email);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Address);
                            _writer.WriteValue(_address);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.City);
                            _writer.WriteValue(_city);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                            _writer.WriteValue(_state);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pincode);
                            _writer.WriteValue(_pincode);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Currency);
                            _writer.WriteValue("INR");

                            _writer.WriteEndObject();
                        }
                    }

                    else if (_functionReturn.Status && _dataTable.Rows.Count > 0 && _gatway_code.ToUpper() == "CHALLAN")
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append(" SELECT CH.id, CH.id as order_id, CH.bank_name,CH.challan_number,CH.challan_amount as txn_amount,CH.challan_date txn_date,'CHALLAN' as gateway_name,CH.status txn_status,");
                        _sqlQuery.Append(" 'Offline' as payment_mode,0 as online_payment, CH.candidate_guid,GROUP_CONCAT(ESM.exam_type SEPARATOR ' , ') exam_type,GROUP_CONCAT(ESM.exam_number SEPARATOR ' , ') exam_number,GROUP_CONCAT(ESM.code SEPARATOR ' , ') exam_code, GROUP_CONCAT(ESM.name SEPARATOR ' , ') exam_name, tbl.first_name,tbl.middle_name, tbl.last_name, tbl.father_name, tbl.mobile_number,  tbl.email, tbl.address, tbl.city, tbl.state, tbl.pincode");
                        _sqlQuery.Append(" FROM payment_challan_detail CH ");
                        _sqlQuery.Append(" INNER JOIN registration_main_live RML ON RML.candidate_guid=CH.candidate_guid ");
                        _sqlQuery.Append(" INNER JOIN registration_to_exam RTE ON RTE.registration_guid=RML.registration_guid ");
                        _sqlQuery.Append(" INNER JOIN exams_main ESM ON ESM.exam_guid = RTE.exam_guid ");
                        _sqlQuery.Append(" JOIN( ");
                        _sqlQuery.Append(" SELECT candidate_guid, max(if (c.name = 'NgxIxcheckFirstname',dsml.datavalue,null)) as first_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMiddlename',dsml.datavalue,null)) as middle_name,  ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckLastname',dsml.datavalue,null)) as last_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckFathername',dsml.datavalue,null)) as father_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMobilenumber',dsml.datavalue,null)) as mobile_number, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckEmail',dsml.datavalue,null)) as email, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckAddress',dsml.datavalue,null)) as address, ");
                        _sqlQuery.Append(" (SELECT name FROM city_main WHERE id = max(if (c.name = 'NgxIxcheckCity',dsml.datavalue,null))) as city, ");
                        _sqlQuery.Append(" (SELECT name from states_main WHERE id = max(if (c.name = 'NgxIxcheckState',dsml.datavalue,null))) as state,");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckPincode',dsml.datavalue,null)) as pincode ");
                        _sqlQuery.Append(" FROM data_save_main_live dsml ");
                        _sqlQuery.Append(" JOIN components_main c on c.id = dsml.comp_id ");
                        _sqlQuery.Append(" WHERE dsml.candidate_guid = '" + _candidateGuid + "' ");
                        _sqlQuery.Append(" ) tbl on tbl.candidate_guid = CH.candidate_guid ");
                        _sqlQuery.Append("  WHERE CH.candidate_guid = '" + _candidateGuid + "' GROUP BY CH.id ORDER BY CH.id DESC;");

                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                        foreach (DataRow row in _dataTable.Rows)
                        {
                            __id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _online_payment = row["online_payment"] == DBNull.Value ? 0 : Convert.ToInt32(row["online_payment"]);
                            _bank_name = row["bank_name"] == DBNull.Value ? "" : Convert.ToString(row["bank_name"]);
                            _order_id = row["order_id"] == DBNull.Value ? "" : Convert.ToString(row["order_id"]);
                            _challan_number = row["challan_number"] == DBNull.Value ? "" : Convert.ToString(row["challan_number"]);
                            _txn_amount = row["txn_amount"] == DBNull.Value ? 0 : Convert.ToDouble(row["txn_amount"]);
                            _payment_mode = row["payment_mode"] == DBNull.Value ? "" : Convert.ToString(row["payment_mode"]);
                            _txn_date = row["txn_date"] == DBNull.Value ? "" : Convert.ToString(row["txn_date"]);
                            _gateway_name = row["gateway_name"] == DBNull.Value ? "" : Convert.ToString(row["gateway_name"]);
                            _bank_txn_id = row[""] == DBNull.Value ? "" : Convert.ToString(row["payumoney_id"]);
                            _txn_status = row["txn_status"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_number"]);
                            _exam_number = row["exam_number"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_code = row["exam_code"] == DBNull.Value ? "" : Convert.ToString(row["exam_code"]);
                            _exam_name = row["exam_name"] == DBNull.Value ? "" : Convert.ToString(row["exam_name"]);
                            _first_name = row["first_name"] == DBNull.Value ? "" : Convert.ToString(row["first_name"]);
                            _middle_name = row["middle_name"] == DBNull.Value ? "" : Convert.ToString(row["middle_name"]);
                            _last_name = row["last_name"] == DBNull.Value ? "" : Convert.ToString(row["last_name"]);
                            _father_name = row["father_name"] == DBNull.Value ? "" : Convert.ToString(row["father_name"]);
                            _mobile_number = row["mobile_number"] == DBNull.Value ? "" : Convert.ToString(row["mobile_number"]);
                            _email = row["email"] == DBNull.Value ? "" : Convert.ToString(row["email"]);
                            _address = row["address"] == DBNull.Value ? "" : Convert.ToString(row["address"]);
                            _city = row["city"] == DBNull.Value ? "" : Convert.ToString(row["city"]);
                            _state = row["state"] == DBNull.Value ? "" : Convert.ToString(row["state"]);
                            _pincode = row["pincode"] == DBNull.Value ? "" : Convert.ToString(row["pincode"]);

                            _writer.WriteStartObject();
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                            _writer.WriteValue("CHALLAN");
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                            _writer.WriteValue(__id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OnlinePayment);
                            _writer.WriteValue(_online_payment);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                            _writer.WriteValue(_payment_gateway_type_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankName);
                            _writer.WriteValue(_bank_name);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ChallanNumber);
                            _writer.WriteValue(_challan_number);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ChallanDate);
                            _writer.WriteValue(_txn_date);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnAmount);
                            _writer.WriteValue(_txn_amount);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentMode);
                            _writer.WriteValue(_payment_mode);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GatewayName);
                            _writer.WriteValue(_gateway_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue((_txn_status == "1" ? "SUCCESS" : "FAILED"));
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseCode);
                            _writer.WriteValue((_txn_status == "1" ? "PAYMENT SUCCESS" : "PAYMENT FAILED"));
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseMsg);
                            _writer.WriteValue((_txn_status == "1" ? "PAYMENT SUCCESS" : "PAYMENT FAILED"));

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                            _writer.WriteValue(_candidateGuid);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamType);
                            _writer.WriteValue(_exam_type);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamCode);
                            _writer.WriteValue(_exam_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamNumber);
                            _writer.WriteValue(_exam_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamName);
                            _writer.WriteValue(_exam_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FirstName);
                            _writer.WriteValue(_first_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MiddleName);
                            _writer.WriteValue(_middle_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LastName);
                            _writer.WriteValue(_last_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FatherName);
                            _writer.WriteValue(_father_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MobileNumber);
                            _writer.WriteValue(_mobile_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                            _writer.WriteValue(_email);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Address);
                            _writer.WriteValue(_address);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.City);
                            _writer.WriteValue(_city);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                            _writer.WriteValue(_state);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pincode);
                            _writer.WriteValue(_pincode);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Currency);
                            _writer.WriteValue("INR");
                            _writer.WriteEndObject();
                        }
                    }

                    else if (_functionReturn.Status && _dataTable.Rows.Count > 0 && _gatway_code.ToUpper() == "CHEQUE/DD")
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append(" SELECT DC.id, DC.id as order_id,DC.mode_cheque_dd,DC.cheque_dd_number, DC.bank_name,DC.cheque_dd_amount txn_amount,DC.cheque_dd_date txn_date,'CHEQUE/DD' gateway_name, DC.status txn_status,");
                        _sqlQuery.Append(" 'Offline' as payment_mode, 0 as online_payment, DC.candidate_guid,GROUP_CONCAT(ESM.exam_type SEPARATOR ' , ') exam_type,GROUP_CONCAT(ESM.exam_number SEPARATOR ' , ') exam_number,GROUP_CONCAT(ESM.code SEPARATOR ' , ') exam_code, GROUP_CONCAT(ESM.name SEPARATOR ' , ') exam_name, tbl.first_name,tbl.middle_name, tbl.last_name, tbl.father_name, tbl.mobile_number,  tbl.email, tbl.address, tbl.city, tbl.state, tbl.pincode");
                        _sqlQuery.Append(" FROM payment_cheque_detail DC ");
                        _sqlQuery.Append(" INNER JOIN registration_main_live RML ON RML.candidate_guid=DC.candidate_guid ");
                        _sqlQuery.Append(" INNER JOIN registration_to_exam RTE ON RTE.registration_guid=RML.registration_guid ");
                        _sqlQuery.Append(" INNER JOIN exams_main ESM ON ESM.exam_guid = RTE.exam_guid ");
                        _sqlQuery.Append(" JOIN( ");
                        _sqlQuery.Append(" SELECT candidate_guid, max(if (c.name = 'NgxIxcheckFirstname',dsml.datavalue,null)) as first_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMiddlename',dsml.datavalue,null)) as middle_name,  ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckLastname',dsml.datavalue,null)) as last_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckFathername',dsml.datavalue,null)) as father_name, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckMobilenumber',dsml.datavalue,null)) as mobile_number, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckEmail',dsml.datavalue,null)) as email, ");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckAddress',dsml.datavalue,null)) as address, ");
                        _sqlQuery.Append(" (SELECT name FROM city_main WHERE id = max(if (c.name = 'NgxIxcheckCity',dsml.datavalue,null))) as city, ");
                        _sqlQuery.Append(" (SELECT name from states_main WHERE id = max(if (c.name = 'NgxIxcheckState',dsml.datavalue,null))) as state,");
                        _sqlQuery.Append(" max(if (c.name = 'NgxIxcheckPincode',dsml.datavalue,null)) as pincode ");
                        _sqlQuery.Append(" FROM data_save_main_live dsml ");
                        _sqlQuery.Append(" JOIN components_main c on c.id = dsml.comp_id ");
                        _sqlQuery.Append(" WHERE dsml.candidate_guid = '" + _candidateGuid + "' ");
                        _sqlQuery.Append(" ) tbl on tbl.candidate_guid = DC.candidate_guid ");
                        _sqlQuery.Append("  WHERE DC.candidate_guid = '" + _candidateGuid + "' GROUP BY DC.id ORDER BY DC.id DESC;");

                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                        foreach (DataRow row in _dataTable.Rows)
                        {
                            __id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _online_payment = row["online_payment"] == DBNull.Value ? 0 : Convert.ToInt32(row["online_payment"]);
                            _bank_name = row["bank_name"] == DBNull.Value ? "" : Convert.ToString(row["bank_name"]);
                            _mode_cheque_dd = row["mode_cheque_dd"] == DBNull.Value ? "" : Convert.ToString(row["mode_cheque_dd"]);
                            _cheque_dd_number = row["cheque_dd_number"] == DBNull.Value ? "" : Convert.ToString(row["cheque_dd_number"]);
                            _order_id = row["order_id"] == DBNull.Value ? "" : Convert.ToString(row["order_id"]);
                            _txn_amount = row["txn_amount"] == DBNull.Value ? 0 : Convert.ToDouble(row["txn_amount"]);
                            _payment_mode = row["payment_mode"] == DBNull.Value ? "" : Convert.ToString(row["payment_mode"]);
                            _txn_date = row["txn_date"] == DBNull.Value ? "" : Convert.ToString(row["txn_date"]);
                            _gateway_name = row["gateway_name"] == DBNull.Value ? "" : Convert.ToString(row["gateway_name"]);
                            _txn_status = row["txn_status"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_number"]);
                            _exam_number = row["exam_number"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);
                            _exam_code = row["exam_code"] == DBNull.Value ? "" : Convert.ToString(row["exam_code"]);
                            _exam_name = row["exam_name"] == DBNull.Value ? "" : Convert.ToString(row["exam_name"]);
                            _first_name = row["first_name"] == DBNull.Value ? "" : Convert.ToString(row["first_name"]);
                            _middle_name = row["middle_name"] == DBNull.Value ? "" : Convert.ToString(row["middle_name"]);
                            _last_name = row["last_name"] == DBNull.Value ? "" : Convert.ToString(row["last_name"]);
                            _father_name = row["father_name"] == DBNull.Value ? "" : Convert.ToString(row["father_name"]);
                            _mobile_number = row["mobile_number"] == DBNull.Value ? "" : Convert.ToString(row["mobile_number"]);
                            _email = row["email"] == DBNull.Value ? "" : Convert.ToString(row["email"]);
                            _address = row["address"] == DBNull.Value ? "" : Convert.ToString(row["address"]);
                            _city = row["city"] == DBNull.Value ? "" : Convert.ToString(row["city"]);
                            _state = row["state"] == DBNull.Value ? "" : Convert.ToString(row["state"]);
                            _pincode = row["pincode"] == DBNull.Value ? "" : Convert.ToString(row["pincode"]);

                            _writer.WriteStartObject();
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayName);
                            _writer.WriteValue("CHEQUE/DD");
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                            _writer.WriteValue(__id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OnlinePayment);
                            _writer.WriteValue(_online_payment);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId);
                            _writer.WriteValue(_payment_gateway_type_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankName);
                            _writer.WriteValue(_bank_name);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ModeChequeDD);
                            _writer.WriteValue(_mode_cheque_dd);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ChequeNumber);
                            _writer.WriteValue(_cheque_dd_number);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnDate);
                            _writer.WriteValue(_txn_date);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnAmount);
                            _writer.WriteValue(_txn_amount);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentMode);
                            _writer.WriteValue(_payment_mode);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GatewayName);
                            _writer.WriteValue(_gateway_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue((_txn_status == "1" ? "SUCCESS" : "FAILED"));
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseCode);
                            _writer.WriteValue((_txn_status == "1" ? "PAYMENT SUCCESS" : "PAYMENT FAILED"));
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseMsg);
                            _writer.WriteValue((_txn_status == "1" ? "PAYMENT SUCCESS" : "PAYMENT FAILED"));

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                            _writer.WriteValue(_candidateGuid);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamType);
                            _writer.WriteValue(_exam_type);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamCode);
                            _writer.WriteValue(_exam_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamNumber);
                            _writer.WriteValue(_exam_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamName);
                            _writer.WriteValue(_exam_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FirstName);
                            _writer.WriteValue(_first_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MiddleName);
                            _writer.WriteValue(_middle_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LastName);
                            _writer.WriteValue(_last_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FatherName);
                            _writer.WriteValue(_father_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MobileNumber);
                            _writer.WriteValue(_mobile_number);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Email);
                            _writer.WriteValue(_email);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Address);
                            _writer.WriteValue(_address);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.City);
                            _writer.WriteValue(_city);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                            _writer.WriteValue(_state);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pincode);
                            _writer.WriteValue(_pincode);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Currency);
                            _writer.WriteValue("INR");
                            _writer.WriteEndObject();
                        }
                    }

                    _writer.WriteEndArray();

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();

                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.CacheCheckTime);
                    _writer.WriteValue(_cachecheckTime.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(JsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                    _writer.WriteEndObject();
                    _writer.WriteEndObject();

                    _jsonReturn = _sw.ToString();

                    //dispose objects
                    _sw.Dispose();
                    _writer = null;
                    _functionReturn.Status = true;
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Get Payment response list Async
        /// </summary>
        /// <param name="_cachecheckTime"></param>
        /// <param name="_candidateGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentResponseListAsync(TimeSpan _cachecheckTime, string _candidateGuid)
        {
            return Task.Run(() => GetPaymentResponseList(_cachecheckTime, _candidateGuid));
        }

        /// <summary>
        /// Get Bank By ID
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetPaymentResponseId(TimeSpan _cachecheckTime, int _id)
        {
            #region Local Variables
            string _methodName = "PaymentGatewayFunctions:GetPaymentResponseId";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            int _randamNumber = 0;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            UInt64 __id = 0;
            string _order_id = "";
            string _payment_mode = "";
            string _currency = "";
            double _txn_amount = 0;
            string _response_msg = "";
            string _response_code = "";
            string _txn_date = "";
            string _txn_status = "";
            string _gateway_name = "";
            string _bank_txn_id = "";
            string _bank_name = "";
            DateTime _loopStart;
            DateTime _loopEnd;
            TimeSpan _loopTime;
            #endregion

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _dataTable = new DataTable();
                    _sqlconnTime = new TimeSpan();
                    _queryTime = new TimeSpan();
                    _sqlQuery.Append(" select id, order_id,txn_amount,payment_mode,currency,response_code,gateway_name,bank_txn_id,bank_name,response_msg,txn_date,txn_status ");
                    _sqlQuery.Append(" from payment_response_detail ");
                    _sqlQuery.Append(" WHERE id=" + _id + ";");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_functionReturn.Status)
                    {
                        _sw = new StringWriter();
                        _writer = new JsonTextWriter(_sw);
                        // {
                        _writer.WriteStartObject();
                        _loopStart = DateTime.Now;
                        //start data array
                        // "collection_name": [
                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaytmResponse);
                        _writer.WriteStartArray();
                        foreach (DataRow row in _dataTable.Rows)
                        {
                            //check NULLS and DATA TYPE here for returned column values
                            __id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _order_id = row["order_id"] == DBNull.Value ? "" : Convert.ToString(row["order_id"]);
                            _txn_amount = row["txn_amount"] == DBNull.Value ? 0 : Convert.ToDouble(row["txn_amount"]);
                            _payment_mode = row["payment_mode"] == DBNull.Value ? "" : Convert.ToString(row["payment_mode"]);
                            _currency = row["currency"] == DBNull.Value ? "" : Convert.ToString(row["currency"]);
                            _response_code = row["response_code"] == DBNull.Value ? "" : Convert.ToString(row["response_code"]);
                            _gateway_name = row["gateway_name"] == DBNull.Value ? "" : Convert.ToString(row["gateway_name"]);
                            _bank_txn_id = row["bank_txn_id"] == DBNull.Value ? "" : Convert.ToString(row["bank_txn_id"]);
                            _bank_name = row["bank_name"] == DBNull.Value ? "" : Convert.ToString(row["bank_name"]);
                            _response_msg = row["response_msg"] == DBNull.Value ? "" : Convert.ToString(row["response_msg"]);
                            _txn_date = row["txn_date"] == DBNull.Value ? "" : Convert.ToString(row["txn_date"]);
                            _txn_status = row["txn_status"] == DBNull.Value ? "" : Convert.ToString(row["txn_status"]);

                            // {
                            _writer.WriteStartObject();

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                            _writer.WriteValue(__id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OrderId);
                            _writer.WriteValue(_order_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnAmount);
                            _writer.WriteValue(_txn_amount);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseCode);
                            _writer.WriteValue(_response_code);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ResponseMsg);
                            _writer.WriteValue(_response_msg);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PaymentMode);
                            _writer.WriteValue(_payment_mode);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnDate);
                            _writer.WriteValue(_txn_date);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Currency);
                            _writer.WriteValue(_currency);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GatewayName);
                            _writer.WriteValue(_gateway_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankTxnId);
                            _writer.WriteValue(_bank_txn_id);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BankName);
                            _writer.WriteValue(_bank_name);

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.TxnStatus);
                            _writer.WriteValue(_txn_status);

                            // }
                            _writer.WriteEndObject();
                        }
                        _writer.WriteEnd();

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.Stats);
                        _writer.WriteStartObject();
                        //{
                        _loopEnd = DateTime.Now;
                        _loopTime = (_loopEnd - _loopStart);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.CacheCheckTime);
                        _writer.WriteValue(_cachecheckTime.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SqlConnTime);
                        _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SqlQueryTime);
                        _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.LoopTime);
                        _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

                        // }                   
                        _writer.WriteEndObject();
                        _writer.WriteEndObject();

                        _jsonReturn = _sw.ToString();

                        //dispose objects
                        _sw.Dispose();
                        _writer = null;
                        _functionReturn.Status = true;
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn.Status = false;
                    _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    _randamNumber = CommonFunctions.GenerateRandomNumber();
                    _functionReturn.Message.Add($"[{_randamNumber}]: " + Constants.GenericMessages.UnExpectedError);
                    _functionReturn.Message.Add($"{Constants.GenericMessages.TracingNumberId} : [{_randamNumber}]: ");
                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Get Bank By ID Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPaymentResponseIdAsync(TimeSpan _cachecheckTime, int _id)
        {
            return Task.Run(() => GetPaymentResponseId(_cachecheckTime, _id));
        }

        /// <summary>
        ///  Add Payment Response
        /// </summary>
        /// <param name="_paymentResponse"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddPAYTMPaymentResponse(PaytmResponseDetail _paymentResponse)
        {
            string _methodName = "PaymentGatewayFunctions:AddPaymentResponse";
            #region Local Variables
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            //  MySqlDataReader row = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            //  int _rowsAffected = 0;
            bool _success = true;
            ApiSuccessResponse.DataValue _datValue = null;
            // UInt64 _customerId = 0;
            int _rowsAffected = 0;
            UInt64 _orderId = 0;
            string _mid = string.Empty;
            string _txnId = string.Empty;
            double _txnAmount = 0;
            string _paymentMode = string.Empty;
            string _currency = string.Empty;
            string _txnDate = string.Empty;
            string _responseCode = string.Empty;
            string _responseMsg = string.Empty;
            string _gatewayName = string.Empty;
            string _bankTxnId = string.Empty;
            string _bankName = string.Empty;
            string _checkSumHash = string.Empty;
            string _txnStatus = string.Empty;
            UInt64 _paymentResponseId = 0;
            string _registration_guid = "";
            string _candidateGuid = "";
            string _jsonReturn = string.Empty;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DataTable _dataTable = null;
            TimeSpan? _queryTime = null;
            #endregion

            string _errorMessage = "";
            try
            {
                if (_paymentResponse == null)
                    _errorMessage = "payment Response Data Required";
                else
                {
                    //Sanitize Input
                    _orderId = Convert.ToUInt64(Sanitization.Sanitize(_paymentResponse.OrderId));
                    _mid = Sanitization.Sanitize(_paymentResponse.Mid);
                    _txnId = Sanitization.Sanitize(_paymentResponse.TxnId);
                    _txnAmount = Convert.ToDouble(Sanitization.Sanitize(_paymentResponse.TxnAmount));
                    _paymentMode = Sanitization.Sanitize(_paymentResponse.PaymentMode);
                    _currency = Sanitization.Sanitize(_paymentResponse.Currency);
                    _txnDate = Sanitization.Sanitize(_paymentResponse.TxnDate);
                    _responseCode = Sanitization.Sanitize(_paymentResponse.ResponseCode);
                    _responseMsg = Sanitization.Sanitize(_paymentResponse.ResponseMsg);
                    _gatewayName = Sanitization.Sanitize(_paymentResponse.GatewayName);
                    _bankTxnId = Sanitization.Sanitize(_paymentResponse.BankTxnId);
                    _bankName = Sanitization.Sanitize(_paymentResponse.BankName);
                    _checkSumHash = Sanitization.Sanitize(_paymentResponse.CheckSumHash);
                    _txnStatus = Sanitization.Sanitize(_paymentResponse.TxnStatus);

                    //Customer
                    if (_orderId <= 0)
                    {
                        _errorMessage = "Order Id is required";
                    }
                    else if (string.IsNullOrEmpty(_mid))
                    {
                        _errorMessage = "MID is required";
                    }
                    else if (_txnAmount <= 0)
                    {
                        _errorMessage = "Transaction amount is required";
                    }
                    else if (string.IsNullOrEmpty(_currency))
                    {
                        _errorMessage = "Currency is required";
                    }
                    else if (string.IsNullOrEmpty(_responseCode))
                    {
                        _errorMessage = "Response code is required";
                    }
                    else if (string.IsNullOrEmpty(_responseMsg))
                    {
                        _errorMessage = "Response msg is required";
                    }
                    else if (string.IsNullOrEmpty(_txnStatus))
                    {
                        _errorMessage = "Transaction status is required";
                    }
                }
            }
            catch (Exception ex)
            {
                _errorMessage = ex.Message;
                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
            }

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            _datValue = new ApiSuccessResponse.DataValue();

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
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
                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);
                            _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                            _mySqlCommand.Connection = _mySqlConnection;
                            _mySqlCommand.Transaction = _mytransaction;

                            _queryStart = DateTime.Now;
                            _sqlQuery = new StringBuilder();
                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append("INSERT INTO `paytm_response_detail` (");
                            _sqlQuery.Append("`order_id`");
                            _sqlQuery.Append(",`mid`");
                            _sqlQuery.Append(",`txn_id`");
                            _sqlQuery.Append(",`txn_amount`");
                            _sqlQuery.Append(",`payment_mode`");
                            _sqlQuery.Append(",`currency`");
                            _sqlQuery.Append(",`txn_date`");
                            _sqlQuery.Append(",`response_code`");
                            _sqlQuery.Append(",`response_msg`");
                            _sqlQuery.Append(",`gateway_name`");
                            _sqlQuery.Append(",`bank_txn_id`");
                            _sqlQuery.Append(",`bank_name`");
                            _sqlQuery.Append(",`check_sum_hash`");
                            _sqlQuery.Append(",`txn_status`");
                            _sqlQuery.Append(") VALUES (");
                            _sqlQuery.Append("'" + _orderId + "'");
                            _sqlQuery.Append(",'" + _mid + "'");
                            _sqlQuery.Append(",'" + _txnId + "'");
                            _sqlQuery.Append(",'" + _txnAmount + "'");
                            _sqlQuery.Append(",'" + _paymentMode + "'");
                            _sqlQuery.Append(",'" + _currency + "'");
                            if (!string.IsNullOrEmpty(_txnDate))
                            {
                                _sqlQuery.Append(",'" + _txnDate + "'");
                            }
                            else
                            {
                                _sqlQuery.Append(",CURRENT_TIMESTAMP");
                            }
                            _sqlQuery.Append(",'" + _responseCode + "'");
                            _sqlQuery.Append(",'" + _responseMsg + "'");
                            _sqlQuery.Append(",'" + _gatewayName + "'");
                            _sqlQuery.Append(",'" + _bankTxnId + "'");
                            _sqlQuery.Append(",'" + _bankName + "'");
                            _sqlQuery.Append(",'" + _checkSumHash + "'");
                            _sqlQuery.Append(",'" + _txnStatus + "'");
                            _sqlQuery.Append(");");
                            _sqlQuery.Append("select LAST_INSERT_ID();");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _paymentResponseId = (UInt64)_mySqlCommand.ExecuteScalar();
                            if (_paymentResponseId <= 0)
                                _success = false;

                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append("UPDATE `paytm_request_detail` SET");
                            _sqlQuery.Append("`txn_status`='" + _txnStatus + "'");
                            _sqlQuery.Append(" where order_id='" + _orderId + "' ");
                            _sqlQuery.Append(";");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_rowsAffected <= 0)
                                _success = false;

                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append(" SELECT preqd.registration_guid,  preqd.candidate_guid");
                            _sqlQuery.Append(" FROM paytm_response_detail presd");
                            _sqlQuery.Append(" JOIN paytm_request_detail preqd ON preqd.order_id=presd.order_id");
                            _sqlQuery.Append(" WHERE preqd.order_id='" + _orderId + "'");
                            _sqlQuery.Append(" ORDER BY presd.order_id DESC LIMIT 1;");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                            if (_functionReturn.Status)
                            {
                                foreach (DataRow row in _dataTable.Rows)
                                {
                                    _registration_guid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                                    _candidateGuid = row["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(row["candidate_guid"]);
                                }
                            }

                            string _paymentStatus = string.Empty;
                            if (_txnStatus == "TXN_SUCCESS")
                                _paymentStatus = "SUCCESS";
                            else if (_txnStatus == "TXN_FAILURE")
                                _paymentStatus = "FAILED";
                            else
                                _paymentStatus = "PENDING";

                            //GET DATA
                            _sqlQuery.Clear();
                            _sqlQuery.Append("UPDATE `registration_main_live` SET");
                            _sqlQuery.Append(" `payment_status_guid`=(SELECT status_guid FROM payment_status WHERE code='" + _paymentStatus + "'),");
                            _sqlQuery.Append(" modify_date=NOW(),payment_date=NOW()");
                            _sqlQuery.Append(" WHERE registration_guid='" + _registration_guid + "' AND candidate_guid='" + _candidateGuid + "';");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_rowsAffected <= 0)
                                _success = false;

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                //Success
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully);
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInSavingRecord, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentFailed, ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully);
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                                _mytransaction?.Rollback();
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {exTran.Message}", _methodName);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Add Payment Response async
        /// </summary>
        /// <param name="_paymentResponse"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddPAYTMPaymentResponseAsync(PaytmResponseDetail _paymentResponse) => Task.Run(() => AddPAYTMPaymentResponse(_paymentResponse));

        /// <summary>
        ///  Add Payment Response
        /// </summary>
        /// <param name="_paymentResponse"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddRazorPayPaymentResponse(RazorPayResponseDetail _paymentResponse)
        {
            string _methodName = "PaymentGatewayFunctions:AddRazorPayPaymentResponse";
            #region Local Variables
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            //  MySqlDataReader row = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            //  int _rowsAffected = 0;
            bool _success = true;
            ApiSuccessResponse.DataValue _datValue = null;
            // UInt64 _customerId = 0;
            int _rowsAffected = 0;
            UInt64 _orderId = 0;
            string _mid = string.Empty;
            string _txnId = string.Empty;
            double _txnAmount = 0;
            string _paymentMode = string.Empty;
            string _currency = string.Empty;
            string _txnDate = string.Empty;
            string _responseCode = string.Empty;
            string _responseMsg = string.Empty;
            string _gatewayName = string.Empty;
            string _bankTxnId = string.Empty;
            string _bankName = string.Empty;
            string _checkSumHash = string.Empty;
            string _txnStatus = string.Empty;
            UInt64 _paymentResponseId = 0;
            string _registration_guid = "";
            string _candidateGuid = "";
            string _razorpay_order_id = string.Empty;
            string _razorpay_payment_id = string.Empty;
            string _razorpay_singnature = string.Empty;
            string _jsonReturn = string.Empty;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DataTable _dataTable = null;
            TimeSpan? _queryTime = null;
            #endregion

            string _errorMessage = "";
            try
            {
                if (_paymentResponse == null)
                    _errorMessage = "payment Response Data Required";
                else
                {
                    //Sanitize Input
                    _razorpay_order_id = Sanitization.Sanitize(_paymentResponse.RazorPayOrderId);
                    _razorpay_payment_id = Sanitization.Sanitize(_paymentResponse.RazorPayPaymentId);
                    _razorpay_singnature = Sanitization.Sanitize(_paymentResponse.RazorPaySignature);

                    _sqlQuery = new StringBuilder();
                    _sqlQuery.Append(" SELECT order_id, registration_guid, email, name, mobile_number,fee_amount,request_datetime, payment_gateway_id, candidate_guid, razorpay_order_id ");
                    _sqlQuery.Append(" FROM razorpay_request_detail ");
                    _sqlQuery.Append(" WHERE razorpay_order_id='" + _razorpay_order_id + "'");
                    _sqlQuery.Append(" ORDER BY order_id DESC LIMIT 1;");
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_functionReturn.Status)
                    {
                        foreach (DataRow row in _dataTable.Rows)
                        {
                            _orderId = Convert.ToUInt64(row["order_id"] == DBNull.Value ? "0" : Convert.ToString(row["order_id"]));
                            _registration_guid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                            _candidateGuid = row["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(row["candidate_guid"]);
                            _txnAmount = Convert.ToDouble(row["fee_amount"] == DBNull.Value ? "0" : Convert.ToString(row["fee_amount"]));
                            _paymentMode = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                            //_txnDate = row["request_datetime"] == DBNull.Value ? "" : Convert.ToString(row["request_datetime"]);
                            _responseCode = _razorpay_order_id;
                            _responseMsg = _razorpay_payment_id;
                            _gatewayName = "RAZORPAY";
                            _bankTxnId = _razorpay_singnature;
                            _txnStatus = "TXN_SUCCESS";
                        }
                    }

                    //Customer
                    if (_orderId <= 0)
                    {
                        _errorMessage = "Order Id is required";
                    }
                    else if (string.IsNullOrEmpty(_razorpay_order_id))
                    {
                        _errorMessage = "Razorpay Order is required";
                    }
                    else if (_txnAmount <= 0)
                    {
                        _errorMessage = "Transaction amount is required";
                    }
                    else if (string.IsNullOrEmpty(_razorpay_payment_id))
                    {
                        _errorMessage = "Razorpay Payment is required";
                    }
                    else if (string.IsNullOrEmpty(_responseCode))
                    {
                        _errorMessage = "Response code is required";
                    }
                    else if (string.IsNullOrEmpty(_responseMsg))
                    {
                        _errorMessage = "Response msg is required";
                    }
                    else if (string.IsNullOrEmpty(_txnStatus))
                    {
                        _errorMessage = "Transaction status is required";
                    }
                }
            }
            catch (Exception ex)
            {
                _errorMessage = ex.Message;
                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
            }

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            _datValue = new ApiSuccessResponse.DataValue();

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
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
                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);
                            _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                            _mySqlCommand.Connection = _mySqlConnection;
                            _mySqlCommand.Transaction = _mytransaction;

                            _queryStart = DateTime.Now;
                            _sqlQuery = new StringBuilder();
                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append("INSERT INTO `razorpay_response_detail` (");
                            _sqlQuery.Append("`order_id`");
                            _sqlQuery.Append(",`razorpay_order_id`");
                            _sqlQuery.Append(",`razorpay_payment_id`");
                            _sqlQuery.Append(",`razorpay_singnature`");
                            _sqlQuery.Append(",`txn_amount`");
                            _sqlQuery.Append(",`txn_date`");
                            _sqlQuery.Append(",`response_code`");
                            _sqlQuery.Append(",`response_msg`");
                            _sqlQuery.Append(",`gateway_name`");
                            _sqlQuery.Append(",`bank_txn_id`");
                            _sqlQuery.Append(",`txn_status`");
                            _sqlQuery.Append(") VALUES (");
                            _sqlQuery.Append("'" + _orderId + "'");
                            _sqlQuery.Append(",'" + _razorpay_order_id + "'");
                            _sqlQuery.Append(",'" + _razorpay_payment_id + "'");
                            _sqlQuery.Append(",'" + _razorpay_singnature + "'");
                            _sqlQuery.Append(",'" + _txnAmount + "'");
                            if (!string.IsNullOrEmpty(_txnDate))
                                _sqlQuery.Append(",'" + _txnDate + "'");
                            else
                                _sqlQuery.Append(",CURRENT_TIMESTAMP");

                            _sqlQuery.Append(",'" + _responseCode + "'");
                            _sqlQuery.Append(",'" + _responseMsg + "'");
                            _sqlQuery.Append(",'" + _gatewayName + "'");
                            _sqlQuery.Append(",'" + _bankTxnId + "'");
                            _sqlQuery.Append(",'" + _txnStatus + "'");
                            _sqlQuery.Append(");");
                            _sqlQuery.Append("select LAST_INSERT_ID();");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _paymentResponseId = (UInt64)_mySqlCommand.ExecuteScalar();
                            if (_paymentResponseId <= 0)
                                _success = false;

                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append("UPDATE `razorpay_request_detail` SET");
                            _sqlQuery.Append("`txn_status`='" + _txnStatus + "'");
                            _sqlQuery.Append(" where order_id='" + _orderId + "' ");
                            _sqlQuery.Append(";");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_rowsAffected <= 0)
                                _success = false;

                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append(" SELECT preqd.registration_guid,  preqd.candidate_guid");
                            _sqlQuery.Append(" FROM razorpay_response_detail presd");
                            _sqlQuery.Append(" JOIN razorpay_request_detail preqd ON preqd.order_id=presd.order_id");
                            _sqlQuery.Append(" WHERE preqd.order_id='" + _orderId + "'");
                            _sqlQuery.Append(" ORDER BY presd.order_id DESC LIMIT 1;");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                            if (_functionReturn.Status)
                            {
                                foreach (DataRow row in _dataTable.Rows)
                                {
                                    _registration_guid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                                    _candidateGuid = row["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(row["candidate_guid"]);
                                }
                            }

                            string _paymentStatus = string.Empty;
                            if (_txnStatus == "TXN_SUCCESS")
                                _paymentStatus = "SUCCESS";
                            else if (_txnStatus == "TXN_FAILURE")
                                _paymentStatus = "FAILED";
                            else
                                _paymentStatus = "PENDING";

                            //GET DATA
                            _sqlQuery.Clear();
                            _sqlQuery.Append("UPDATE `registration_main_live` SET");
                            _sqlQuery.Append(" `payment_status_guid`=(SELECT status_guid FROM payment_status WHERE code='" + _paymentStatus + "'),");
                            _sqlQuery.Append(" modify_date=NOW(),payment_date=NOW()");
                            _sqlQuery.Append(" WHERE registration_guid='" + _registration_guid + "' AND candidate_guid='" + _candidateGuid + "';");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_rowsAffected <= 0)
                                _success = false;

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                //Success
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully);
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInSavingRecord, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentFailed, ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully);
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                                _mytransaction?.Rollback();
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {exTran.Message}", _methodName);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Add Payment Response async
        /// </summary>
        /// <param name="_paymentResponse"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddRazorPayPaymentResponseAsync(RazorPayResponseDetail _paymentResponse) => Task.Run(() => AddRazorPayPaymentResponse(_paymentResponse));

        public Task<string> GetActivePaymentGatewayAsync() => Task.Run(() => GetActivePaymentGateway());
        private string GetActivePaymentGateway()
        {
            TimeSpan? _sqlconnTime, _queryTime;
            string _paymentCode;
            IFunctionReturn _functionReturn = new FunctionReturn();
            DataSet _dataSet;
            StringBuilder _sqlQuery = new StringBuilder();
            _sqlQuery.Append("SELECT code FROM payment_gateway_types;");
            //_sqlQuery.Append("SELECT merchant_salt FROM payment_gateway_payumoney;");
            (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), "GetActivePaymentGateway");
            _paymentCode = Convert.ToString(_dataSet.Tables[0].Rows[0]["code"]);
            return _paymentCode;
        }

        /// <summary>
        ///  Add Payment Response
        /// </summary>
        /// <param name="_paymentResponse"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddPAYUMONEYPaymentResponse(PayUMoneyResponseDetail _paymentResponse)
        {
            string _methodName = "PaymentGatewayFunctions:AddPaymentResponse";
            #region Local Variables
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            //  MySqlDataReader row = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            //  int _rowsAffected = 0;
            bool _success = true;
            ApiSuccessResponse.DataValue _datValue = null;
            // UInt64 _customerId = 0;
            int _rowsAffected = 0;
            string _jsonReturn = string.Empty;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DataTable _dataTable = null;
            TimeSpan? _queryTime = null;
            string _registration_guid = string.Empty;
            string _candidateGuid = string.Empty;
            string _txnStatus = string.Empty;
            string _errorMessage = string.Empty;
            string _paymentStatus = string.Empty;
            #endregion

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            _datValue = new ApiSuccessResponse.DataValue();

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
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
                            _txnStatus = Sanitization.Sanitize(_paymentResponse.TxnStatus);
                            _mySqlCommand = new MySqlCommand();
                            // Open connection;
                            _sqlconnStart = DateTime.Now;
                            _mySqlConnection.Open();
                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);
                            _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                            _mySqlCommand.Connection = _mySqlConnection;
                            _mySqlCommand.Transaction = _mytransaction;

                            _queryStart = DateTime.Now;
                            //GET DATA
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append("INSERT INTO `payumoney_response_detail` (");
                            _sqlQuery.Append("`order_id`");
                            _sqlQuery.Append(",`payment_mode`");
                            _sqlQuery.Append(",`payumoney_id`");
                            _sqlQuery.Append(",`first_name`");
                            _sqlQuery.Append(",`txn_amount`");
                            _sqlQuery.Append(",`check_sum_hash`");
                            _sqlQuery.Append(",`product_info`");
                            _sqlQuery.Append(",`mobile`");
                            _sqlQuery.Append(",`email`");
                            _sqlQuery.Append(",`txn_date`");
                            _sqlQuery.Append(",`gateway_name`");
                            _sqlQuery.Append(",`txn_status`");
                            _sqlQuery.Append(") VALUES (");
                            _sqlQuery.Append(Sanitization.Sanitize(_paymentResponse.OrderId));
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.PaymentMode) + "'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.PayUMoneyId) + "'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.FirstName) + "'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.TxnAmount) + "'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.CheckSumHash) + "'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.ProductInfo) + "'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.Mobile) + "'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.Email) + "'");
                            _sqlQuery.Append(",(SELECT request_datetime FROM payumoney_request_detail WHERE order_id=" + Sanitization.Sanitize(_paymentResponse.OrderId) + ")");
                            _sqlQuery.Append(",'PAYUMONEY'");
                            _sqlQuery.Append(",'" + Sanitization.Sanitize(_paymentResponse.TxnStatus) + "');");
                            _sqlQuery.Append("SELECT LAST_INSERT_ID();");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            UInt64 _paymentResponseId = (UInt64)_mySqlCommand.ExecuteScalar();
                            if (_paymentResponseId <= 0)
                                _success = false;

                            //GET DATA
                            _sqlQuery.Clear();
                            _sqlQuery.Append("UPDATE `payumoney_request_detail` SET");
                            _sqlQuery.Append("`txn_status`='" + Sanitization.Sanitize(_paymentResponse.TxnStatus) + "'");
                            _sqlQuery.Append(" where order_id=" + Sanitization.Sanitize(_paymentResponse.OrderId) + ";");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_rowsAffected <= 0)
                                _success = false;

                            //GET DATA
                            _sqlQuery.Clear();
                            _sqlQuery.Append(" SELECT preqd.registration_guid,  preqd.candidate_guid");
                            _sqlQuery.Append(" FROM payumoney_response_detail presd");
                            _sqlQuery.Append(" JOIN payumoney_request_detail preqd ON preqd.order_id=presd.order_id");
                            _sqlQuery.Append(" WHERE preqd.order_id=" + Sanitization.Sanitize(_paymentResponse.OrderId));
                            _sqlQuery.Append(" ORDER BY presd.order_id DESC LIMIT 1;");
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                            if (_functionReturn.Status)
                            {
                                foreach (DataRow row in _dataTable.Rows)
                                {
                                    _registration_guid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                                    _candidateGuid = row["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(row["candidate_guid"]);
                                }
                            }

                            _paymentStatus = string.Empty;
                            if (_txnStatus.ToUpper() == "SUCCESS" || _txnStatus.ToUpper() == "COMPLETED")
                                _paymentStatus = "SUCCESS";
                            else
                                _paymentStatus = "FAILED";

                            //GET DATA
                            _sqlQuery.Clear();
                            _sqlQuery.Append("UPDATE `registration_main_live` SET");
                            _sqlQuery.Append(" `payment_status_guid`=(SELECT status_guid FROM payment_status WHERE code='" + _paymentStatus + "'),");
                            _sqlQuery.Append(" modify_date=NOW(),payment_date=NOW()");
                            _sqlQuery.Append(" WHERE registration_guid='" + _registration_guid + "' AND candidate_guid='" + _candidateGuid + "';");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_rowsAffected <= 0)
                                _success = false;

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                //Success
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully);
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInSavingRecord, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentFailed, ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully);
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                                _mytransaction?.Rollback();
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {exTran.Message}", _methodName);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(Constants.GenericMessages.UnExpectedError, _methodName);
                    CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Add Payment Response async
        /// </summary>
        /// <param name="_paymentResponse"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddPAYUMONEYPaymentResponseAsync(PayUMoneyResponseDetail _paymentResponse) => Task.Run(() => AddPAYUMONEYPaymentResponse(_paymentResponse));

        /// <summary>
        ///  Add Offline Payment Gateway Details 
        /// </summary>
        /// <param name="_candidateGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddOfflinePaymentsGateway(OfflinePayments _payments, string _candidateGuid)
        {
            string _methodName = "PaymentGatewayFunctions:AddOfflinePaymentsGateway";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            DataTable _dataTable = null;
            DataSet _dataSet = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            #region Local Variables   
            bool _success = true;
            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            DateTime _queryStart;
            StringWriter _sw = new StringWriter(); ;
            JsonTextWriter _writer = new JsonTextWriter(_sw);
            string _jsonReturn = string.Empty;
            int _rowsAffected = 0;
            string _paymentGatewayTypeId = string.Empty;
            #endregion
            //Initiate Default Function Settings
            string _errorMessage = "";
            _functionReturn = new FunctionReturn();

            _candidateGuid = Sanitization.Sanitize(_candidateGuid);

            if (string.IsNullOrEmpty(_candidateGuid))
                _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;

            //Initiate Default Function Settings           
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
            else
            {
                try
                {
                    try
                    {
                        _sqlConnectionString = _databaseSettings.MySqlConnection;
                        using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                        {
                            _mySqlCommand = new MySqlCommand();
                            _mySqlCommand.CommandTimeout = _databaseSettings.MySqlTimeout;

                            // Open connection;
                            _sqlconnStart = DateTime.Now;
                            _mySqlConnection.Open();

                            _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                            _mySqlCommand.Connection = _mySqlConnection;
                            _mySqlCommand.Transaction = _mytransaction;

                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                            //GET DATA
                            _sqlQuery = new StringBuilder();


                            if (_payments.PaymentGatewayTypeId == "4")
                            {

                                _sqlQuery.Clear();
                                _sqlQuery.Append("INSERT INTO payment_sbicollect_detail  (");
                                _sqlQuery.Append("`candidate_guid`");
                                _sqlQuery.Append(",`name`");
                                _sqlQuery.Append(",`payment_date`");
                                _sqlQuery.Append(",`payment_amount` ");
                                _sqlQuery.Append(", `status` ");
                                _sqlQuery.Append(") VALUES (");
                                _sqlQuery.Append("'" + _candidateGuid + "'");
                                _sqlQuery.Append(",'" + _payments.Name + "'");
                                _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                                _sqlQuery.Append(",'" + _payments.PaymentAmount + "'");
                                _sqlQuery.Append(",'1'");
                                _sqlQuery.Append(");");
                                //Call Function    
                                _sqlQuery.Append("SELECT LAST_INSERT_ID(); ");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _queryStart = DateTime.Now;
                                UInt64 _orderId = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                if (_orderId <= 0)
                                    _success = false;

                            }

                            else if (_payments.PaymentGatewayTypeId == "5")
                            {

                                _sqlQuery.Clear();
                                _sqlQuery.Append("INSERT INTO payment_challan_detail  (");
                                _sqlQuery.Append("`candidate_guid`");
                                _sqlQuery.Append(",`bank_name`");
                                _sqlQuery.Append(",`challan_number`");
                                _sqlQuery.Append(",`challan_date`");
                                _sqlQuery.Append(",`challan_amount` ");
                                _sqlQuery.Append(", `status` ");
                                _sqlQuery.Append(") VALUES (");
                                _sqlQuery.Append("'" + _candidateGuid + "'");
                                _sqlQuery.Append(",'" + _payments.BankName + "'");
                                _sqlQuery.Append(",'" + _payments.ChallanNumber + "'");
                                _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                                _sqlQuery.Append(",'" + _payments.ChequeAmount + "'");
                                _sqlQuery.Append(",'1'");
                                _sqlQuery.Append(");");
                                //Call Function    
                                _sqlQuery.Append("SELECT LAST_INSERT_ID(); ");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _queryStart = DateTime.Now;
                                UInt64 _orderId = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                if (_orderId <= 0)
                                    _success = false;

                            }
                            else if (_payments.PaymentGatewayTypeId == "6")
                            {

                                _sqlQuery.Clear();
                                _sqlQuery.Append("INSERT INTO payment_cheque_detail  (");
                                _sqlQuery.Append("`candidate_guid`");
                                _sqlQuery.Append(",`mode_cheque_dd`");
                                _sqlQuery.Append(",`bank_name`");
                                _sqlQuery.Append(",`cheque_dd_number`");
                                _sqlQuery.Append(",`cheque_dd_date`");
                                _sqlQuery.Append(",`cheque_dd_amount` ");
                                _sqlQuery.Append(", `status` ");
                                _sqlQuery.Append(") VALUES (");
                                _sqlQuery.Append("'" + _candidateGuid + "'");
                                _sqlQuery.Append(",'" + _payments.ModeChequeDD + "'");
                                _sqlQuery.Append(",'" + _payments.BankName + "'");
                                _sqlQuery.Append(",'" + _payments.ChequeNumber + "'");
                                _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                                _sqlQuery.Append(",'" + _payments.ChequeAmount + "'");
                                _sqlQuery.Append(",'1'");
                                _sqlQuery.Append(");");
                                //Call Function    
                                _sqlQuery.Append("SELECT LAST_INSERT_ID(); ");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _queryStart = DateTime.Now;
                                UInt64 _orderId = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                if (_orderId <= 0)
                                    _success = false;

                            }
                            else
                            {
                                _success = false;

                            }

                            if (_success)
                            {
                                _sqlQuery.Clear();
                                _sqlQuery.Append(" update registration_main_live set payment_status_guid =(SELECT status_guid FROM payment_status WHERE code='SUCCESS')");
                                _sqlQuery.Append(" where  candidate_guid = '" + _candidateGuid + "' ");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _queryStart = DateTime.Now;
                                _mySqlCommand.ExecuteNonQuery();
                            }

                            if (_success)
                            {
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.PaymentRequested, "Payment Requested.");
                                _mytransaction?.Commit();

                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.PaymentGatewayNotFound, _methodName);
                                _success = false;
                                _mytransaction?.Rollback();

                            }

                            //GET DATA

                        }
                    }
                    catch (Exception ex)
                    {
                        _mytransaction?.Rollback();
                        _success = false;
                        CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                        _functionReturn = CommonFunctions.SystemError(_errorMessage, _methodName);
                    }
                }
                catch (Exception ex)
                {
                    ///ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(_errorMessage, _methodName);
                }
                finally
                {
                    //Cleanup
                    _mySqlCommand?.Dispose();
                    if (_mySqlConnection != null && _mySqlConnection.State != System.Data.ConnectionState.Closed)
                    {
                        _mySqlConnection?.Close();
                        _mySqlConnection = null;
                    }
                    _mytransaction = null;
                    _mySqlCommand = null;
                    _sqlQuery = null;
                    _sqlConnectionString = string.Empty;
                }
            }
            return (_jsonReturn, _functionReturn);
        }


        /// <summary>
        ///  Add Offline Payment Gateway Details Async
        /// </summary>
        /// <param name="_candidateGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddOfflinePaymentsGatewayAsync(OfflinePayments _payments, string _candidateGuid)
        {
            return Task.Run(() => AddOfflinePaymentsGateway(_payments, _candidateGuid));
        }
    }
}