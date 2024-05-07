using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Globals;
using IXCheckCandidateApi.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;
using static IXCheckCandidateApi.Globals.ApplicationConstants;
using IXCheckCandidateApi.Models.Interfaces;
using OpenCvSharp;
using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.Extensions.Configuration;

namespace IXCheckCandidateApi.AppFunctions
{
    public class SharedFunctions : ISharedFunctions
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
        public SharedFunctions(IDatabaseSettings __databaseSettings, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration)
        {

            _databaseSettings = __databaseSettings;
            _loggerFunctions = __loggerFunctions;
            _apiSettings = __apiSettings;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _configuration = __configuration;
        }

        /// <summary>
        /// Get State List
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetStateList()
        {
            string _methodName = "F:Shared:GetStateList";
            #region Local Variables
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;

            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300

            int _stateId = 0;
            string _stateCode = "";
            string _stateName = "";
            string _guid = "";

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
                    _sqlQuery.Append(" SELECT id, code,guid,country_guid,status, name FROM states_main where status = 1 order by name; ");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    // {
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;
                    //start data array
                    // "collection_name": [
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                    _writer.WriteStartArray();
                    foreach (DataRow row in _dataTable.Rows)
                    {
                        //check NULLS and DATA TYPE here for returned column values
                        _stateId = row["id"] == DBNull.Value ? 0 : Convert.ToInt32(row["id"]);
                        _stateCode = row["code"] == DBNull.Value ? "" : Convert.ToString(row["code"]);
                        _stateName = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);
                        _guid = row["guid"] == DBNull.Value ? "" : Convert.ToString(row["guid"]);

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                        _writer.WriteValue(_stateId);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Code);
                        _writer.WriteValue(_stateCode);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Name);
                        _writer.WriteValue(_stateName);
                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Guid);
                        _writer.WriteValue(_guid);

                        _writer.WriteEndObject();
                    }
                    _writer.WriteEnd();

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();
                    //{
                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CachedCheckTime);
                    _writer.WriteValue(_stats.CacheCheckTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    // }                   
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
                    _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                    //_functionReturn.Status = false;
                    //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    //_functionReturn.Message.Add(ex.Message);
                    //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    _jsonReturn = string.Empty;
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Get State List Async
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStateListAsync()
        {
            return Task.Run(() => GetStateList());
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="_id"></param>
        /// <returns></returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetStateListByCountryId(int _id)
        {
            string _methodName = "F:Shared:GetStateListByCountryId";
            #region Local Variables
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;

            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300

            int _stateId = 0;
            string _stateCode = "";
            string _stateName = "";

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
                    _sqlQuery.Append(" SELECT id, code, name FROM states_main");
                    _sqlQuery.Append(" WHERE country_id = " + _id + "");
                    _sqlQuery.Append(" AND status = 1 ");
                    _sqlQuery.Append(" ORDER BY name; ");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    // {
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;
                    //start data array
                    // "collection_name": [
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.States);
                    _writer.WriteStartArray();
                    foreach (DataRow row in _dataTable.Rows)
                    {
                        //check NULLS and DATA TYPE here for returned column values
                        _stateId = row["id"] == DBNull.Value ? 0 : Convert.ToInt32(row["id"]);
                        _stateCode = row["code"] == DBNull.Value ? "" : Convert.ToString(row["code"]);
                        _stateName = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                        _writer.WriteValue(_stateId);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Code);
                        _writer.WriteValue(_stateCode);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Name);
                        _writer.WriteValue(_stateName);

                        _writer.WriteEndObject();
                    }
                    _writer.WriteEnd();

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();
                    //{
                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CachedCheckTime);
                    _writer.WriteValue(_stats.CacheCheckTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    // }                   
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
                    _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                    //_functionReturn.Status = false;
                    //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    //_functionReturn.Message.Add(ex.Message);
                    //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_cachecheckTime"></param>
        /// <param name="_id"></param>
        /// <returns></returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStateListByCountryIdAsync(int _id)
        {
            return Task.Run(() => GetStateListByCountryId(_id));
        }

        private (string jsonReturn, IFunctionReturn functionReturn) GetDistrictListByStateId(int _id)
        {
            string _methodName = "F:Shared:GetDistrictListByStateId";
            #region Local Variables
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;

            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300

            int _districtId = 0;
            string _districtName = string.Empty;

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
                    _sqlQuery.Append(" SELECT id, district_name FROM districts_main");
                    _sqlQuery.Append(" WHERE state_id = " + _id + "");
                    _sqlQuery.Append(" AND status = 1 ");
                    _sqlQuery.Append(" ORDER BY district_name; ");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    // {
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;
                    //start data array
                    // "collection_name": [
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Districts);
                    _writer.WriteStartArray();
                    foreach (DataRow row in _dataTable.Rows)
                    {
                        //check NULLS and DATA TYPE here for returned column values
                        _districtId = row["id"] == DBNull.Value ? 0 : Convert.ToInt32(row["id"]);
                        _districtName = row["district_name"] == DBNull.Value ? "" : Convert.ToString(row["district_name"]);

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                        _writer.WriteValue(_districtId);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Name);
                        _writer.WriteValue(_districtName);

                        _writer.WriteEndObject();
                    }
                    _writer.WriteEnd();

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();
                    //{
                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CachedCheckTime);
                    _writer.WriteValue(_stats.CacheCheckTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    // }                   
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
                    _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                    //_functionReturn.Status = false;
                    //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    //_functionReturn.Message.Add(ex.Message);
                    //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_cachecheckTime"></param>
        /// <param name="_id"></param>
        /// <returns></returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetDistrictListByStateIdAsync(int _id)
        {
            return Task.Run(() => GetDistrictListByStateId(_id));
        }

        private (string jsonReturn, IFunctionReturn functionReturn) GetCityListByDistrictId(int _id)
        {
            string _methodName = "F:Shared:GetCityListByDistrictId";
            #region Local Variables
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;

            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300

            int _cityId = 0;
            string _cityName = string.Empty;

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
                    _sqlQuery.Append(" SELECT id, city_name FROM cities_main");
                    _sqlQuery.Append(" WHERE district_id = " + _id + "");
                    _sqlQuery.Append(" AND status = 1 ");
                    _sqlQuery.Append(" ORDER BY city_name; ");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    // {
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;
                    //start data array
                    // "collection_name": [
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Cities);
                    _writer.WriteStartArray();
                    foreach (DataRow row in _dataTable.Rows)
                    {
                        //check NULLS and DATA TYPE here for returned column values
                        _cityId = row["id"] == DBNull.Value ? 0 : Convert.ToInt32(row["id"]);
                        _cityName = row["city_name"] == DBNull.Value ? "" : Convert.ToString(row["city_name"]);

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                        _writer.WriteValue(_cityId);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Name);
                        _writer.WriteValue(_cityName);

                        _writer.WriteEndObject();
                    }
                    _writer.WriteEnd();

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();
                    //{
                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CachedCheckTime);
                    _writer.WriteValue(_stats.CacheCheckTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    // }                   
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
                    _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                    //_functionReturn.Status = false;
                    //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    //_functionReturn.Message.Add(ex.Message);
                    //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListByDistrictIdAsync(int _id)
        {
            return Task.Run(() => GetCityListByDistrictId(_id));
        }


        private (string jsonReturn, IFunctionReturn functionReturn) GetCityListByStateId(int _id)
        {
            string _methodName = "F:Shared:GetCityListByStateId";
            #region Local Variables
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;

            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300

            int _cityId = 0;
            string _cityName = string.Empty;

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
                    _sqlQuery.Append(" SELECT cm.id, city_name FROM cities_main cm");
                    _sqlQuery.Append(" JOIN districts_main dm ON cm.district_id = dm.id");
                    _sqlQuery.Append(" WHERE dm.state_id = " + _id + "");
                    _sqlQuery.Append(" AND cm.status = 1 ");
                    _sqlQuery.Append(" ORDER BY city_name; ");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    // {
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;
                    //start data array
                    // "collection_name": [
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Cities);
                    _writer.WriteStartArray();
                    foreach (DataRow row in _dataTable.Rows)
                    {
                        //check NULLS and DATA TYPE here for returned column values
                        _cityId = row["id"] == DBNull.Value ? 0 : Convert.ToInt32(row["id"]);
                        _cityName = row["city_name"] == DBNull.Value ? "" : Convert.ToString(row["city_name"]);

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                        _writer.WriteValue(_cityId);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Name);
                        _writer.WriteValue(_cityName);

                        _writer.WriteEndObject();
                    }
                    _writer.WriteEnd();

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();
                    //{
                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CachedCheckTime);
                    _writer.WriteValue(_stats.CacheCheckTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    // }                   
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
                    _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                    //_functionReturn.Status = false;
                    //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    //_functionReturn.Message.Add(ex.Message);
                    //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListByStateIdAsync(int _id)
        {
            return Task.Run(() => GetCityListByStateId(_id));
        }
        /// <summary>
        /// Get Country List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCountryList()
        {
            string _methodName = "F:Shared:GetCountryList";
            #region Local Variables
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;

            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300

            int _id = 0;
            string _code = "";
            string _name = "";

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
                    _sqlQuery.Append(" SELECT id, code, name FROM countries_main where status = 1 order by id; ");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    // {
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;
                    //start data array
                    // "collection_name": [
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Countries);
                    _writer.WriteStartArray();
                    foreach (DataRow row in _dataTable.Rows)
                    {
                        //check NULLS and DATA TYPE here for returned column values
                        _id = row["id"] == DBNull.Value ? 0 : Convert.ToInt32(row["id"]);
                        _code = row["code"] == DBNull.Value ? "" : Convert.ToString(row["code"]);
                        _name = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);

                        _writer.WriteStartObject();
                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                        _writer.WriteValue(_id);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Code);
                        _writer.WriteValue(_code);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Name);
                        _writer.WriteValue(_name);

                        _writer.WriteEndObject();
                    }
                    _writer.WriteEnd();

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Stats);
                    _writer.WriteStartObject();
                    //{
                    _loopEnd = DateTime.Now;
                    _loopTime = (_loopEnd - _loopStart);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CachedCheckTime);
                    _writer.WriteValue(_stats.CacheCheckTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlConnTime);
                    _writer.WriteValue(_sqlconnTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SqlQueryTime);
                    _writer.WriteValue(_queryTime?.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LoopTime);
                    _writer.WriteValue(_loopTime.TotalMilliseconds.ToString() + ApplicationJsonReturnConstants.PropertyNames.MS);

                    // }                   
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
                    _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                    //_functionReturn.Status = false;
                    //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                    //_functionReturn.Message.Add(ex.Message);
                    //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Get Country List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCountryListAsync()
        {
            return Task.Run(() => GetCountryList());
        }

        /// <summary>
        /// Get Category List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCategoryListAsync()
        {
            return Task.Run(() => GetCategoryList());
        }

        /// <summary>
        /// Get Country List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCategoryList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetCategoryList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, category_guid as guid, description, status ");
                    _sqlQuery.Append(" from category_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Category, _dictionary, _stats.CacheCheckTime);
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
        /// Get Gender List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetGenderListAsync()
        {
            return Task.Run(() => GetGenderList());
        }

        /// <summary>
        /// Get Gender List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetGenderList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetGenderList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _sqlQuery.Clear();
                    _sqlQuery.Append(" select id, name, code, gender_guid as guid, description, status ");
                    _sqlQuery.Append(" from gender_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Gender, _dictionary, _stats.CacheCheckTime);
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
        /// Get City List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListAsync(int _stateid)
        {
            return Task.Run(() => GetCityList(_stateid));
        }

        /// <summary>
        /// Get City List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCityList(int? _stateId)
        {
            #region Local Variables
            string _methodName = "F:Shared:GetCityList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" SELECT CM.id, CM.name, CM.code, CM.city_guid as guid,CM.status ");
                    _sqlQuery.Append(" FROM city_main CM");
                    _sqlQuery.Append(" INNER JOIN states_main SM ON SM.guid=CM.state_guid");
                    _sqlQuery.Append(" WHERE CM.status = 1 AND SM.id=" + (_stateId <= 0 || _stateId == null ? "SM.id" : Convert.ToString(_stateId)) + " ORDER BY CM.name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                       // { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.City, _dictionary, _stats.CacheCheckTime);
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
        /// Get Special Category List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetSpecialCategoryListAsync()
        {
            return Task.Run(() => GetSpecialCategoryList());
        }

        /// <summary>
        /// Get Special Category List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetSpecialCategoryList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetSpecialCategoryList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, special_category_guid as guid, description, status ");
                    _sqlQuery.Append(" from special_category ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.SpecialCategory, _dictionary, _stats.CacheCheckTime);
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
        /// Get Title List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetTitleListAsync()
        {
            return Task.Run(() => GetTitleList());
        }

        /// <summary>
        /// Get Title List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetTitleList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetTitleList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, title_guid as guid, description, status ");
                    _sqlQuery.Append(" from title_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Title, _dictionary, _stats.CacheCheckTime);
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
        /// Get Qualification List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetQualificationListAsync()
        {
            return Task.Run(() => GetQualificationList());
        }

        /// <summary>
        /// Get Qualification List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetQualificationList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetQualificationList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, qualification_guid as guid, description, status ");
                    _sqlQuery.Append(" from qualification_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Qualification, _dictionary, _stats.CacheCheckTime);
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
        /// Get Post List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetPostListAsync()
        {
            return Task.Run(() => GetPostList());
        }

        /// <summary>
        /// Get Post List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetPostList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetPostList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, CONCAT(code, ' - ' , name) as name, code, post_guid as guid, description, status ");
                    _sqlQuery.Append(" from post_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Post, _dictionary, _stats.CacheCheckTime);
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
        /// Get IdProof List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetIdProofListAsync()
        {
            return Task.Run(() => GetIdProofList());
        }

        /// <summary>
        /// Get IdProof List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetIdProofList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetIdProofList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, id_proof_guid as guid, description, status ");
                    _sqlQuery.Append(" from id_proof_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.IdProof, _dictionary, _stats.CacheCheckTime);
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
        /// Get Relation List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetRelationListAsync()
        {
            return Task.Run(() => GetRelationList());
        }

        /// <summary>
        /// Get Relation List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetRelationList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetRelationList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, relation_guid as guid, description, status ");
                    _sqlQuery.Append(" from relation_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Relation, _dictionary, _stats.CacheCheckTime);
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
        /// Get Religion List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetReligionListAsync()
        {
            return Task.Run(() => GetReligionList());
        }

        /// <summary>
        /// Get Religion List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetReligionList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetReligionList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, religion_guid as guid, description, status ");
                    _sqlQuery.Append(" from religion_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Religion, _dictionary, _stats.CacheCheckTime);
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
        /// Get Course List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCourseListAsync()
        {
            return Task.Run(() => GetCourseList());
        }

        /// <summary>
        /// Get Course List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCourseList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetCourseList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, course_guid as guid, description, status ");
                    _sqlQuery.Append(" from course_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Course, _dictionary, _stats.CacheCheckTime);
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
        /// Get Nationality List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetNationalityListAsync()
        {
            return Task.Run(() => GetNationalityList());
        }

        /// <summary>
        /// Get Nationality List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetNationalityList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetNationalityList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, nationality_guid as guid, description, status ");
                    _sqlQuery.Append(" from nationality_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Nationality, _dictionary, _stats.CacheCheckTime);
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
        /// Get Board List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetBoardListAsync()
        {
            return Task.Run(() => GetBoardList());
        }

        /// <summary>
        /// Get Board List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetBoardList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetBoardList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, board_guid as guid, description, status ");
                    _sqlQuery.Append(" from board_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Board, _dictionary, _stats.CacheCheckTime);
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
        /// Get University List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetUniversityListAsync()
        {
            return Task.Run(() => GetUniversityList());
        }

        /// <summary>
        /// Get University List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetUniversityList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetUniversityList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, university_guid as guid, description, status ");
                    _sqlQuery.Append(" from university_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.University, _dictionary, _stats.CacheCheckTime);
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
        /// Get Stream List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStreamListAsync()
        {
            return Task.Run(() => GetStreamList());
        }

        /// <summary>
        /// Get Stream List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetStreamList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetStreamList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, stream_guid as guid, description, status ");
                    _sqlQuery.Append(" from stream_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Stream, _dictionary, _stats.CacheCheckTime);
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
        /// Get Martial Status List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetMartialStatusListAsync()
        {
            return Task.Run(() => GetMartialStatusList());
        }

        /// <summary>
        /// Get Martial Status List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetMartialStatusList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetMartialStatusList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, martial_status_guid as guid, description, status ");
                    _sqlQuery.Append(" from martial_status_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.MartialStatus, _dictionary, _stats.CacheCheckTime);
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
        /// Get Exam Medium List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetExamMediumListAsync()
        {
            return Task.Run(() => GetExamMediumList());
        }

        /// <summary>
        /// Get Exam Medium List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetExamMediumList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetExamMediumList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, exam_medium_guid as guid, description, status ");
                    _sqlQuery.Append(" from exam_medium_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.ExamMedium, _dictionary, _stats.CacheCheckTime);
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
        /// Validate Unique Component Async
        /// </summary>
        /// <param name="validateComponent"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> ValidateUniqueComponentAsync(ValidateComponent validateComponent)
        {
            return Task.Run(() => ValidateUniqueComponent(validateComponent));
        }

        /// <summary>
        /// Validate Unique Component
        /// </summary>
        /// <param name="validateComponent"></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) ValidateUniqueComponent(ValidateComponent validateComponent)
        {
            #region Local Variables
            string _methodName = "F:Reg:ValidateUniqueComponent";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300
            string _candidateGuid = string.Empty;
            string _name = "";
            string _data_value = "";
            bool _unique = false;
            DateTime _loopStart;
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

                    //if (string.IsNullOrEmpty(validateComponent.CandidateGuid))
                    //{
                    //    _sqlQuery.Append(" select d.candidate_guid, c.name, d.datavalue, v.isunique ");
                    //    _sqlQuery.Append(" from components_main c ");
                    //    _sqlQuery.Append(" join  data_save_main d on c.id=d.comp_id ");
                    //    _sqlQuery.Append(" join validations_main v on c.id=v.component_id ");
                    //    _sqlQuery.Append(" where ");
                    //    _sqlQuery.Append(" c.name = '" + validateComponent.ComponentName + "'");
                    //    _sqlQuery.Append(" and d.datavalue = '" + validateComponent.ComponentValue + "'");
                    //    _sqlQuery.Append(" and d.candidate_guid != '" + validateComponent.CandidateGuid + "'");
                    //    _sqlQuery.Append(" order by d.id; ");
                    //}
                    //else
                    //{
                    _sqlQuery.Append(" select d.candidate_guid, c.name, d.datavalue, v.isunique ");
                    _sqlQuery.Append(" from components_main c ");
                    _sqlQuery.Append(" join  data_save_main_live d on c.id=d.comp_id ");
                    _sqlQuery.Append(" join validations_main v on c.id=v.component_id ");
                    _sqlQuery.Append(" where ");
                    _sqlQuery.Append(" c.name = '" + validateComponent.ComponentName + "'");
                    _sqlQuery.Append(" and d.datavalue = '" + validateComponent.ComponentValue + "'");
                    if (!string.IsNullOrEmpty(validateComponent.CandidateGuid))
                        _sqlQuery.Append(" and d.candidate_guid != '" + validateComponent.CandidateGuid + "'");
                    _sqlQuery.Append(" order by d.id; ");

                    //}
                    var options = new JsonWriterOptions
                    {
                        Indented = true
                    };
                    using (var stream = new MemoryStream())
                    {
                        using (var _writer = new Utf8JsonWriter(stream, options))
                        {
                            //Call Function
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            // Start Main Object Json
                            _writer.WriteStartObject();
                            _loopStart = DateTime.Now;

                            _writer.WriteStartArray(ApplicationJsonReturnConstants.PropertyNames.Components);
                            if (_dataTable.Rows.Count <= 0)
                            {
                                _writer.WriteStartObject();
                                _writer.WriteEndObject();
                                _functionReturn.Status = true;
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                                _functionReturn.MessageType = ApplicationConstants.GenericMessages.RecordNotFound;
                            }
                            else
                            {
                                if (_dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow row in _dataTable.Rows)
                                    {
                                        //check NULLS and DATA TYPE here for returned column values
                                        _candidateGuid = row["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(row["candidate_guid"]);
                                        _name = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);
                                        _data_value = row["datavalue"] == DBNull.Value ? "" : Convert.ToString(row["datavalue"]);
                                        _unique = row["isunique"] == DBNull.Value ? false : Convert.ToBoolean(row["isunique"]);

                                        //if (_unique == true)
                                        //{
                                        //    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.AlreadyReported;
                                        //    _functionReturn.MessageType = GenericMessages.RecordAlreadyExists;
                                        //}
                                        //else
                                        //{
                                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.AlreadyReported;
                                        _functionReturn.MessageType = GenericMessages.MultipleRecordCanNotBeInserted;
                                        //}
                                        _writer.WriteStartObject();

                                        _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid, _candidateGuid.ToString());
                                        _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ComponentName, _name);
                                        _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataValue, _data_value);
                                        _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.ValidationUnique, _unique);

                                        _writer.WriteEndObject();
                                        _functionReturn.Status = true;

                                        break;
                                    }
                                }
                                else
                                {
                                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                                    _functionReturn.MessageType = GenericMessages.RecordNotFound;
                                    _functionReturn.Status = true;
                                }
                            }
                            _writer.WriteEndArray();

                            _writer.WriteEndObject();


                        }
                        _jsonReturn = Encoding.UTF8.GetString(stream.ToArray());
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    try
                    {
                        _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                        _functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(ex.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
                        _functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(exTran.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, exTran.Message);
                    }
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }



        private (string jsonReturn, IFunctionReturn functionReturn) GetCaptcha(UInt64 _captchaId)
        {
            #region Local Variables
            string _methodName = "F:Shared:GetCaptcha";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            int _rowsAffected = 0;
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            bool _success = true;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            StringWriter _sw;
            JsonTextWriter _writer;
            Int64 _isExist = 0;
            //JSON data
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    int _width = 100;
                    int _height = 36;
                    var _captchaCode = GenerateCaptchaCode();
                    var _result = GenerateCaptchaImage(_width, _height, _captchaCode);
                    _sqlConnectionString = _databaseSettings.MySqlConnection;
                    using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                    {
                        try
                        {
                            _mySqlCommand = new MySqlCommand();
                            // Open connection;
                            _sqlconnStart = DateTime.Now;
                            _mySqlConnection.Open();

                            _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                            _mySqlCommand.Connection = _mySqlConnection;
                            _mySqlCommand.Transaction = _mytransaction;

                            _sqlconnEnd = DateTime.Now;
                            _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                            _sqlQuery = new StringBuilder();

                            //Check captcha Id exist
                            _sqlQuery.Clear();
                            _sqlQuery.Append(" SELECT COUNT(1) FROM captcha_validation");
                            _sqlQuery.Append(" where captcha_id='" + _captchaId + "';");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _isExist = Convert.ToInt64(_mySqlCommand.ExecuteScalar());
                            if (_isExist > 0)
                            {

                                _sqlQuery.Clear();
                                _sqlQuery.Append(" UPDATE captcha_validation SET");
                                _sqlQuery.Append(" captcha_code='" + _captchaCode + "'");
                                _sqlQuery.Append(" where captcha_id='" + _captchaId + "'; ");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                if (_rowsAffected <= 0)
                                {
                                    _success = false;
                                }

                            }

                            else
                            {
                                //Insert captcha Id

                                _sqlQuery.Clear();
                                _sqlQuery.Append("INSERT INTO `captcha_validation` (");
                                _sqlQuery.Append("`captcha_code`");
                                _sqlQuery.Append(",`captcha_id`");
                                _sqlQuery.Append(") VALUES (");
                                _sqlQuery.Append("'" + _captchaCode + "'");
                                _sqlQuery.Append(",'" + _captchaId + "'");
                                _sqlQuery.Append(");");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                if (_rowsAffected <= 0)
                                {
                                    _success = false;
                                }
                            }

                            // create json
                            _sw = new StringWriter();
                            _writer = new JsonTextWriter(_sw);
                            if (_success)
                            {
                                // {
                                _writer.WriteStartObject();
                                // "collection_name": [
                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CaptchaDetails);
                                _writer.WriteStartObject();

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CaptchaImage);
                                _writer.WriteValue(_result);

                                _writer.WriteEndObject();
                                _writer.WriteEndObject();
                            }
                            _jsonReturn = _sw.ToString();
                            _writer = null;

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                //Success
                                _functionReturn = new FunctionReturn();
                                _functionReturn.Status = true;
                                _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                                // _functionReturn.Message.Add(ApplicationConstants.GenericMessages.PaymentResponseAddedSuccessfully);
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                if (_functionReturn == null)
                                    _functionReturn = new FunctionReturn();
                                //No Data // Need to send blank JSON object instead of error
                                _functionReturn.Status = false;
                                _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                CommonFunctions.Log(Enumeration.LogLevel.Error, _loggerFunctions, $"Unexpected Error - {ex.Message}", _methodName);
                                _functionReturn = new FunctionReturn();
                                _mytransaction?.Rollback();
                                _functionReturn.Status = false;
                                _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                                _functionReturn.Message.Add(ex.Message);
                                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
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
                    _jsonReturn = string.Empty;
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
            return (_jsonReturn, _functionReturn);
        }



        public Task<(string jsonReturn, IFunctionReturn)> GetCaptchaAsync(UInt64 _captchaId)
        {
            return Task.Run(() => GetCaptcha(_captchaId));
        }



        public static string GenerateCaptchaCode()
        {
            const string Letters = "12346789abcdefghijklmnpqrstuvwxyzABCDEFGHJKLMNPRTUVWXYZ";

            Random rand = new Random();
            int maxRand = Letters.Length - 1;

            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < 5; i++)
            {
                int index = rand.Next(maxRand);
                sb.Append(Letters[index]);
            }

            return sb.ToString();
        }

        public static string GenerateCaptchaImage(int width, int height, string captchaCode)
        {
            using (Bitmap baseMap = new Bitmap(width, height))
            using (Graphics graph = Graphics.FromImage(baseMap))
            {
                Random rand = new Random();

                graph.Clear(GetRandomLightColor());

                DrawCaptchaCode();
                DrawDisorderLine();

                MemoryStream ms = new MemoryStream();

                baseMap.Save(ms, ImageFormat.Png);

                return Convert.ToBase64String(ms.ToArray());

                int GetFontSize(int imageWidth, int captchCodeCount)
                {
                    var averageSize = imageWidth / captchCodeCount;

                    return Convert.ToInt32(averageSize);
                }

                Color GetRandomDeepColor()
                {
                    int redlow = 160, greenLow = 100, blueLow = 160;
                    return Color.FromArgb(rand.Next(redlow), rand.Next(greenLow), rand.Next(blueLow));
                }

                Color GetRandomLightColor()
                {
                    int low = 180, high = 255;

                    int nRend = rand.Next(high) % (high - low) + low;
                    int nGreen = rand.Next(high) % (high - low) + low;
                    int nBlue = rand.Next(high) % (high - low) + low;

                    return Color.FromArgb(nRend, nGreen, nBlue);
                }

                void DrawCaptchaCode()
                {
                    SolidBrush fontBrush = new SolidBrush(Color.Black);
                    int fontSize = GetFontSize(width, captchaCode.Length);
                    Font font = new Font(FontFamily.GenericSerif, fontSize, FontStyle.Bold, GraphicsUnit.Pixel);
                    for (int i = 0; i < captchaCode.Length; i++)
                    {
                        fontBrush.Color = GetRandomDeepColor();

                        int shiftPx = fontSize / 6;

                        float x = i * fontSize + rand.Next(-shiftPx, shiftPx) + rand.Next(-shiftPx, shiftPx);
                        int maxY = height - fontSize;
                        if (maxY < 0) maxY = 0;
                        float y = rand.Next(0, maxY);

                        graph.DrawString(captchaCode[i].ToString(), font, fontBrush, x, y);
                    }
                }
                void DrawDisorderLine()
                {
                    Pen linePen = new Pen(new SolidBrush(Color.Black), 3);
                    for (int i = 0; i < rand.Next(3, 5); i++)
                    {
                        linePen.Color = GetRandomDeepColor();

                        System.Drawing.Point startPoint = new System.Drawing.Point(rand.Next(0, width), rand.Next(0, height));
                        System.Drawing.Point endPoint = new System.Drawing.Point(rand.Next(0, width), rand.Next(0, height));
                        //graph.DrawLine(linePen, startPoint, endPoint);

                        //Point bezierPoint1 = new Point(rand.Next(0, width), rand.Next(0, height));
                        //Point bezierPoint2 = new Point(rand.Next(0, width), rand.Next(0, height));

                        //graph.DrawBezier(linePen, startPoint, bezierPoint1, bezierPoint2, endPoint);
                    }
                }


            }
        }



        /// <summary>
        /// Validate City Component Async
        /// </summary>
        /// <param name="_validateComponent"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<IFunctionReturn> ValidateCityComponentAsync(IValidateComponent _validateComponent)
        {
            return Task.Run(() => ValidateCityComponent(_validateComponent));
        }

        /// <summary>
        ///Validate City Component
        /// </summary>
        /// <param name="_validateComponent"></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn ValidateCityComponent(IValidateComponent _validateComponent)
        {
            #region Local Variables
            string _methodName = "F:Shared:ValidateCityComponent";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
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
                    _sqlQuery.Clear();
                    if (string.IsNullOrEmpty(Sanitization.Sanitize(_validateComponent.ExamGuid)))
                    {
                        _sqlQuery.Append(" select d.reg_id,d.candidate_guid, c.name, d.datavalue");
                        _sqlQuery.Append(" from components_main c ");
                        _sqlQuery.Append(" join  data_save_main_live d on c.id=d.comp_id ");
                        _sqlQuery.Append(" where ");
                        _sqlQuery.Append(" c.name IN('NgxIxcheckCityPriority1','NgxIxcheckCityPriority2','NgxIxcheckCityPriority3')");
                        _sqlQuery.Append(" and d.datavalue = '" + _validateComponent.ComponentValue + "'");
                        _sqlQuery.Append(" and d.candidate_guid = '" + _validateComponent.CandidateGuid + "';");
                    }
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    if (_dataTable.Rows.Count > 0)
                    {
                        _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.CityPriorityAlreadySelected, _methodName);
                    }
                    else
                    {
                        _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordNotFound, _methodName);
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    try
                    {
                        _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                        _functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(ex.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
                        _functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(exTran.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, exTran.Message);
                    }
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return _functionReturn;
        }

        /// <summary>
        /// Get Reg Type List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetRegTypeListAsync(string _regGuid)
        {
            return Task.Run(() => GetRegTypeList(_regGuid));
        }

        /// <summary>
        /// Get Reg Type List
        /// </summary>
        /// <param name="_regGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetRegTypeList(string _regGuid)
        {
            #region Local Variables
            string _methodName = "F:Shared:GetRegTypeList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            DataTable _dataTable = null;

            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            DateTime _loopStart;

            UInt64 _id = 0;
            string _guid = "";
            string _name = "";
            string _description = "";
            string _status = "";


            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, guid, description, status, registration_guid as reg_guid ");
                    _sqlQuery.Append(" from reg_types ");
                    _sqlQuery.Append(" WHERE registration_guid ='" + _regGuid + "' ");
                    _sqlQuery.Append(" and status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    var options = new JsonWriterOptions
                    {
                        Indented = true
                    };
                    using (var stream = new MemoryStream())
                    {
                        using (var _writer = new Utf8JsonWriter(stream, options))
                        {

                            //Call Function
                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);


                            // Start Main Object Json
                            _writer.WriteStartObject();
                            _loopStart = DateTime.Now;
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.RegTypeListComponent);
                            _writer.WriteStartObject();
                            //_writer.WriteStartObject(ApplicationJsonReturnConstants.PropertyNames.Layout);
                            //_writer.WriteStartObject();

                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.Visible, "yes");
                            _writer.WriteStartArray(ApplicationJsonReturnConstants.PropertyNames.RegTypeList);
                            if (_dataTable.Rows.Count <= 0)
                            {
                                _writer.WriteStartObject();
                                _writer.WriteEndObject();

                            }
                            else
                            {
                                foreach (DataRow row in _dataTable.Rows)
                                {
                                    //check NULLS and DATA TYPE here for returned column values
                                    _id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                                    _guid = row["guid"] == DBNull.Value ? "" : Convert.ToString(row["guid"]);
                                    _name = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);
                                    _description = row["description"] == DBNull.Value ? "" : Convert.ToString(row["description"]);
                                    _status = row["status"] == DBNull.Value ? "" : Convert.ToString(row["status"]);
                                    _writer.WriteStartObject();

                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutId, _id.ToString());
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.RegTypeLabel, _name);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.RegTypeGuid, _guid);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.Selected, "no");
                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutStatus, _layout_status);
                                    _writer.WriteEndObject();
                                }
                            }
                            _writer.WriteEndArray();
                            _writer.WriteEndObject();
                            _writer.WriteEndObject();
                            _functionReturn.Status = true;
                        }
                        _jsonReturn = Encoding.UTF8.GetString(stream.ToArray());

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
        /// LogActivityType
        /// </summary>
        /// <param name="_candidateGuid"></param>
        /// <param name="_activityTypeId"></param>
        /// <param name="_logDescription"></param>
        /// <returns>IFunctionReturn</returns>
        public IFunctionReturn LogCandidateActivityAsync(string _candidateGuid, int _activityTypeId, string _logDescription)
        {
            return LogCandidateActivity(_candidateGuid, _activityTypeId, _logDescription);
        }

        /// <summary>
        /// LogActivityType
        /// </summary>
        /// <param name="_candidateGuid"></param>
        /// <param name="_activityTypeId"></param>
        /// <param name="_logDescription"></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn LogCandidateActivity(string _candidateGuid, int _activityTypeId, string _logDescription)
        {
            #region Local Variables
            string _methodName = "F:Shared:LogCandidateActivity";
            MySqlConnection _mySqlConnection = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlTransaction _mytransaction = null;
            MySqlCommand _mySqlCommand = null;
            string _sqlConnectionString = string.Empty;
            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            TimeSpan? _sqlconnTime = null;
            string _jsonReturn;
            #endregion
            #region Input Sanitization and Validation
            string _errorMessage = "";
            try
            {
                if (string.IsNullOrEmpty(_candidateGuid))
                    _errorMessage = ApplicationConstants.ValidationMessages.DataRequired;
                else
                {
                    _candidateGuid = Sanitization.Sanitize(_candidateGuid);
                    _logDescription = Sanitization.Sanitize(_logDescription);
                    if (string.IsNullOrEmpty(_candidateGuid))
                        _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;
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
                    //build mysql connection string
                    _sqlConnectionString = _databaseSettings.MySqlConnection;
                    using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                    {
                        _mySqlCommand = new MySqlCommand
                        {
                            CommandTimeout = _databaseSettings.MySqlTimeout
                        };
                        _sqlconnStart = DateTime.Now;
                        _mySqlConnection.Open();
                        _sqlconnEnd = DateTime.Now;
                        _sqlconnTime = (_sqlconnEnd - _sqlconnStart);
                        _mytransaction = _mySqlConnection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                        _mySqlCommand.Connection = _mySqlConnection;
                        _mySqlCommand.Transaction = _mytransaction;
                        #region Add activity log
                        _sqlQuery = new StringBuilder();
                        _sqlQuery.Clear();
                        _sqlQuery.Append("INSERT INTO reg_activity_log(");
                        _sqlQuery.Append("candidate_guid,");
                        _sqlQuery.Append("activity_type_id,");
                        _sqlQuery.Append("log_description,");
                        _sqlQuery.Append("timestamp) VALUES(");
                        _sqlQuery.Append("'" + _candidateGuid + "',");
                        _sqlQuery.Append("'" + _activityTypeId + "',");
                        _sqlQuery.Append("'" + _logDescription + "',");
                        _sqlQuery.Append("CURRENT_TIMESTAMP());");
                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                        int _rowsAffected = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());

                        if (_rowsAffected > 0)
                        {
                            _mytransaction?.Commit();
                            //Success
                            _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.CandidateActivityLogSubmitted, _methodName);
                        }
                        else
                        {
                            _mytransaction?.Rollback();
                            if (string.IsNullOrEmpty(_errorMessage))
                                _errorMessage = Constants.GenericMessages.ErrorInSavingRecord;
                        }
                        _mySqlCommand?.Dispose();

                        if (!string.IsNullOrEmpty(_errorMessage))
                            _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                        #endregion
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _jsonReturn = string.Empty;
                        _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.SystemError(exTran.Message, _methodName);
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != System.Data.ConnectionState.Closed)
                    {
                        _mySqlConnection?.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlCommand = null;
                    _sqlQuery = null;
                    _sqlConnectionString = string.Empty;
                }
            }
            return _functionReturn;
        }

        /// <summary>
        /// Get City List Priority Async
        /// </summary>
        /// <param name="_registrationGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCityListPriorityAsync(string _registrationGuid)
        {
            return Task.Run(() => GetCityListPriority(_registrationGuid));
        }

        /// <summary>
        ///  Get City List Priority
        /// </summary>
        /// <param name="_registrationGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCityListPriority(string _registrationGuid)
        {
            #region Local Variables
            string _methodName = "F:Shared:GetCityListPriority";
            StringBuilder _sqlQuery = new StringBuilder();
            IFunctionReturn _functionReturn = new FunctionReturn();
            string _jsonReturn = string.Empty;
            #endregion
            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery.Append("SELECT CM.id,RTC.city_number,RTC.city_guid guid,CM.name,CM.state_guid,SM.name state_name,CM.code");
                    _sqlQuery.Append(" FROM registrations_to_cities RTC INNER JOIN city_main CM ON CM.city_guid=RTC.city_guid");
                    _sqlQuery.Append(" INNER JOIN states_main SM ON SM.guid=CM.state_guid");
                    _sqlQuery.Append(" WHERE RTC.registration_guid='" + Sanitization.Sanitize(_registrationGuid) + "' AND CM.status<>2;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                         { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.CityNumber, (ApplicationJsonReturnConstants.PropertyNames.CityNumber, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.StateGuid, (ApplicationJsonReturnConstants.PropertyNames.StateGuid, DatabaseConstants.DataTypes.String) },
                         { ApplicationDatabaseConstants.ColumnNames.StateName, (ApplicationJsonReturnConstants.PropertyNames.StateName, DatabaseConstants.DataTypes.String) },
                          { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.City, _dictionary, _stats.CacheCheckTime);
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
        /// Get Certificate Issuing Authority Async
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCertificateIssuingAuthorityAsync()
        {
            return Task.Run(() => GetCertificateIssuingAuthority());
        }

        /// <summary>
        ///  Get Certificate Issuing Authority
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCertificateIssuingAuthority()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetCertificateIssuingAuthority";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append("SELECT id, name, code, guid, description, status ");
                    _sqlQuery.Append(" FROM reg_certificate_issuing_authority ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.CertificateIssuingAuthority, _dictionary, _stats.CacheCheckTime);
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
        /// Get Certificate Issuing District Async
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCertificateIssuingDistrictAsync()
        {
            return Task.Run(() => GetCertificateIssuingDistrict());
        }

        /// <summary>
        ///  Get Certificate Issuing District
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCertificateIssuingDistrict()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetCertificateIssuingDistrict";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append("SELECT id, name, code, guid, description, status ");
                    _sqlQuery.Append(" FROM reg_certificate_issuing_district ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.CertificateIssuingDistrict, _dictionary, _stats.CacheCheckTime);
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
        /// Ai Validations Async
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public (string jsonReturn, IFunctionReturn functionReturn) AiValidations(AiImageValidation _aiImageValidation)
        {
            #region Local Variables
            string _methodName = "F:Shared:AiValidations";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            //JSON data
            DataSet _dataSet = null;
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            string _blueMin = "";
            string _blueMax = "";
            string _greenMin = "";
            string _greenMax = "";
            string _redMin = "";
            string _redMax = "";
            string _colorPercentMin = "";
            string _colorPercentMax = "";
            string _facePercentMin = "";
            string _facePercentMax = "";
            string _compId = "";
            string _image = "";
            string _algoGuid = "";
            string _color = "";
            UInt64 _height = 0;
            UInt64 _width = 0;
            string _regGuid = "";
            string _endPoint = _methodName;
            string _createLog = "";


            #endregion
            DateTime _loopStart;
            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_aiImageValidation == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.ImageDataRequired;
                }
                else
                {
                    _compId = Sanitization.Sanitize(_aiImageValidation.ComponentId);
                    _image = Sanitization.Sanitize(_aiImageValidation.Image);
                    _createLog = Sanitization.Sanitize(_aiImageValidation.CreateLog);
                    _regGuid = Sanitization.Sanitize(_aiImageValidation.RegGuid);
                }
                if (string.IsNullOrEmpty(_compId))
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.ComponentIdRequired;
                }
                else if (string.IsNullOrEmpty(_image))
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.ImageIsRequired;
                }
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _dataSet = new DataSet();
                    _sqlconnTime = new TimeSpan();
                    _queryTime = new TimeSpan();

                    _sqlQuery.Clear();
                    _sqlQuery.Append("SELECT rcai.blue_percent_min,rcai.blue_percent_max,rcai.green_percent_min,rcai.green_percent_max, ");
                    _sqlQuery.Append("rcai.red_percent_min,rcai.red_percent_max,rcas.color_percent_min,rcas.color_percent_max, ");
                    _sqlQuery.Append("rcas.face_percent_min,rcas.face_percent_max,cm.name as color,sm.height,sm.width,rcas.algo_guid ");
                    _sqlQuery.Append("FROM reg_components_ai_setting rcas ");
                    _sqlQuery.Append("INNER JOIN reg_components_ai_color rcai ON rcai.reg_components_ai_setting_id = rcas.id ");
                    _sqlQuery.Append("INNER JOIN color_main cm ON cm.guid = rcai.color_guid ");
                    _sqlQuery.Append("INNER JOIN settings_main sm ON sm.component_id = rcas.comp_id ");
                    _sqlQuery.Append("WHERE rcas.comp_id = '" + _compId + "' ; ");
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    foreach (DataRow row in _dataTable.Rows)
                    {
                        //check NULLS and DATA TYPE here for returned column values                               
                        _blueMin = Convert.ToString(row["blue_percent_min"]);
                        _blueMax = Convert.ToString(row["blue_percent_max"]);
                        _greenMin = Convert.ToString(row["green_percent_min"]);
                        _greenMax = Convert.ToString(row["green_percent_max"]);
                        _redMin = Convert.ToString(row["red_percent_min"]);
                        _redMax = Convert.ToString(row["red_percent_max"]);
                        _colorPercentMin = Convert.ToString(row["color_percent_min"]);
                        _colorPercentMax = Convert.ToString(row["color_percent_max"]);
                        _facePercentMin = Convert.ToString(row["face_percent_min"]);
                        _facePercentMax = Convert.ToString(row["face_percent_max"]);
                        _color = Convert.ToString(row["color"]);
                        _height = row["height"] == DBNull.Value ? 0 : Convert.ToUInt64(row["height"]);
                        _width = row["width"] == DBNull.Value ? 0 : Convert.ToUInt64(row["width"]);
                        _algoGuid = Convert.ToString(row["algo_guid"]);

                    }
                    _aiImageValidation.BlueMin = _blueMin;
                    _aiImageValidation.BlueMax = _blueMax;
                    _aiImageValidation.GreenMin = _greenMin;
                    _aiImageValidation.GreenMax = _greenMax;
                    _aiImageValidation.RedMin = _redMin;
                    _aiImageValidation.RedMax = _redMax;

                    // Load the cascades
                    string haarCascadePath = Path.Combine(AppContext.BaseDirectory, "opencv", "haarcascade_frontalface_alt2.xml");
                    var haarCascade = new CascadeClassifier(haarCascadePath);

                    AiInfo _aiInfo = DetectFace(haarCascade, _aiImageValidation);

                    if (_createLog == "1")
                    {
                        _functionReturn = logsMain(_aiInfo, _color, _algoGuid, _regGuid, _endPoint);
                    }
                    if (_aiInfo.IsData == 2)
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.MultipleFacesDetected;
                    }
                    else if (_aiInfo.IsData == 1)
                    {
                        _sw = new StringWriter();
                        _writer = new JsonTextWriter(_sw);

                        _writer.WriteStartObject();
                        _loopStart = DateTime.Now;

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.photoInfo);

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AlgoGuid);
                        _writer.WriteValue(_algoGuid);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ImageType);
                        _writer.WriteValue(_aiInfo.ImageType);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ImageHeight);
                        _writer.WriteValue(_aiInfo.ImageHeight);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ImageWidth);
                        _writer.WriteValue(_aiInfo.ImageWidth);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorAnalysis);
                        _writer.WriteStartArray();

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Color);
                        _writer.WriteValue(_color);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorPercent);
                        _writer.WriteValue(_aiInfo.ColorPercent);

                        _writer.WriteEndObject();

                        _writer.WriteEnd();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiFaces);
                        _writer.WriteStartArray();

                        _writer.WriteStartObject();

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiPhotoX);
                        _writer.WriteValue(_aiInfo.AiPhotoX);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiPhotoY);
                        _writer.WriteValue(_aiInfo.AiPhotoY);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Height);
                        _writer.WriteValue(_aiInfo.AiPhotoHeight);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Width);
                        _writer.WriteValue(_aiInfo.AiPhotoWidth);

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiPhotoPercent);
                        _writer.WriteValue(_aiInfo.AiPhotoPercent);

                        _writer.WriteEndObject();
                        _writer.WriteEnd();
                        _writer.WriteEndObject();

                        _writer.WriteEndObject();

                        _jsonReturn = _sw.ToString();

                        _sw.Dispose();
                        _writer = null;

                        _functionReturn.Status = true;
                    }
                    else if (_aiInfo.IsData == 3)
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.NoHumanFacesDetected;
                    }
                    if (!string.IsNullOrEmpty(_errorMessage))
                    {
                        _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                }
                finally
                {
                    _sqlQuery = null;
                }
            }
            return (_jsonReturn, _functionReturn);
        }





        /// <summary>
        /// AiValidationsAsync
        /// </summary>
        /// <returns></returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AiValidationsAsync(AiImageValidation _aiImageValidation)
        {
            return Task.Run(() => AiValidations(_aiImageValidation));
        }


        /// <summary>
        /// Analyze Photos Async
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public (string jsonReturn, IFunctionReturn functionReturn) AnalyzePhotos(AiImageValidation _aiImageValidation)
        {
            #region Local Variables
            string _methodName = "F:Shared:AnalyzePhotos";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            //JSON data
            DataSet _dataSet = null;
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            string _blueMin = "200";
            string _blueMax = "255";
            string _greenMin = "200";
            string _greenMax = "255";
            string _redMin = "200";
            string _redMax = "255";
            string _colorPercentMin = "";
            string _colorPercentMax = "";
            string _facePercentMin = "";
            string _facePercentMax = "";
            string _compId = "";
            string _image = "";
            string _algoGuid = "";
            string _color = "";
            UInt64 _height = 0;
            UInt64 _width = 0;
            string _regGuid = "";
            string _endPoint = _methodName;
            string _createLog = "";


            #endregion
            DateTime _loopStart;
            //Validate Input
            string _errorMessage = "";

            try
            {
                //GET DATA
                _sqlQuery = new StringBuilder();
                _dataSet = new DataSet();
                _sqlconnTime = new TimeSpan();
                _queryTime = new TimeSpan();

                _aiImageValidation.BlueMin = _blueMin;
                _aiImageValidation.BlueMax = _blueMax;
                _aiImageValidation.GreenMin = _greenMin;
                _aiImageValidation.GreenMax = _greenMax;
                _aiImageValidation.RedMin = _redMin;
                _aiImageValidation.RedMax = _redMax;

                // Load the cascades
                string haarCascadePath = Path.Combine(AppContext.BaseDirectory, "opencv", "haarcascade_frontalface_alt2.xml");
                var haarCascade = new CascadeClassifier(haarCascadePath);

                List<AiInfo> _aiInfo = DetectFaceNew(haarCascade, _aiImageValidation);

                if (!string.IsNullOrEmpty(_errorMessage))
                {
                    _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                }
                else
                {
                    _jsonReturn = JsonConvert.SerializeObject(_aiInfo, Formatting.Indented);
                }

            }
            catch (Exception ex)
            {
                //ERROR
                _jsonReturn = string.Empty;
                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
            }
            finally
            {
                _sqlQuery = null;
            }
            return (_jsonReturn, _functionReturn);
        }


        /// <summary>
        /// AnalyzePhotos
        /// </summary>
        /// <returns></returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AnalyzePhotosAsync(AiImageValidation _aiImageValidation)
        {
            return Task.Run(() => AnalyzePhotos(_aiImageValidation));
        }


        /// <summary>
        /// Analyze Photos Async
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public (string jsonReturn, IFunctionReturn functionReturn) AiValidateImage(AiImageValidation _aiImageValidation)
        {
            #region Local Variables
            string _methodName = "F:Shared:AiValidateImage";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            //JSON data
            DataSet _dataSet = null;
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            string _blueMin = "200";
            string _blueMax = "255";
            string _greenMin = "200";
            string _greenMax = "255";
            string _redMin = "200";
            string _redMax = "255";
            string _colorPercentMin = "";
            string _colorPercentMax = "";
            string _facePercentMin = "";
            string _facePercentMax = "";
            string _compId = "";
            string _image = "";
            string _algoGuid = "";
            string _color = "";
            UInt64 _height = 0;
            UInt64 _width = 0;
            string _regGuid = "";
            string _endPoint = _methodName;
            string _createLog = "";


            #endregion
            DateTime _loopStart;
            //Validate Input
            string _errorMessage = "";

            try
            {
                //GET DATA
                _sqlQuery = new StringBuilder();
                _dataSet = new DataSet();
                _sqlconnTime = new TimeSpan();
                _queryTime = new TimeSpan();



                // Load the cascades
                string haarCascadePath = Path.Combine(AppContext.BaseDirectory, "opencv", "haarcascade_frontalface_alt2.xml");
                var haarCascade = new CascadeClassifier(haarCascadePath);

                AiInfo _aiInfo = DetectFace(haarCascade, _aiImageValidation);

                //if (_createLog == "1")
                //{
                //    _functionReturn = logsMain(_aiInfo, _color, _algoGuid, _regGuid, _endPoint);
                //}
                //if (_aiInfo.IsData == 2)
                //{
                //    _errorMessage = ApplicationConstants.ValidationMessages.MultipleFacesDetected;
                //}
                //else if (_aiInfo.IsData == 1)
                //{
                _sw = new StringWriter();
                _writer = new JsonTextWriter(_sw);

                _writer.WriteStartObject();
                _loopStart = DateTime.Now;

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.photoInfo);

                _writer.WriteStartObject();

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AlgoGuid);
                _writer.WriteValue(_algoGuid);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ImageType);
                _writer.WriteValue(_aiInfo.ImageType);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ImageHeight);
                _writer.WriteValue(_aiInfo.ImageHeight);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ImageWidth);
                _writer.WriteValue(_aiInfo.ImageWidth);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorAnalysis);
                _writer.WriteStartArray();

                _writer.WriteStartObject();

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Color);
                _writer.WriteValue(_color);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorPercent);
                _writer.WriteValue(_aiInfo.ColorPercent);

                _writer.WriteEndObject();

                _writer.WriteEnd();

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiFaces);
                _writer.WriteStartArray();

                _writer.WriteStartObject();

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiPhotoX);
                _writer.WriteValue(_aiInfo.AiPhotoX);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiPhotoY);
                _writer.WriteValue(_aiInfo.AiPhotoY);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Height);
                _writer.WriteValue(_aiInfo.AiPhotoHeight);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Width);
                _writer.WriteValue(_aiInfo.AiPhotoWidth);

                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiPhotoPercent);
                _writer.WriteValue(_aiInfo.AiPhotoPercent);

                if (_aiInfo.IsData == 3)
                {
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.HumanFaceDetectedStatusText);
                    _writer.WriteValue("No human face detected");

                }
                else if (_aiInfo.IsData == 2)
                {
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.HumanFaceDetectedStatusText);
                    _writer.WriteValue("Multiple faces detected");
                }
                else if (_aiInfo.IsData == 1)
                {
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.HumanFaceDetectedStatusText);
                    _writer.WriteValue("Human face detected");
                }

                _writer.WriteEndObject();
                _writer.WriteEnd();
                _writer.WriteEndObject();

                _writer.WriteEndObject();

                _jsonReturn = _sw.ToString();

                _sw.Dispose();
                _writer = null;

                _functionReturn.Status = true;
                // }
                //else if (_aiInfo.IsData == 3)
                //{
                //    _errorMessage = ApplicationConstants.ValidationMessages.NoHumanFacesDetected;
                //}
                if (!string.IsNullOrEmpty(_errorMessage))
                {
                    _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                }

            }
            catch (Exception ex)
            {
                //ERROR
                _jsonReturn = string.Empty;
                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
            }
            finally
            {
                _sqlQuery = null;
            }
            return (_jsonReturn, _functionReturn);
        }


        /// <summary>
        /// AnalyzePhotos
        /// </summary>
        /// <returns></returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AiValidateImageAsync(AiImageValidation _aiImageValidation)
        {
            return Task.Run(() => AiValidateImage(_aiImageValidation));
        }

        /// <summary>
        /// Detect Face for Ai validation
        /// </summary>
        /// <returns></returns>
        private AiInfo DetectFace(CascadeClassifier cascade, AiImageValidation _aiImageValidation)
        {
            AiInfo _aiInfo = new AiInfo();
            Rect[] faces;
            string _image = _aiImageValidation.Image;
            decimal _imageWidth;
            decimal _imageHeight;
            string _blueMin = _aiImageValidation.BlueMin;
            string _blueMax = _aiImageValidation.BlueMax;
            string _greenMin = _aiImageValidation.GreenMin;
            string _greenMax = _aiImageValidation.GreenMax;
            string _redMin = _aiImageValidation.RedMin;
            string _redMax = _aiImageValidation.RedMax;
            var (filepath, _imageType) = SaveImage(_image);
            using (var src = new Mat(filepath, ImreadModes.Color))
            using (var gray = new Mat())
            using (var dst = new Mat())
            {
                Cv2.CvtColor(src, gray, ColorConversionCodes.BGR2GRAY);

                // Detect faces
                faces = cascade.DetectMultiScale(
                gray, 1.08, 2, HaarDetectionTypes.ScaleImage, new OpenCvSharp.Size(30, 30));
                _imageWidth = src.Width;
                _imageHeight = src.Height;
                _aiInfo.ImageHeight = _imageHeight;
                _aiInfo.ImageWidth = _imageWidth;
                _aiInfo.ImageType = _imageType;

                //Scalar cvL = new Scalar(200, 200, 200);
                //Scalar cvH = new Scalar(255, 255, 255);
                Scalar cvL = new Scalar(Convert.ToInt32(_blueMin), Convert.ToInt32(_greenMin), Convert.ToInt32(_redMin));
                Scalar cvH = new Scalar(Convert.ToInt32(_blueMax), Convert.ToInt32(_greenMax), Convert.ToInt32(_redMax));
                Cv2.InRange(src, cvL, cvH, dst);

                decimal count_white = Cv2.CountNonZero(dst);
                decimal percent_white = Math.Round(((count_white / (_imageWidth * _imageHeight)) * 100), 2);
                _aiInfo.ColorPercent = percent_white;

                byte[] _colorImageByteArray = dst.ToBytes();
                string _colorImageBase64 = string.Concat(_imageType, Convert.ToBase64String(_colorImageByteArray));

                if (faces.Length == 1)
                {
                    foreach (Rect face in faces)
                    {
                        _aiInfo.IsData = 1;
                        _aiInfo.AiPhotoX = face.X;
                        _aiInfo.AiPhotoY = face.Y;
                        _aiInfo.AiPhotoHeight = face.Height;
                        _aiInfo.AiPhotoWidth = face.Width;
                        _aiInfo.AiPhotoPercent = (Math.Round(Convert.ToDecimal(face.Width * face.Height * 100) / (_imageWidth * _imageHeight), 2));
                    }
                }
                else if (faces.Length == 0)
                {
                    _aiInfo.IsData = 3;
                }
                else if (faces.Length > 1)
                {
                    _aiInfo.IsData = 2;
                }
            }
            if (File.Exists(filepath))
            {
                File.Delete(filepath);
            }
            return (_aiInfo);
        }


        /// <summary>
        /// Detect Face for Ai validation
        /// </summary>
        /// <returns></returns>
        private List<AiInfo> DetectFaceNew(CascadeClassifier cascade, AiImageValidation _aiImageValidation)
        {
            List<AiInfo> _aiInfoList = new List<AiInfo>();

            string path = "D:\\Works\\Sample_Photo";
            DirectoryInfo dir = new DirectoryInfo(path);

            string _blueMin = _aiImageValidation.BlueMin;
            string _blueMax = _aiImageValidation.BlueMax;
            string _greenMin = _aiImageValidation.GreenMin;
            string _greenMax = _aiImageValidation.GreenMax;
            string _redMin = _aiImageValidation.RedMin;
            string _redMax = _aiImageValidation.RedMax;

            Scalar cvL = new Scalar(Convert.ToInt32(_blueMin), Convert.ToInt32(_greenMin), Convert.ToInt32(_redMin));
            Scalar cvH = new Scalar(Convert.ToInt32(_blueMax), Convert.ToInt32(_greenMax), Convert.ToInt32(_redMax));

            foreach (FileInfo fileInfo in dir.GetFiles())
            {
                AiInfo _aiInfo = new AiInfo();

                Rect[] faces = null;
                decimal _imageWidth;
                decimal _imageHeight;
                string _imageType = "";
                string filePath = "";
                int _threshold = 50;

                _imageType = fileInfo.Extension;
                filePath = fileInfo.FullName;
                _aiInfo.FileName = fileInfo.Name;

                using (var src = new Mat(filePath, ImreadModes.Color))
                using (var gray = new Mat())
                using (var dst = new Mat())
                {
                    System.Threading.Thread.Sleep(1);

                    Cv2.CvtColor(src, gray, ColorConversionCodes.BGR2GRAY);

                    ////Change the size of image
                    //OpenCvSharp.Size imageSize = new OpenCvSharp.Size(src.Width * .5, src.Height * .5);
                    //Cv2.Resize(src, src, imageSize);

                    _imageWidth = src.Width;
                    _imageHeight = src.Height;

                    while (_threshold >= 5)
                    {
                        if (faces == null || faces.Length == 0)
                        {
                            // Detect faces
                            faces = cascade.DetectMultiScale(
                            gray, 1.1, _threshold, HaarDetectionTypes.ScaleImage, new OpenCvSharp.Size(30, 30));
                        }

                        if (faces.Length > 0)
                        {
                            _aiInfo.AiThreshhold = _threshold;

                            foreach (Rect face in faces)
                            {
                                var point1 = new OpenCvSharp.Point(face.X, face.Y);
                                var point2 = new OpenCvSharp.Point(face.X + face.Width, face.Y + face.Height);
                                Scalar line = new Scalar(255, 0, 0);
                                Cv2.Rectangle(src, point1, point2, line, 2);

                                if (faces.Length == 1)
                                {
                                    _aiInfo.AiPhotoX = face.X;
                                    _aiInfo.AiPhotoY = face.Y;
                                    _aiInfo.AiPhotoHeight = face.Height;
                                    _aiInfo.AiPhotoWidth = face.Width;
                                    _aiInfo.AiPhotoPercent = (Math.Round(Convert.ToDecimal(face.Width * face.Height * 100) / (_imageWidth * _imageHeight), 2));
                                    _aiInfo.ValidationMessage = "";
                                }
                            }

                            if (faces.Length == 1)
                            {
                                _aiInfo.IsData = 1;
                            }
                            else if (faces.Length > 1)
                            {
                                _aiInfo.IsData = 2;
                                _aiInfo.ValidationMessage = "Multiple faces detected.";
                            }

                            break;
                        }

                        _threshold -= 5;
                    }
                 
                    //faces = cascade.DetectMultiScale(
                    //gray, 1.1, 6, HaarDetectionTypes.ScaleImage, new OpenCvSharp.Size(30, 30)); 

                    _aiInfo.ImageHeight = _imageHeight;
                    _aiInfo.ImageWidth = _imageWidth;
                    _aiInfo.ImageType = _imageType;

                    Cv2.InRange(src, cvL, cvH, dst);

                    decimal count_white = Cv2.CountNonZero(dst);
                    decimal percent_white = Math.Round(((count_white / (_imageWidth * _imageHeight)) * 100), 2);
                    _aiInfo.ColorPercent = percent_white;

                    byte[] _colorImageByteArray = dst.ToBytes();
                    string _colorImageBase64 = string.Concat(_imageType, Convert.ToBase64String(_colorImageByteArray));

                    if (faces != null && faces.Length>0)
                    foreach (Rect face in faces)
                    {
                        var point1 = new OpenCvSharp.Point(face.X, face.Y);
                        var point2 = new OpenCvSharp.Point(face.X + face.Width, face.Y + face.Height);
                        Scalar line = new Scalar(255, 0, 0);
                        Cv2.Rectangle(src, point1, point2, line, 2);

                        ////Change the size of image
                        //imageSize = new OpenCvSharp.Size(src.Width * 2, src.Height * 2);
                        //Cv2.Resize(src, src, imageSize);

                        src.SaveImage(path + "/AIFaceDetection/" + fileInfo.Name);
                        if (faces.Length == 1)
                        {
                            _aiInfo.AiPhotoX = face.X;
                            _aiInfo.AiPhotoY = face.Y;
                            _aiInfo.AiPhotoHeight = face.Height;
                            _aiInfo.AiPhotoWidth = face.Width;
                            _aiInfo.AiPhotoPercent = (Math.Round(Convert.ToDecimal(face.Width * face.Height * 100) / (_imageWidth * _imageHeight), 2));
                            _aiInfo.ValidationMessage = "";
                        }
                    }

                    if (faces.Length == 1)
                    {
                        src.SaveImage(path + "/AIFaceDetection/" + fileInfo.Name);
                    }
                    else
                    {
                        _aiInfo.IsData = 3;
                        _aiInfo.ValidationMessage = "Face not detected.";
                    }

                }

                _aiInfoList.Add(_aiInfo);

            }

            return (_aiInfoList);
        }



        /// <summary>
        /// Save Image for AI validation
        /// </summary>
        /// <returns></returns>
        public (string, string) SaveImage(string _image)
        {
            string ImgStr = _image;
            var _image_details = ImgStr.Split(",");
            var _file_type = _image_details[0].Split("/");
            var _imageType = "." + _file_type[1].Split(";")[0].ToString();
            var _file_name = Guid.NewGuid().ToString() + _imageType;

            //set the image path
            string _rootPath = Path.Combine(AppContext.BaseDirectory, "opencv", _file_name);

            byte[] imageBytes = Convert.FromBase64String(_image_details[1]);

            File.WriteAllBytes(_rootPath, imageBytes);

            return (_rootPath, _imageType);
        }

        /// <summary>
        /// logs Main
        /// </summary>
        /// <returns></returns>
        private IFunctionReturn logsMain(AiInfo _aiInfo, string _color, string _algoGuid, string _regGuid, string _endPoint)
        {
            string _methodName = "F:Shared:logsMain";
            MySqlConnection _mySqlConnection = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlTransaction _mytransaction = null;
            MySqlCommand _mySqlCommand = null;
            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            TimeSpan _sqlconnTime;
            string _sqlConnectionString = string.Empty;
            string _errorMessage = "";
            //JSON data
            string _jsonReturn = string.Empty;
            int _logsColorId = 0;
            int _logsMainId = 0;
            int _logsFaceId = 0;
            try
            {
                #region Add Logs
                //build mysql connection string
                _sqlConnectionString = _databaseSettings.MySqlConnection;
                using (_mySqlConnection = new MySqlConnection(_sqlConnectionString))
                {
                    _mySqlCommand = new MySqlCommand
                    {
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };

                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection?.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mytransaction = _mySqlConnection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                    _mySqlCommand.Connection = _mySqlConnection;
                    _mySqlCommand.Transaction = _mytransaction;

                    #region Add  

                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Clear();
                    _sqlQuery.Append("INSERT INTO reg_ai_logs_main (");
                    _sqlQuery.Append("`reg_guid`");
                    _sqlQuery.Append(",`endpoint`");
                    _sqlQuery.Append(",`algo_guid`");
                    _sqlQuery.Append(",`image_type`");
                    _sqlQuery.Append(",`image_width`");
                    _sqlQuery.Append(",`image_height`");
                    _sqlQuery.Append(",`log_date`");
                    _sqlQuery.Append(") VALUES (");
                    _sqlQuery.Append(" '" + _regGuid + "'");
                    _sqlQuery.Append(",'" + _endPoint + "'");
                    _sqlQuery.Append(",'" + _algoGuid + "'");
                    _sqlQuery.Append(",'" + _aiInfo.ImageType + "'");
                    _sqlQuery.Append(",'" + _aiInfo.ImageWidth + "'");
                    _sqlQuery.Append(",'" + _aiInfo.ImageHeight + "'");
                    _sqlQuery.Append(",CURRENT_TIMESTAMP()");
                    _sqlQuery.Append(");");
                    _sqlQuery.Append("SELECT LAST_INSERT_ID();");
                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                    _logsMainId = Convert.ToInt32(_mySqlCommand.ExecuteScalar());
                    if (_logsMainId > 0)
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append("INSERT INTO reg_ai_logs_color (");
                        _sqlQuery.Append("`reg_ai_log_id`");
                        _sqlQuery.Append(",`color`");
                        _sqlQuery.Append(",`color_percent`");
                        _sqlQuery.Append(",`color_portion_image`");
                        _sqlQuery.Append(") VALUES (");
                        _sqlQuery.Append(" '" + _logsMainId + "'");
                        _sqlQuery.Append(",'" + _color + "'");
                        _sqlQuery.Append(",'" + _aiInfo.ColorPercent + "'");
                        _sqlQuery.Append(",'" + _aiInfo.ColorPercent + "'");
                        _sqlQuery.Append(");");
                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                        _logsColorId = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());
                    }
                    if (_logsColorId > 0)
                    {
                        _sqlQuery.Clear();
                        _sqlQuery.Append("INSERT INTO reg_ai_logs_faces (");
                        _sqlQuery.Append("`reg_ai_log_id`");
                        _sqlQuery.Append(",`x_cordinate`");
                        _sqlQuery.Append(",`y_cordinate`");
                        _sqlQuery.Append(",`height`");
                        _sqlQuery.Append(",`width`");
                        _sqlQuery.Append(",`percent`");
                        _sqlQuery.Append(") VALUES (");
                        _sqlQuery.Append(" '" + _logsMainId + "'");
                        _sqlQuery.Append(",'" + _aiInfo.AiPhotoX + "'");
                        _sqlQuery.Append(",'" + _aiInfo.AiPhotoY + "'");
                        _sqlQuery.Append(",'" + _aiInfo.AiPhotoHeight + "'");
                        _sqlQuery.Append(",'" + _aiInfo.AiPhotoWidth + "'");
                        _sqlQuery.Append(",'" + _aiInfo.AiPhotoPercent + "'");
                        _sqlQuery.Append(");");
                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                        _logsFaceId = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());
                    }
                    if (_logsMainId > 0 && _logsColorId > 0 && _logsFaceId > 0)
                    {
                        _mytransaction?.Commit();
                        //Success
                        _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.AiLogsSavedSuccessfully, _methodName);
                    }
                    else
                    {
                        _mytransaction?.Rollback();
                        _errorMessage = Constants.GenericMessages.ErrorInSavingRecord;
                    }

                    #endregion
                    //Cleanup
                    _mySqlCommand?.Dispose();
                }
                #endregion
                if (!string.IsNullOrEmpty(_errorMessage))
                {
                    _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                }
            }
            catch (Exception ex)
            {
                //ERROR
                _jsonReturn = string.Empty;
                _functionReturn.Status = false;
                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
            }
            finally
            {
                if (_mySqlConnection != null && _mySqlConnection.State != System.Data.ConnectionState.Closed)
                {
                    _mySqlConnection?.Close();
                    _mySqlConnection = null;
                }
                _mySqlCommand = null;
                _sqlQuery = null;
                _sqlConnectionString = string.Empty;
            }

            return _functionReturn;
        }


        /// <summary>
        /// Get Degree List Async
        /// </summary>
        /// <param name="_qualificationtypeGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetDegreeListAsync(string _qualificationtypeGuid)
        {
            return Task.Run(() => GetDegreeList(_qualificationtypeGuid));
        }

        /// <summary>
        /// Get Degree List
        /// </summary>
        /// <param name="_qualificationtypeGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetDegreeList(string _qualificationtypeGuid)
        {
            #region Local Variables
            string _methodName = "F:Shared:GetDegreeList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, guid, description, status ");
                    _sqlQuery.Append(" from reg_degree_name ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" qualification_type_guid = '" + _qualificationtypeGuid + "' ");
                    _sqlQuery.Append(" and status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Degree, _dictionary, _stats.CacheCheckTime);
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
        /// Get University List By State Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetUniversityListAsync(string _stateGuid)
        {
            return Task.Run(() => GetUniversityList(_stateGuid));
        }

        /// <summary>
        /// Get University List  By State
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetUniversityList(string _stateGuid)
        {
            #region Local Variables
            string _methodName = "F:Shared:GetUniversityList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, guid, description, status ");
                    _sqlQuery.Append(" from university_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" state_guid = '" + _stateGuid + "' ");
                    _sqlQuery.Append(" and status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.University, _dictionary, _stats.CacheCheckTime);
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
        /// Get Stream List By Degree Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetStreamListByDegreeAsync(string _degreeGuid)
        {
            return Task.Run(() => GetStreamListByDegree(_degreeGuid));
        }

        /// <summary>
        /// Get Stream List By Degree
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetStreamListByDegree(string _degreeGuid)
        {
            #region Local Variables
            string _methodName = "F:Shared:GetStreamListByDegree";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, guid, description, status ");
                    _sqlQuery.Append(" from stream_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" degree_guid = '" + _degreeGuid + "' ");
                    _sqlQuery.Append(" and status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Stream, _dictionary, _stats.CacheCheckTime);
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
        /// Get Marks Type List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetMarksTypeListAsync()
        {
            return Task.Run(() => GetMarksTypeList());
        }

        /// <summary>
        /// Get Marks Type List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetMarksTypeList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetMarksTypeList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, guid, description, status ");
                    _sqlQuery.Append(" from reg_marks_type ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.MarksType, _dictionary, _stats.CacheCheckTime);
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
        /// Get Grade List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetGradeListAsync()
        {
            return Task.Run(() => GetGradeList());
        }

        /// <summary>
        /// Get Grade List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetGradeList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetGradeList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, guid, description, status ");
                    _sqlQuery.Append(" from reg_grade ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.Grade, _dictionary, _stats.CacheCheckTime);
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
        /// Get Qualification Type List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetQualificationTypeAsync()
        {
            return Task.Run(() => GetQualificationTypeList());
        }

        /// <summary>
        /// Get Qualification Type List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetQualificationTypeList()
        {
            #region Local Variables
            string _methodName = "F:Shared:GetQualificationTypeList";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();

                    _sqlQuery.Append(" select id, name, code, guid, description, status ");
                    _sqlQuery.Append(" from reg_qualification_type ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" status = 1 ORDER BY name;");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Guid, (ApplicationJsonReturnConstants.PropertyNames.Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Name, (ApplicationJsonReturnConstants.PropertyNames.Name, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Code, (ApplicationJsonReturnConstants.PropertyNames.Code, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Description, (ApplicationJsonReturnConstants.PropertyNames.Description, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Status, (ApplicationJsonReturnConstants.PropertyNames.Status, DatabaseConstants.DataTypes.String) }
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.QualificationType, _dictionary, _stats.CacheCheckTime);
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
        /// DOBDiffrence
        /// </summary>
        /// <param name="_dob"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> DOBDifferenceAsync(DateTime? _dob)
        {
            return Task.Run(() => DOBDifference(_dob));
        }

        /// <summary>
        /// DOBDiffrence
        /// </summary>
        /// <param name="_dob"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) DOBDifference(DateTime? _dob)
        {
            #region Local Variables
            string _methodName = "F:Shared:DOBDiffrence";
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            StringWriter _sw = new StringWriter(); ;
            JsonTextWriter _writer = new JsonTextWriter(_sw);
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    DateTime zeroTime = new DateTime(1, 1, 1);
                    TimeSpan span = Convert.ToDateTime(_configuration["ApiSettings:AgeCalculationDate"]) - _dob.Value;

                    _writer.WriteStartObject();

                    _writer.WritePropertyName(ApplicationConstants.GenericMessages.DateDifference);
                    _writer.WriteStartObject();

                    _writer.WritePropertyName(ApplicationConstants.GenericMessages.Years);
                    _writer.WriteValue((zeroTime + span).Year - 1);
                    _writer.WritePropertyName(ApplicationConstants.GenericMessages.Months);
                    _writer.WriteValue((zeroTime + span).Month - 1);
                    _writer.WritePropertyName(ApplicationConstants.GenericMessages.Days);
                    _writer.WriteValue((zeroTime + span).Day - 1);

                    _writer.WriteEndObject();

                    _writer.WriteEndObject();

                    _functionReturn.Status = true;

                    _jsonReturn = _sw.ToString();
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
    }
}