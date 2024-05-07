using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Globals;
using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.AppFunctions
{
    public class RegDataExportFunction : IRegDataExportFunction
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
        public RegDataExportFunction(IDatabaseSettings __databaseSettings, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration)
        {
            _databaseSettings = __databaseSettings;
            _loggerFunctions = __loggerFunctions;
            _apiSettings = __apiSettings;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _configuration = __configuration;
        }

        private (string jsonReturn, IFunctionReturn functionReturn) GenerateJson(string _guid)
        {
            #region Local Variables
            string _methodName = "F:RegDataExport:GenerateJson";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            //JSON data
            DataTable _dataTable = null;
            ApiSuccessResponse.DataValue _dataValue = null;
            UInt64 _retValue = 0;
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
                    string _rowLimit = string.IsNullOrEmpty(Convert.ToString(_configuration["DatabaseSettings:MaxRecordLoopCount"])) ? "500" : Convert.ToString(_configuration["DatabaseSettings:MaxRecordLoopCount"]);

                    _sqlQuery.Append("SELECT (SELECT count(id) FROM registration_data WHERE exam_guid = '" + _guid + "' AND isexported=0) total_rows,id,exam_guid,candidate_guid,");
                    _sqlQuery.Append("reg_code, first_name, middle_name, last_name, father_name,");
                    _sqlQuery.Append(" DATE_FORMAT(dob, '%Y-%m-%d') dob, mobile_number, email_id, photo, signature, gender_guid, gender, category_guid, category, ph,");
                    _sqlQuery.Append(" sc, st, obc, general, pc1_guid,pc2_guid,pc3_guid, pc1, pc2, pc3, admit_card_id ");
                    _sqlQuery.Append(" FROM registration_data");
                    _sqlQuery.Append(" WHERE exam_guid = '" + _guid + "' AND isexported=0 ORDER BY id DESC LIMIT " + _rowLimit + ";");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types

                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.TotalRows, (ApplicationJsonReturnConstants.PropertyNames.TotalRows, DatabaseConstants.DataTypes.UInt64) },
                        { ApplicationDatabaseConstants.ColumnNames.Id, (ApplicationJsonReturnConstants.PropertyNames.Id, DatabaseConstants.DataTypes.UInt64) },
                        { ApplicationDatabaseConstants.ColumnNames.ExamGuid, (ApplicationJsonReturnConstants.PropertyNames.ExamGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.CandidateGuid, (ApplicationJsonReturnConstants.PropertyNames.CandidateGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.RegistrationCode, (ApplicationJsonReturnConstants.PropertyNames.RegistrationCode, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.FirstName, (ApplicationJsonReturnConstants.PropertyNames.FirstName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.LastName, (ApplicationJsonReturnConstants.PropertyNames.LastName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.MiddleName, (ApplicationJsonReturnConstants.PropertyNames.MiddleName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.FatherName, (ApplicationJsonReturnConstants.PropertyNames.FatherName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Dob, (ApplicationJsonReturnConstants.PropertyNames.Dob, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.MobileNumber, (ApplicationJsonReturnConstants.PropertyNames.MobileNumber, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.EmailId, (ApplicationJsonReturnConstants.PropertyNames.EmailId, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Photo, (ApplicationJsonReturnConstants.PropertyNames.Photo, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Signature, (ApplicationJsonReturnConstants.PropertyNames.Signature, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Gender, (ApplicationJsonReturnConstants.PropertyNames.Gender, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.GenderGuid, (ApplicationJsonReturnConstants.PropertyNames.GenderGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Category, (ApplicationJsonReturnConstants.PropertyNames.Category, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.CategoryGuid, (ApplicationJsonReturnConstants.PropertyNames.CategoryGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Ph, (ApplicationJsonReturnConstants.PropertyNames.Ph, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.SC, (ApplicationJsonReturnConstants.PropertyNames.SC, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.ST, (ApplicationJsonReturnConstants.PropertyNames.ST, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Obc, (ApplicationJsonReturnConstants.PropertyNames.Obc, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.General, (ApplicationJsonReturnConstants.PropertyNames.General, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc1, (ApplicationJsonReturnConstants.PropertyNames.Pc1, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc2, (ApplicationJsonReturnConstants.PropertyNames.Pc2, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc3, (ApplicationJsonReturnConstants.PropertyNames.Pc3, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc1Guid, (ApplicationJsonReturnConstants.PropertyNames.Pc1Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc2Guid, (ApplicationJsonReturnConstants.PropertyNames.Pc2Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc3Guid, (ApplicationJsonReturnConstants.PropertyNames.Pc3Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.AdmitCardId, (ApplicationJsonReturnConstants.PropertyNames.AdmitCardId, DatabaseConstants.DataTypes.UInt64) }
                    };
                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.RegistrationData, _dictionary, _stats.CacheCheckTime);

                    _sqlQuery.Clear();
                    _sqlQuery.Append("UPDATE registration_data SET isexported=1 WHERE  isexported=0 and  exam_guid = '" + _guid + "'  ORDER BY id DESC LIMIT " + _rowLimit + ";");
                    (_functionReturn, _retValue, _dataValue) = _databaseFunctions.ExecuteUpdate(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.RegistrationData);
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
        /// Registration Import
        /// </summary>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) ExportRegistrations(string _guid)
        {
            #region Local Variables
            string _methodName = "F:RegDataExport:ImportRegistrations";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            #endregion

            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DataTable _dataTable = null;
            TimeSpan? _queryTime = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            int _rowsAffected = 0;
            bool _success = true;
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
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
                            _mySqlCommand.CommandTimeout = 300;
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Clear();
                            _sqlQuery.Append("DELETE FROM `registration_data` ");
                            _sqlQuery.Append("WHERE ");
                            _sqlQuery.Append("exam_guid = '" + _guid + "';");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _queryStart = DateTime.Now;
                            _rowsAffected = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());

                            _sqlQuery.Clear();
                            _sqlQuery.Append("INSERT INTO `registration_data` (");
                            _sqlQuery.Append("`exam_guid`");
                            _sqlQuery.Append(",`reg_id`");
                            _sqlQuery.Append(",`reg_code`");
                            _sqlQuery.Append(",`first_name`");
                            _sqlQuery.Append(",`middle_name`");
                            _sqlQuery.Append(",`last_name`");
                            _sqlQuery.Append(",`father_name`");
                            _sqlQuery.Append(",`dob`");
                            _sqlQuery.Append(",`mobile_number`");
                            _sqlQuery.Append(",`email_id`");
                            _sqlQuery.Append(",`photo`");
                            _sqlQuery.Append(",`signature`");
                            _sqlQuery.Append(",`gender_guid`");
                            _sqlQuery.Append(",`category_guid`");
                            _sqlQuery.Append(",`ph`");
                            _sqlQuery.Append(",`pc1_guid`");
                            _sqlQuery.Append(",`pc2_guid`");
                            _sqlQuery.Append(",`pc3_guid`");
                            // _sqlQuery.Append(",`candidate_guid`");

                            _sqlQuery.Append(") select etl.exam_guid,rml.id,l.code, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckFirstname',d.datavalue,null)) as Firstname, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckMiddlename',d.datavalue,null)) as Middlename, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckLastname',d.datavalue,null)) as Lastname, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckFathername',d.datavalue,null)) as Fathername, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckDateofbirth',d.datavalue,null)) as Dateofbirth, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckMobilenumber',d.datavalue,null)) as Mobilenumber, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckEmail',d.datavalue,null)) as Email, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckPhotouploader',d.imagevalue,null)) as Photo, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckSignatureUploader',d.imagevalue,null)) as Signature, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckGender',d.datavalue,null)) as Gender, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckCategory',d.datavalue,null)) as Category, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckPhysicalDisability',d.datavalue,'0')) as PhysicalDisability, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckCityPriority1',d.datavalue,null)) as CityPriority1, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckCityPriority2',d.datavalue,null)) as CityPriority2, ");
                            _sqlQuery.Append(" max(if(c.name='NgxIxcheckCityPriority3',d.datavalue,null)) as CityPriority3 ");
                            // _sqlQuery.Append(",d.candidate_guid");
                            _sqlQuery.Append(" from components_main c ");
                            _sqlQuery.Append(" join  data_save_main_live d on d.comp_id=c.id ");
                            _sqlQuery.Append(" join settings_main s on s.component_id=c.id ");
                            _sqlQuery.Append(" join layout_main l on l.id=d.form_id ");
                            _sqlQuery.Append(" join registration_main_live rml on rml.candidate_guid = d.candidate_guid ");
                            _sqlQuery.Append(" join exams_to_layout etl on etl.layout_id=l.id ");
                            _sqlQuery.Append(" where rml.payment_status=1 and etl.exam_guid ='" + _guid + "'");
                            _sqlQuery.Append(" group by candidate_guid ");
                            _sqlQuery.Append(" order by d.id;");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _queryStart = DateTime.Now;
                            _rowsAffected = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());

                            if (_rowsAffected <= 0)
                                _success = false;

                            if (_success)
                            {

                                _sqlQuery.Clear();
                                _sqlQuery.Append(" update registration_data rd, gender_main gm set rd.gender = gm.name   where  gm.gender_guid=rd.gender_guid; ");
                                _sqlQuery.Append(" update registration_data rd, category_main cm set rd.category=cm.name  where  cm.category_guid=rd.category_guid; ");
                                _sqlQuery.Append(" update registration_data rd, city_main cm  set rd.pc1=cm.name where cm.city_guid=rd.pc1_guid; ");
                                _sqlQuery.Append(" update registration_data rd,  city_main cm  set rd.pc2=cm.name  where cm.city_guid=rd.pc2_guid; ");
                                _sqlQuery.Append(" update registration_data rd, city_main cm  set rd.pc3=cm.name   where cm.city_guid=rd.pc3_guid; ");
                                _sqlQuery.Append(" update registration_data set st = (case when category ='ST' then 1 else 0 end); ");
                                _sqlQuery.Append(" update registration_data set sc = (case when category ='SC' then 1 else 0 end); ");
                                _sqlQuery.Append(" update registration_data set obc = (case when category ='OBC' then 1 else 0 end); ");
                                _sqlQuery.Append(" update registration_data set general = (case when category ='General' then 1 else 0 end);");

                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _queryStart = DateTime.Now;
                                _rowsAffected = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());



                                if (_rowsAffected <= 0)
                                {

                                    _success = false;
                                }

                                if (_success)
                                {
                                    _mytransaction?.Commit();
                                    //Success
                                    _functionReturn = new FunctionReturn();
                                    _functionReturn.Status = true;
                                    _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                                    _functionReturn.Message.Add(ApplicationConstants.GenericMessages.RegistrationExportSuccessfully);
                                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                                }
                                else
                                {

                                    _mytransaction?.Rollback();
                                    _functionReturn = new FunctionReturn();
                                    //No Data // Need to send blank JSON object instead of error
                                    _functionReturn.Status = false;
                                    _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                                    _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                                }
                                _mySqlCommand?.Dispose();
                            }
                        }

                        catch (Exception exTrans)
                        {
                            //ERROR
                            _jsonReturn = string.Empty;
                            _functionReturn = CommonFunctions.SystemError(exTrans.Message, _methodName);
                            _mytransaction?.Rollback();
                        }
                        _mySqlCommand?.Dispose();
                        (_jsonReturn, _functionReturn) = GenerateJson(_guid);
                    }
                }
                catch (Exception ex)
                {
                    _jsonReturn = string.Empty;
                    _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Registration Import 
        /// </summary>
        /// <returns>Task<(string jsonReturn, IFunctionReturn functionReturn)></returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> ExportRegistrationsAsync(string _guid)
        {
            return Task.Run(() => ExportRegistrations(_guid));
        }


        /// <summary>
        /// Registration Import 
        /// </summary>
        /// <returns>Task<(string jsonReturn, IFunctionReturn functionReturn)></returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> ExportRegistrationDetailsAsync(string _examGuid)
        {
            return Task.Run(() => GenerateJson(_examGuid));
        }

        private (string jsonReturn, IFunctionReturn functionReturn) GenerateDetailJson(string _examGuid, string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "F:RegDataExport:GenerateJson";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn;
            string _jsonReturn = string.Empty;
            //JSON data
            DataTable _dataTable = null;
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    _examGuid = Sanitization.Sanitize(_examGuid);
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _dataTable = new DataTable();

                    _sqlQuery.Append("select reg_id,candidate_guid,exam_guid,reg_code, first_name, middle_name, last_name, father_name,");
                    _sqlQuery.Append(" DATE_FORMAT(dob, '%Y-%m-%d') dob, mobile_number, email_id, photo, signature, gender_guid, gender, category_guid, category, ph, ");
                    _sqlQuery.Append(" sc, st, obc, general, pc1_guid,pc2_guid,pc3_guid, pc1, pc2, pc3, admit_card_id ");
                    _sqlQuery.Append(" from registration_data");
                    _sqlQuery.Append(" WHERE exam_guid = '" + _examGuid + "' AND candidate_guid='" + _candidateGuid + "';");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types

                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.ExamGuid, (ApplicationJsonReturnConstants.PropertyNames.ExamGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.CandidateGuid, (ApplicationJsonReturnConstants.PropertyNames.CandidateGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.RegistrationCode, (ApplicationJsonReturnConstants.PropertyNames.RegistrationCode, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.FirstName, (ApplicationJsonReturnConstants.PropertyNames.FirstName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.LastName, (ApplicationJsonReturnConstants.PropertyNames.LastName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.MiddleName, (ApplicationJsonReturnConstants.PropertyNames.MiddleName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.FatherName, (ApplicationJsonReturnConstants.PropertyNames.FatherName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Dob, (ApplicationJsonReturnConstants.PropertyNames.Dob, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.MobileNumber, (ApplicationJsonReturnConstants.PropertyNames.MobileNumber, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.EmailId, (ApplicationJsonReturnConstants.PropertyNames.EmailId, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Photo, (ApplicationJsonReturnConstants.PropertyNames.Photo, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Signature, (ApplicationJsonReturnConstants.PropertyNames.Signature, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Gender, (ApplicationJsonReturnConstants.PropertyNames.Gender, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.GenderGuid, (ApplicationJsonReturnConstants.PropertyNames.GenderGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Category, (ApplicationJsonReturnConstants.PropertyNames.Category, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.CategoryGuid, (ApplicationJsonReturnConstants.PropertyNames.CategoryGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Ph, (ApplicationJsonReturnConstants.PropertyNames.Ph, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.SC, (ApplicationJsonReturnConstants.PropertyNames.SC, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.ST, (ApplicationJsonReturnConstants.PropertyNames.ST, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Obc, (ApplicationJsonReturnConstants.PropertyNames.Obc, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.General, (ApplicationJsonReturnConstants.PropertyNames.General, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc1, (ApplicationJsonReturnConstants.PropertyNames.Pc1, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc2, (ApplicationJsonReturnConstants.PropertyNames.Pc2, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc3, (ApplicationJsonReturnConstants.PropertyNames.Pc3, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc1Guid, (ApplicationJsonReturnConstants.PropertyNames.Pc1Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc2Guid, (ApplicationJsonReturnConstants.PropertyNames.Pc2Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Pc3Guid, (ApplicationJsonReturnConstants.PropertyNames.Pc3Guid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.AdmitCardId, (ApplicationJsonReturnConstants.PropertyNames.AdmitCardId, DatabaseConstants.DataTypes.UInt64) }
                    };
                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.RegistrationData, _dictionary, _stats.CacheCheckTime);
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
    }
}