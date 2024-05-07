using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCommonLib.Security;
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
using IXCheckCandidateApi.AppFunctions.Interfaces;
using IXCheckCandidateApi.Models;
using System.Text.Json;
using System.IO;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace IXCheckCandidateApi.AppFunctions
{
    public class ImportFunctions : IImportFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly IDatabaseFunctions _databaseFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiSettings _apiSettings;
        private readonly IStats _stats;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFunctions _httpClientFunctions;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__databaseSettings"></param>
        public ImportFunctions(IDatabaseSettings __databaseSettings, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration, IHttpClientFunctions __httpClientFunctions)
        {
            _databaseSettings = __databaseSettings;
            _loggerFunctions = __loggerFunctions;
            _apiSettings = __apiSettings;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _configuration = __configuration;
            _httpClientFunctions = __httpClientFunctions;
        }

        /// <summary>
        /// Import Layout Json Async
        /// </summary>
        /// <param name="_layout"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> ImportLayoutJsonAsync(LayoutListBase _layout)
        {
            return Task.Run(() => AddLayoutJson(_layout));
        }

        /// <summary>
        /// Add Layout Json
        /// </summary>
        /// <param name="_layout"></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddLayoutJson(LayoutListBase _layout)
        {
            #region Local Variables
            string _methodName = "F:Import:AddLayoutJson";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            bool _success = true;
            UInt64 _layout_id = 0;
            string _layout_guid = "";
            string _layout_name = "";
            string _layout_description = "";
            string _layout_code = "";
            string _layout_page_name = "";
            string _layout_number = "";
            string _layout_type_guid = "";
            string _layout_type = "";
            string _layout_json = "";
            UInt64 _page_id = 0;
            string _page_guid = "";
            string _page_name = "";
            string _page_description = "";
            UInt64 _section_id = 0;
            string _section_guid = "";
            string _section_name = "";
            string _section_description = "";
            string _section_visibility = "";
            string _section_css_class = "";
            UInt64 _comp_id = 0;
            string _comp_guid = "";
            string _comp_name = "";
            string _comp_cols = "";
            string _comp_rows = "";
            string _comp_x = "";
            string _comp_y = "";
            UInt64 _setting_id = 0;
            string _setting_measurementType = "";
            string _setting_height = "";
            string _setting_width = "";
            string _setting_labelposition = "";
            string _setting_type = "";
            string _setting_label = "";
            string _setting_description = "";
            string _setting_input = "";
            string _setting_placeholder = "";
            string _setting_endpoint = "";
            string _setting_defaultValue = "";
            string _setting_dataParameter = "";
            string _setting_showingrid = "";
            string _setting_allowTextUppercase = "";
            string _setting_isdisabled = "";
            string _setting_isoutput = "";
            UInt64 _dataobject_id = 0;
            string _dataobject_endpoint = "";
            string _dataobject_textfield = "";
            string _dataobject_valuefield = "";
            UInt64 _valid_id = 0;
            string _valid_required = "";
            string _valid_maxlength = "";
            string _valid_minlength = "";
            string _valid_regex = "";
            string _valid_errormessage = "";
            string _valid_mindate = "";
            string _valid_maxdate = "";
            string _valid_unique = "";
            string _valid_uniqueURL = "";
            string _valid_allowed_extentions = "";
            string _valid_allowed_size = "";
            string _valid_maxwidth = "";
            string _valid_minwidth = "";
            string _valid_maxheight = "";
            string _valid_minheight = "";
            string _valid_allowed_file_count = "";
            string _valid_otp_varification = "";
            UInt64 _condition_id = 0;
            string _condition_conditional = "";
            string _condition_eventType = "";
            string _condition_changeType = "";
            string _condition_componentToChange = "";
            string _ConditionsectionToShowHide = "";
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            //JSON data
            string _jsonReturn = string.Empty;
            int _manTitle = 0;
            int _manFirstName = 0;
            int _manFatherName = 0;
            int _manDateOfBirth = 0;
            int _manMobile = 0;
            int _manEmail = 0;
            int _manPhoto = 0;
            int _manSign = 0;
            int _manGender = 0;
            int _manPH = 0;
            int _manCityPrefrence1 = 0;
            bool _manSuccess = true;
            LayoutListBase _response = new LayoutListBase();
            #endregion

            #region Input Sanitization and Validation

            //Validate Input
            string _errorMessage = string.Empty;
            try
            {
                if (_layout == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.ExamGuidRequired; ;
                }
                else
                {
                    _response = _layout;
                    if (_layout == null && _layout.Layout.Count <= 0)
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.FormDataRequired;
                    }
                }
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            #endregion
            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();

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
                            int _loopCount = 0;
                            _sqlQuery.Clear();
                            /*delete all rows from table*/
                            _sqlQuery.Append("DELETE FROM condition_main;");
                            _sqlQuery.Append("DELETE FROM validations_main;");
                            _sqlQuery.Append("DELETE FROM data_object;");
                            _sqlQuery.Append("DELETE FROM settings_main;");
                            _sqlQuery.Append("DELETE FROM reg_components_ai_color;");
                            _sqlQuery.Append("DELETE FROM reg_components_ai_setting;");
                            _sqlQuery.Append("DELETE FROM reg_data_gridvalues;");
                            _sqlQuery.Append("DELETE FROM reg_grid_components_main;");
                            _sqlQuery.Append("DELETE FROM components_main;");
                            _sqlQuery.Append("DELETE FROM section_main;");
                            _sqlQuery.Append("DELETE FROM pages_main;");
                            _sqlQuery.Append("DELETE FROM registration_to_layout;");//exam_to_layout
                            _sqlQuery.Append("DELETE FROM layout_main;");
                            _sqlQuery.Append("DELETE FROM data_save_main_live;");
                            _sqlQuery.Append("DELETE FROM registration_main_live;");
                            _sqlQuery.Append("DELETE FROM registration_data;");
                            _sqlQuery.Append("DELETE FROM config_main;");
                            _sqlQuery.Append("DELETE FROM email_setup;");
                            _sqlQuery.Append("DELETE FROM registration_fee_setup;");
                            _sqlQuery.Append("DELETE FROM registrations_fee_type;");
                            _sqlQuery.Append("DELETE FROM exams_main;");//exams_setup_main
                            _sqlQuery.Append("DELETE FROM payment_gateway_main;");
                            _sqlQuery.Append("DELETE FROM exam_to_reg_type;");
                            _sqlQuery.Append("DELETE FROM registrations_main;");
                            _sqlQuery.Append("DELETE FROM reg_eligibility_functions_main;");
                            _sqlQuery.Append("DELETE FROM registration_to_reg_type_status;");
                            _sqlQuery.Append("DELETE FROM candidate_to_reg_type_status;");
                            _sqlQuery.Append("DELETE FROM registration_to_exam;");
                            _sqlQuery.Append("DELETE FROM reg_types;");
                            _sqlQuery.Append("DELETE FROM reg_activity_log;");
                            _sqlQuery.Append("DELETE FROM registrations_to_cities;");
                            _sqlQuery.Append("DELETE FROM payment_gateway_paytm;");
                            _sqlQuery.Append("DELETE FROM payment_gateway_payumoney;");
                            _sqlQuery.Append("DELETE FROM payment_gateway_razorpay;");
                            _sqlQuery.Append("DELETE FROM registration_to_payment_gateways;");
                            _sqlQuery.Append("DELETE FROM payment_gateway_types;");
                            _sqlQuery.Append("DELETE FROM color_main;");
                            _sqlQuery.Append("DELETE FROM ai_algos_main;");

                            if (_response.RegAiAlgos != null && _response.RegAiAlgos.Count > 0)
                            {
                                foreach (RegAiAlgos _data in _response.RegAiAlgos)
                                {
                                    _sqlQuery.Append("INSERT INTO ai_algos_main(");
                                    _sqlQuery.Append("id");
                                    _sqlQuery.Append(",guid");
                                    _sqlQuery.Append(",code");
                                    _sqlQuery.Append(",name");
                                    _sqlQuery.Append(",status)");
                                    _sqlQuery.Append("VALUES(");
                                    _sqlQuery.Append(_data.Id);
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Guid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Code) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Name) + "'");
                                    _sqlQuery.Append(",1);");
                                }
                            }

                            if (_response.Colors != null && _response.Colors.Count > 0)
                            {
                                foreach (Colors _data in _response.Colors)
                                {
                                    _sqlQuery.Append("INSERT INTO color_main(");
                                    _sqlQuery.Append("id");
                                    _sqlQuery.Append(",guid");
                                    _sqlQuery.Append(",code");
                                    _sqlQuery.Append(",name");
                                    _sqlQuery.Append(",description");
                                    _sqlQuery.Append(",status)");
                                    _sqlQuery.Append("VALUES(");
                                    _sqlQuery.Append(_data.Id);
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Guid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Code) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Name) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Description) + "'");
                                    _sqlQuery.Append(",1);");
                                }
                            }
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            UInt64 _rowsAffected = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());
                            _sqlQuery.Clear();
                            /*delete all rows from table*/
                            #region layout_main
                            foreach (var _data in _response.Layout)
                            {
                                if (_loopCount >= 1)
                                    _sqlQuery.Clear();
                                if (_response != null && _response.Layout.Count > 0)
                                {
                                    //Sanitize Input
                                    _layout_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(_data.LayoutId)));
                                    _layout_guid = Sanitization.Sanitize(_data.LayoutGuid);
                                    _layout_name = Sanitization.Sanitize(_data.LayoutName);
                                    _layout_description = Sanitization.Sanitize(_data.LayoutDescription);
                                    _layout_code = Sanitization.Sanitize(_data.LayoutCode);
                                    _layout_page_name = Sanitization.Sanitize(_data.LayoutPageName);
                                    _layout_number = Sanitization.Sanitize(_data.LayoutNumber);
                                    _layout_type = Sanitization.Sanitize(_data.LayoutType);
                                    _layout_json = Sanitization.Sanitize(_data.LayoutJson);
                                    _layout_type_guid = Sanitization.Sanitize(_data.LayoutTypeGuid);
                                }
                                #region Add Tab                                
                                _sqlQuery.Append("INSERT INTO `layout_main` ( ");
                                _sqlQuery.Append("`id`");
                                _sqlQuery.Append(",`layout_guid`");
                                _sqlQuery.Append(",`name`");
                                _sqlQuery.Append(",`description`");
                                _sqlQuery.Append(",`layout_json`");
                                _sqlQuery.Append(",`code`");
                                _sqlQuery.Append(",`layout_type_guid`");
                                _sqlQuery.Append(",`page_name`");
                                _sqlQuery.Append(",`number`");
                                _sqlQuery.Append(",`status`");
                                _sqlQuery.Append(" ) VALUES ( ");
                                _sqlQuery.Append("'" + _layout_id + "'");
                                _sqlQuery.Append(",'" + _layout_guid + "'");
                                _sqlQuery.Append(",'" + _layout_name + "'");
                                _sqlQuery.Append(",'" + _layout_description + "'");
                                _sqlQuery.Append(",'" + _layout_json + "'");
                                _sqlQuery.Append(",'" + _layout_code + "'");
                                _sqlQuery.Append(",'" + _layout_type_guid + "'");
                                _sqlQuery.Append(",'" + _layout_page_name + "'");
                                _sqlQuery.Append(",'" + _layout_number + "'");
                                _sqlQuery.Append(",'1');");

                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _rowsAffected = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());
                                _loopCount++;

                                if (_rowsAffected <= 0)
                                    _success = false;

                                // start page
                                if (_success && _layout_type != "initiallayout")
                                {
                                    try
                                    {
                                        // start page loop
                                        foreach (var pageItem in _data.Pages)
                                        {
                                            if (_success)
                                            {
                                                //Sanitize Input                                   
                                                _page_name = Sanitization.Sanitize(pageItem.PageName);
                                                _page_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(pageItem.PageId)));
                                                _page_guid = Sanitization.Sanitize(pageItem.PageGuid);
                                                _page_description = Sanitization.Sanitize(pageItem.PageDescription);

                                                //page error
                                                if (string.IsNullOrEmpty(_page_guid))
                                                    _errorMessage = ApplicationConstants.ValidationMessages.PageGuidRequired;
                                                else if (string.IsNullOrEmpty(_page_description))
                                                {
                                                    //_errorMessage = ApplicationConstants.ValidationMessages.PageDescriptionRequired;
                                                }

                                                if (!string.IsNullOrEmpty(_errorMessage))
                                                    _success = false;
                                                else
                                                {
                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append("INSERT INTO `pages_main` ( ");
                                                    _sqlQuery.Append("`id`");
                                                    _sqlQuery.Append(",`page_guid`");
                                                    _sqlQuery.Append(",`form_id`");
                                                    _sqlQuery.Append(",`code`");
                                                    _sqlQuery.Append(",`description`");
                                                    _sqlQuery.Append(",`status`");
                                                    _sqlQuery.Append(" ) VALUES ( ");
                                                    _sqlQuery.Append("'" + _page_id + "'");
                                                    _sqlQuery.Append(",'" + _page_guid + "'");
                                                    _sqlQuery.Append("," + _layout_id + "");
                                                    _sqlQuery.Append(",'" + _page_name + "'");
                                                    _sqlQuery.Append(",'" + _page_description + "'");
                                                    _sqlQuery.Append(",'1'");
                                                    _sqlQuery.Append(" ); ");
                                                    _rowsAffected = 0;
                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                    _rowsAffected = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());

                                                    if (_page_id <= 0)
                                                        _success = false;
                                                    if (pageItem.Sections.Count <= 0)
                                                    {
                                                        //_success = false;
                                                    }
                                                    // strart section
                                                    if (_success)
                                                    {
                                                        // start section loop 
                                                        foreach (var sectionItem in pageItem.Sections)
                                                        {
                                                            if (_success)
                                                            {
                                                                _section_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(sectionItem.SectionId)));
                                                                _section_name = Sanitization.Sanitize(sectionItem.SectionName);
                                                                _section_guid = Sanitization.Sanitize(sectionItem.SectionGuid);
                                                                _section_description = Sanitization.Sanitize(sectionItem.SectionDescription);
                                                                _section_visibility = Sanitization.Sanitize(sectionItem.SectionVisibility);
                                                                _section_css_class = Sanitization.Sanitize(sectionItem.SectionCssClass);

                                                                //page error
                                                                if (string.IsNullOrEmpty(_section_guid))
                                                                {
                                                                    _errorMessage = ApplicationConstants.ValidationMessages.SectionGuidRequired;
                                                                }
                                                                else if (string.IsNullOrEmpty(_section_description))
                                                                {
                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.SectionDescriptionRequired;
                                                                }

                                                                if (!string.IsNullOrEmpty(_errorMessage))
                                                                    _success = false;
                                                                else
                                                                {
                                                                    _sqlQuery.Clear();
                                                                    _sqlQuery.Append("INSERT INTO `section_main` ( ");
                                                                    _sqlQuery.Append("`id`");
                                                                    _sqlQuery.Append(",`section_guid`");
                                                                    _sqlQuery.Append(",`page_id`");
                                                                    _sqlQuery.Append(",`code`");
                                                                    _sqlQuery.Append(",`description`");
                                                                    _sqlQuery.Append(",`status`");
                                                                    _sqlQuery.Append(",`visibility`");
                                                                    _sqlQuery.Append(",`css_class`");
                                                                    _sqlQuery.Append(" ) VALUES ( ");
                                                                    _sqlQuery.Append("'" + _section_id + "'");
                                                                    _sqlQuery.Append(",'" + _section_guid + "'");
                                                                    _sqlQuery.Append("," + _page_id + "");
                                                                    _sqlQuery.Append(",'" + _section_name + "'");
                                                                    _sqlQuery.Append(",'" + _section_description + "'");
                                                                    _sqlQuery.Append(",'1'");
                                                                    _sqlQuery.Append(",'" + _section_visibility + "'");
                                                                    _sqlQuery.Append(",'" + _section_css_class + "');");

                                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                    _rowsAffected = 0;
                                                                    _rowsAffected = (UInt64)_mySqlCommand.ExecuteNonQuery();

                                                                    if (_section_id <= 0)
                                                                    {
                                                                        _success = false;
                                                                    }
                                                                    if (sectionItem.Components.Count <= 0)
                                                                    {
                                                                        _success = false;
                                                                    }
                                                                    // start component
                                                                    if (_success)
                                                                    {
                                                                        // start component loop
                                                                        foreach (var componentItem in sectionItem.Components)
                                                                        {
                                                                            if (_success)
                                                                            {
                                                                                //Sanitize Input 
                                                                                _comp_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(componentItem.ComponentId)));
                                                                                _comp_guid = Sanitization.Sanitize(componentItem.ComponentGuid);
                                                                                _comp_name = Sanitization.Sanitize(componentItem.ComponentName);
                                                                                _comp_cols = Sanitization.Sanitize(componentItem.ComponentCols);
                                                                                _comp_rows = Sanitization.Sanitize(componentItem.ComponentRows);
                                                                                _comp_x = Sanitization.Sanitize(componentItem.ComponentX);
                                                                                _comp_y = Sanitization.Sanitize(componentItem.ComponentY);

                                                                                if (_layout_type != "initiallayout")
                                                                                {
                                                                                    if (_comp_name == "NgxIxcheckTitle")
                                                                                    {
                                                                                        _manTitle = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckFirstname")
                                                                                    {
                                                                                        _manFirstName = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckFathername")
                                                                                    {
                                                                                        _manFatherName = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckDateofbirth")
                                                                                    {
                                                                                        _manDateOfBirth = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckMobilenumber")
                                                                                    {
                                                                                        _manMobile = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckEmail")
                                                                                    {
                                                                                        _manEmail = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckPhotouploader")
                                                                                    {
                                                                                        _manPhoto = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckSignatureUploader")
                                                                                    {
                                                                                        _manSign = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckGender")
                                                                                    {
                                                                                        _manGender = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckPhysicalDisability")
                                                                                    {
                                                                                        _manPH = 1;
                                                                                    }

                                                                                    if (_comp_name == "NgxIxcheckCityPriority1")
                                                                                    {
                                                                                        _manCityPrefrence1 = 1;
                                                                                    }
                                                                                }

                                                                                //page error
                                                                                if (string.IsNullOrEmpty(_comp_guid))
                                                                                {
                                                                                    _errorMessage = ApplicationConstants.ValidationMessages.ComponentGuidRequired;
                                                                                }
                                                                                else if (string.IsNullOrEmpty(_comp_name))
                                                                                {
                                                                                    _errorMessage = ApplicationConstants.ValidationMessages.ComponentNameRequired;
                                                                                }
                                                                                else if (string.IsNullOrEmpty(_comp_cols))
                                                                                {
                                                                                    _errorMessage = ApplicationConstants.ValidationMessages.ComponentColsRequired;
                                                                                }
                                                                                else if (string.IsNullOrEmpty(_comp_rows))
                                                                                {
                                                                                    _errorMessage = ApplicationConstants.ValidationMessages.ComponentRowsRequired;
                                                                                }
                                                                                else if (string.IsNullOrEmpty(_comp_x))
                                                                                {
                                                                                    _errorMessage = ApplicationConstants.ValidationMessages.ComponentXRequired;
                                                                                }
                                                                                else if (string.IsNullOrEmpty(_comp_y))
                                                                                {
                                                                                    _errorMessage = ApplicationConstants.ValidationMessages.ComponentYRequired;
                                                                                }

                                                                                if (!string.IsNullOrEmpty(_errorMessage))
                                                                                {
                                                                                    _success = false;
                                                                                }
                                                                                else
                                                                                {
                                                                                    _sqlQuery.Clear();
                                                                                    _sqlQuery.Append("INSERT INTO `components_main` ( ");
                                                                                    _sqlQuery.Append("`id`");
                                                                                    _sqlQuery.Append(",`section_id`");
                                                                                    _sqlQuery.Append(",`component_guid`");
                                                                                    _sqlQuery.Append(",`name`");
                                                                                    _sqlQuery.Append(",`cols`");
                                                                                    _sqlQuery.Append(",`rows`");
                                                                                    _sqlQuery.Append(",`x`");
                                                                                    _sqlQuery.Append(",`y`");
                                                                                    _sqlQuery.Append(",`status`");
                                                                                    _sqlQuery.Append(" ) VALUES ( ");
                                                                                    _sqlQuery.Append(_comp_id);
                                                                                    _sqlQuery.Append(",'" + _section_id + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_guid + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_name + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_cols + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_rows + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_x + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_y + "'");
                                                                                    _sqlQuery.Append(",'1'");
                                                                                    _sqlQuery.Append(" ); ");

                                                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                    _rowsAffected = 0;
                                                                                    _rowsAffected = (UInt64)_mySqlCommand.ExecuteNonQuery();

                                                                                    if (_rowsAffected <= 0)
                                                                                        _success = false;


                                                                                    if (_success)
                                                                                    {
                                                                                        //reg_grid_components_main
                                                                                        if (componentItem.RegGridComponentsMain != null && componentItem.RegGridComponentsMain.Count > 0)
                                                                                        {
                                                                                            _sqlQuery.Clear();
                                                                                            foreach (RegGridComponentsMain _dataReg in componentItem.RegGridComponentsMain)
                                                                                            {
                                                                                                if (!string.IsNullOrEmpty(_dataReg.Name))
                                                                                                {
                                                                                                    _sqlQuery.Append("INSERT INTO `reg_grid_components_main` ( ");
                                                                                                    _sqlQuery.Append("id");
                                                                                                    _sqlQuery.Append(",reg_component_id");
                                                                                                    _sqlQuery.Append(",code");
                                                                                                    _sqlQuery.Append(",name");
                                                                                                    _sqlQuery.Append(",type");
                                                                                                    _sqlQuery.Append(",display_name");
                                                                                                    _sqlQuery.Append(",api_url");
                                                                                                    _sqlQuery.Append(",height");
                                                                                                    _sqlQuery.Append(",width");
                                                                                                    _sqlQuery.Append(",labelposition");
                                                                                                    _sqlQuery.Append(",description");
                                                                                                    _sqlQuery.Append(",input");
                                                                                                    _sqlQuery.Append(",placeholder");
                                                                                                    _sqlQuery.Append(",defaultValue");
                                                                                                    _sqlQuery.Append(",dataParameter");
                                                                                                    _sqlQuery.Append(",status");
                                                                                                    _sqlQuery.Append(",showingrid");
                                                                                                    _sqlQuery.Append(",isdisabled");
                                                                                                    _sqlQuery.Append(",isoutput");
                                                                                                    _sqlQuery.Append(",label");
                                                                                                    _sqlQuery.Append(",MeasurementType");
                                                                                                    _sqlQuery.Append(",setting_dataGetEndpoint");
                                                                                                    _sqlQuery.Append(",setting_dataDeleteEndpoint");
                                                                                                    _sqlQuery.Append(",visibility");
                                                                                                    _sqlQuery.Append(") VALUES(");
                                                                                                    _sqlQuery.Append(_dataReg.Id);
                                                                                                    _sqlQuery.Append("," + _dataReg.RegComponentId);
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Code + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Name + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Type + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.DisplayName + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.AppUrl + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Height + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Width + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.LabelPosition + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Description + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Input + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Placeholder + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.DefaultValue + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.DataParameter + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Status + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.ShowInGrid + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Isdisabled + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Isoutput + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Label + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.MeasurementType + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.SettingDataGetEndpoint + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.SettingDataDeleteEndpoint + "'");
                                                                                                    _sqlQuery.Append(",'" + _dataReg.Visibility + "');");
                                                                                                }
                                                                                                else
                                                                                                    break;
                                                                                            }

                                                                                            if (_sqlQuery.Length > 0)
                                                                                            {
                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = (UInt64)_mySqlCommand.ExecuteNonQuery();
                                                                                                if (_rowsAffected <= 0)
                                                                                                    _success = false;
                                                                                            }
                                                                                        }
                                                                                        //reg_grid_components_main
                                                                                        // Start Insert in AI Setting main
                                                                                        if (componentItem.AISettings != null && _comp_name == "NgxIxcheckPhotouploaderAi")
                                                                                        {
                                                                                            //Sanitize Input                                                                                  
                                                                                            string _ai_setting_id = Sanitization.Sanitize(componentItem.AISettings.Id);
                                                                                            string _algo_guid = Sanitization.Sanitize(componentItem.AISettings.AlgoGuid);
                                                                                            string _algo_url = Sanitization.Sanitize(componentItem.AISettings.AlgoURL);
                                                                                            string _color_url = Sanitization.Sanitize(componentItem.AISettings.ColorURL);
                                                                                            string _validation_url = Sanitization.Sanitize(componentItem.AISettings.ValidationURL);
                                                                                            string _color_percent_min = Sanitization.Sanitize(componentItem.AISettings.ColorPercentMin);
                                                                                            string _color_percent_max = Sanitization.Sanitize(componentItem.AISettings.ColorPercentMax);
                                                                                            string _face_percent_min = Sanitization.Sanitize(componentItem.AISettings.FacePercentMin);
                                                                                            string _face_percent_max = Sanitization.Sanitize(componentItem.AISettings.FacePercentMax);


                                                                                            if (!string.IsNullOrEmpty(_errorMessage))
                                                                                            {
                                                                                                _success = false;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `reg_components_ai_setting` ( ");
                                                                                                _sqlQuery.Append("`id`");
                                                                                                _sqlQuery.Append(",`comp_id`");
                                                                                                _sqlQuery.Append(",`algo_guid`");
                                                                                                _sqlQuery.Append(",`algo_url`");
                                                                                                _sqlQuery.Append(",`color_url`");
                                                                                                _sqlQuery.Append(",`validation_url`");
                                                                                                _sqlQuery.Append(",`color_percent_min`");
                                                                                                _sqlQuery.Append(",`color_percent_max`");
                                                                                                _sqlQuery.Append(",`face_percent_min`");
                                                                                                _sqlQuery.Append(",`face_percent_max`");

                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append(_ai_setting_id);
                                                                                                _sqlQuery.Append("," + _comp_id);
                                                                                                _sqlQuery.Append(",'" + _algo_guid + "'");
                                                                                                _sqlQuery.Append(",'" + _algo_url + "'");
                                                                                                _sqlQuery.Append(",'" + _color_url + "'");
                                                                                                _sqlQuery.Append(",'" + _validation_url + "'");
                                                                                                _sqlQuery.Append(",'" + _color_percent_min + "'");
                                                                                                _sqlQuery.Append(",'" + _color_percent_max + "'");
                                                                                                _sqlQuery.Append(",'" + _face_percent_min + "'");
                                                                                                _sqlQuery.Append(",'" + _face_percent_max + "'");

                                                                                                _sqlQuery.Append(" ); ");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = (UInt64)_mySqlCommand.ExecuteNonQuery();

                                                                                                foreach (AIColorSetting _aiColorSetting in componentItem.AISettings.Colors)
                                                                                                {
                                                                                                    string _ai_color_id = Sanitization.Sanitize(_aiColorSetting.Id);
                                                                                                    string _color_guid = Sanitization.Sanitize(_aiColorSetting.ColorGuid);
                                                                                                    string _blue_min = Sanitization.Sanitize(_aiColorSetting.BlueMin);
                                                                                                    string _blue_max = Sanitization.Sanitize(_aiColorSetting.BlueMax);
                                                                                                    string _green_min = Sanitization.Sanitize(_aiColorSetting.GreenMin);
                                                                                                    string _green_max = Sanitization.Sanitize(_aiColorSetting.GreenMax);
                                                                                                    string _red_min = Sanitization.Sanitize(_aiColorSetting.RedMin);
                                                                                                    string _red_max = Sanitization.Sanitize(_aiColorSetting.RedMax);

                                                                                                    _sqlQuery = _sqlQuery.Clear();
                                                                                                    _sqlQuery.Append("INSERT INTO `reg_components_ai_color` ( ");
                                                                                                    _sqlQuery.Append("`id`");
                                                                                                    _sqlQuery.Append(",`reg_components_ai_setting_id`");
                                                                                                    _sqlQuery.Append(",`color_guid`");
                                                                                                    _sqlQuery.Append(",`blue_percent_min`");
                                                                                                    _sqlQuery.Append(",`blue_percent_max`");
                                                                                                    _sqlQuery.Append(",`green_percent_min`");
                                                                                                    _sqlQuery.Append(",`green_percent_max`");
                                                                                                    _sqlQuery.Append(",`red_percent_min`");
                                                                                                    _sqlQuery.Append(",`red_percent_max`");

                                                                                                    _sqlQuery.Append(" ) VALUES ( ");
                                                                                                    _sqlQuery.Append(_ai_color_id);
                                                                                                    _sqlQuery.Append("," + _ai_setting_id);
                                                                                                    _sqlQuery.Append(",'" + _color_guid + "'");
                                                                                                    _sqlQuery.Append(",'" + _blue_min + "'");
                                                                                                    _sqlQuery.Append(",'" + _blue_max + "'");
                                                                                                    _sqlQuery.Append(",'" + _green_min + "'");
                                                                                                    _sqlQuery.Append(",'" + _green_max + "'");
                                                                                                    _sqlQuery.Append(",'" + _red_min + "'");
                                                                                                    _sqlQuery.Append(",'" + _red_max + "'");

                                                                                                    _sqlQuery.Append(" ); ");

                                                                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                    _queryStart = DateTime.Now;
                                                                                                    _rowsAffected = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());

                                                                                                    if (_rowsAffected <= 0)
                                                                                                    {
                                                                                                        _success = false;
                                                                                                        break;
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        // End Insert in AI Setting main

                                                                                        // Start Insert in Setting main
                                                                                        if (componentItem.Setting != null)
                                                                                        {
                                                                                            //Sanitize Input                                                                               
                                                                                            _setting_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(componentItem.Setting.SettingId)));
                                                                                            _setting_measurementType = Sanitization.Sanitize(componentItem.Setting.SettingMeasurementType);
                                                                                            _setting_height = Sanitization.Sanitize(componentItem.Setting.SettingHeight);
                                                                                            _setting_width = Sanitization.Sanitize(componentItem.Setting.SettingWidth);
                                                                                            _setting_labelposition = Sanitization.Sanitize(componentItem.Setting.SettingLabelposition);
                                                                                            _setting_type = Sanitization.Sanitize(componentItem.Setting.SettingType);
                                                                                            _setting_label = Sanitization.Sanitize(componentItem.Setting.SettingLabel);
                                                                                            _setting_description = Sanitization.Sanitize(componentItem.Setting.SettingDescription);
                                                                                            _setting_input = Sanitization.Sanitize(componentItem.Setting.SettingInput);
                                                                                            _setting_placeholder = Sanitization.Sanitize(componentItem.Setting.SettingPlaceholder);
                                                                                            _setting_endpoint = Sanitization.Sanitize(componentItem.Setting.SettingEndPoint);
                                                                                            _setting_defaultValue = Sanitization.Sanitize(componentItem.Setting.SettingDefaultValue);
                                                                                            _setting_dataParameter = Sanitization.Sanitize(componentItem.Setting.SettingDataParameter);
                                                                                            _setting_showingrid = Sanitization.Sanitize(componentItem.Setting.SettingShowInGrid);

                                                                                            _setting_allowTextUppercase = Sanitization.Sanitize(componentItem.Setting.SettingAllowTextUppercase);
                                                                                            //_setting_isdisabled = Sanitization.Sanitize(componentItem.Setting.SettingIsDisabled);
                                                                                            //_setting_isoutput = Sanitization.Sanitize(componentItem.Setting.SettingIsOutput);
                                                                                            //page error

                                                                                            if (_setting_showingrid != null)
                                                                                            {
                                                                                                if (_setting_showingrid.ToLower() == "true")
                                                                                                {
                                                                                                    _setting_showingrid = "1";
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _setting_showingrid = "0";
                                                                                                }
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _setting_showingrid = "0";
                                                                                            }

                                                                                            if (_setting_isdisabled != null)
                                                                                            {
                                                                                                if (_setting_isdisabled.ToLower() == "true")
                                                                                                {
                                                                                                    _setting_isdisabled = "1";
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _setting_isdisabled = "0";
                                                                                                }
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _setting_isdisabled = "0";
                                                                                            }

                                                                                            if (_setting_isoutput != null)
                                                                                            {
                                                                                                if (_setting_isoutput.ToLower() == "true")
                                                                                                {
                                                                                                    _setting_isoutput = "1";
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _setting_isoutput = "0";
                                                                                                }
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _setting_isoutput = "0";
                                                                                            }


                                                                                            if (string.IsNullOrEmpty(_setting_height))
                                                                                            {
                                                                                                _setting_height = "0";
                                                                                            }
                                                                                            if (string.IsNullOrEmpty(_setting_width))
                                                                                            {
                                                                                                _setting_width = "0";
                                                                                            }
                                                                                            if (string.IsNullOrEmpty(_setting_measurementType))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingMeasurementType;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_height))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingHeight;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_width))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingWidth;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_labelposition))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingLabelposition;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_type))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingType;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_label))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingLabel;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_description))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingDescription;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_input))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingInput;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_placeholder))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingPlaceholder;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_endpoint))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingPlaceholder;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_defaultValue))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingPlaceholder;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_dataParameter))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingPlaceholder;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_setting_showingrid))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.SettingPlaceholder;
                                                                                            }

                                                                                            if (!string.IsNullOrEmpty(_errorMessage))
                                                                                                _success = false;
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `settings_main` ( ");
                                                                                                _sqlQuery.Append("`id`");
                                                                                                _sqlQuery.Append(",`component_id`");
                                                                                                _sqlQuery.Append(",`MeasurementType`");
                                                                                                _sqlQuery.Append(",`height`");
                                                                                                _sqlQuery.Append(",`width`");
                                                                                                _sqlQuery.Append(",`labelposition`");
                                                                                                _sqlQuery.Append(",`type`");
                                                                                                _sqlQuery.Append(",`label`");
                                                                                                _sqlQuery.Append(",`description`");
                                                                                                _sqlQuery.Append(",`input`");
                                                                                                _sqlQuery.Append(",`placeholder`");
                                                                                                _sqlQuery.Append(",`endPoint`");
                                                                                                _sqlQuery.Append(",`defaultValue`");
                                                                                                _sqlQuery.Append(",`dataParameter`");
                                                                                                _sqlQuery.Append(",`status`");
                                                                                                _sqlQuery.Append(",`showingrid`");
                                                                                                _sqlQuery.Append(",`isdisabled`");
                                                                                                _sqlQuery.Append(",`isoutput`");
                                                                                                _sqlQuery.Append(",`dataGetEndpoint`");
                                                                                                _sqlQuery.Append(",`dataDeleteEndpoint`");
                                                                                                _sqlQuery.Append(",`allowTextUppercase`");


                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append(_setting_id);
                                                                                                _sqlQuery.Append("," + _comp_id);
                                                                                                _sqlQuery.Append(",'" + _setting_measurementType + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_height + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_width + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_labelposition + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_type + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_label + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_description + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_input + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_placeholder + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_endpoint + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_defaultValue + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_dataParameter + "'");
                                                                                                _sqlQuery.Append(",'1'");
                                                                                                _sqlQuery.Append(",'" + _setting_showingrid + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_isdisabled + "'");
                                                                                                _sqlQuery.Append(",'" + _setting_isoutput + "'");
                                                                                                _sqlQuery.Append(",'" + Sanitization.Sanitize(componentItem.Setting.SettingDataGetEndpoint) + "'");
                                                                                                _sqlQuery.Append(",'" + Sanitization.Sanitize(componentItem.Setting.SettingDataDeleteEndpoint) + "'");
                                                                                                _sqlQuery.Append(",'" + Sanitization.Sanitize(componentItem.Setting.SettingAllowTextUppercase) + "'");
                                                                                                _sqlQuery.Append(" ); ");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = 0;
                                                                                                _rowsAffected = (UInt64)_mySqlCommand.ExecuteNonQuery();
                                                                                            }
                                                                                        }
                                                                                        // End Insert in Setting main

                                                                                        // Start Insert in validation main
                                                                                        if (componentItem.Validations != null && _setting_type != "button" && componentItem.Validations.ValidationId > 0)
                                                                                        {
                                                                                            //Sanitize Input 
                                                                                            _valid_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(componentItem.Validations.ValidationId)));
                                                                                            _valid_errormessage = Sanitization.Sanitize(componentItem.Validations.ValidationErrorMessage);
                                                                                            _valid_maxdate = Sanitization.Sanitize(componentItem.Validations.ValidationMaxDate);
                                                                                            _valid_maxlength = Sanitization.Sanitize(componentItem.Validations.ValidationMaxLength);
                                                                                            _valid_mindate = Sanitization.Sanitize(componentItem.Validations.ValidationMinDate);
                                                                                            _valid_minlength = Sanitization.Sanitize(componentItem.Validations.ValidationMinLength);
                                                                                            _valid_regex = Sanitization.Sanitize(componentItem.Validations.ValidationRegex);
                                                                                            _valid_required = Sanitization.Sanitize(componentItem.Validations.ValidationRequired);
                                                                                            _valid_unique = Sanitization.Sanitize(componentItem.Validations.ValidationUnique);
                                                                                            _valid_uniqueURL = Sanitization.Sanitize(componentItem.Validations.ValidationUniqueURL);
                                                                                            _valid_allowed_extentions = Sanitization.Sanitize(componentItem.Validations.ValidationAllowedExtentions);
                                                                                            _valid_allowed_size = Sanitization.Sanitize(componentItem.Validations.ValidationAllowedSize);
                                                                                            _valid_maxwidth = Sanitization.Sanitize(componentItem.Validations.ValidationMaxWidth);
                                                                                            _valid_minwidth = Sanitization.Sanitize(componentItem.Validations.ValidationMinWidth);
                                                                                            _valid_maxheight = Sanitization.Sanitize(componentItem.Validations.ValidationMaxHeight);
                                                                                            _valid_minheight = Sanitization.Sanitize(componentItem.Validations.ValidationMinHeight);
                                                                                            _valid_allowed_file_count = Sanitization.Sanitize(componentItem.Validations.ValidationAllowedFileCount);

                                                                                            _valid_otp_varification = Sanitization.Sanitize(componentItem.Validations.ValidationOtpVerification);


                                                                                            if (_valid_required != null)
                                                                                            {
                                                                                                if (_valid_required.ToLower() == "true")
                                                                                                {
                                                                                                    _valid_required = "1";
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _valid_required = "0";
                                                                                                }
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _valid_required = "0";
                                                                                            }

                                                                                            if (_valid_unique != null)
                                                                                            {
                                                                                                if (_valid_unique.ToLower() == "true")
                                                                                                {
                                                                                                    _valid_unique = "1";
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _valid_unique = "0";
                                                                                                }
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _valid_unique = "0";
                                                                                            }

                                                                                            if (_valid_otp_varification != null)
                                                                                            {
                                                                                                if (_valid_otp_varification.ToLower() == "true")
                                                                                                {
                                                                                                    _valid_otp_varification = "1";
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _valid_otp_varification = "0";
                                                                                                }
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _valid_otp_varification = "0";
                                                                                            }

                                                                                            //page error
                                                                                            if (string.IsNullOrEmpty(_valid_errormessage))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationErrorMessage;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_maxdate))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMaxdate;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_maxlength))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMaxLength;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_mindate))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMinDate;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_minlength))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMinLength;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_regex))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationRegex;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_required))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationRequired;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_unique))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationRequired;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_uniqueURL))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationRequired;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_allowed_extentions))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationRequired;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_allowed_size))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationRequired;
                                                                                            }

                                                                                            else if (string.IsNullOrEmpty(_valid_minwidth))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMinDate;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_minheight))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMinLength;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_maxwidth))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMinDate;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_maxheight))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationMinLength;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_valid_allowed_file_count))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ValidationAllowedFileCount;
                                                                                            }


                                                                                            if (!string.IsNullOrEmpty(_errorMessage))
                                                                                                _success = false;
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `validations_main` ( ");
                                                                                                _sqlQuery.Append("`id`");
                                                                                                _sqlQuery.Append(",`component_id`");
                                                                                                _sqlQuery.Append(",`required`");
                                                                                                _sqlQuery.Append(",`maxlength`");
                                                                                                _sqlQuery.Append(",`minlength`");
                                                                                                _sqlQuery.Append(",`mindate`");
                                                                                                _sqlQuery.Append(",`maxdate`");
                                                                                                _sqlQuery.Append(",`regex`");
                                                                                                _sqlQuery.Append(",`errormessage`");
                                                                                                _sqlQuery.Append(",`status`");
                                                                                                _sqlQuery.Append(",`isunique`");
                                                                                                _sqlQuery.Append(",`uniqueURL`");
                                                                                                _sqlQuery.Append(",`allowedExtentions`");
                                                                                                _sqlQuery.Append(",`allowedSize`");
                                                                                                _sqlQuery.Append(",`maxheight`");
                                                                                                _sqlQuery.Append(",`minheight`");
                                                                                                _sqlQuery.Append(",`maxwidth`");
                                                                                                _sqlQuery.Append(",`minwidth`");
                                                                                                _sqlQuery.Append(",`otp_varification`");
                                                                                                _sqlQuery.Append(",`allowedFileCount`");
                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append(_valid_id);
                                                                                                _sqlQuery.Append("," + _comp_id);
                                                                                                _sqlQuery.Append(",'" + _valid_required + "'");
                                                                                                //_sqlQuery.Append("," + _valid_maxlength  );
                                                                                                //_sqlQuery.Append("," + _valid_minlength );
                                                                                                if (!string.IsNullOrEmpty(_valid_maxlength))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_maxlength + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");

                                                                                                }
                                                                                                if (!string.IsNullOrEmpty(_valid_minlength))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_minlength + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");
                                                                                                }

                                                                                                if (!string.IsNullOrEmpty(_valid_mindate) && ValidationFunctions.IsValidDate(_valid_mindate) == false)
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_mindate + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");
                                                                                                }
                                                                                                if (!string.IsNullOrEmpty(_valid_maxdate) && ValidationFunctions.IsValidDate(_valid_maxdate) == false)
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_maxdate + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");
                                                                                                }

                                                                                                _sqlQuery.Append(",'" + _valid_regex + "'");
                                                                                                _sqlQuery.Append(",'" + _valid_errormessage + "'");
                                                                                                _sqlQuery.Append(",'1'");
                                                                                                _sqlQuery.Append(",'" + _valid_unique + "'");
                                                                                                _sqlQuery.Append(",'" + _valid_uniqueURL + "'");
                                                                                                _sqlQuery.Append(",'" + _valid_allowed_extentions + "'");

                                                                                                if (!string.IsNullOrEmpty(_valid_allowed_size))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_allowed_size + "'");
                                                                                                }
                                                                                                else
                                                                                                    _sqlQuery.Append(",null");
                                                                                                if (!string.IsNullOrEmpty(_valid_maxheight))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_maxheight + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");
                                                                                                }
                                                                                                if (!string.IsNullOrEmpty(_valid_minheight))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_minheight + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");

                                                                                                }
                                                                                                if (!string.IsNullOrEmpty(_valid_maxwidth))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_maxwidth + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");

                                                                                                }
                                                                                                if (!string.IsNullOrEmpty(_valid_minwidth))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_minwidth + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");

                                                                                                }

                                                                                                if (!string.IsNullOrEmpty(_valid_otp_varification))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_otp_varification + "'");
                                                                                                }
                                                                                                else
                                                                                                    _sqlQuery.Append(",null");

                                                                                                if (!string.IsNullOrEmpty(_valid_allowed_file_count))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_allowed_file_count + "'");
                                                                                                }
                                                                                                else
                                                                                                    _sqlQuery.Append(",null");

                                                                                                _sqlQuery.Append(" ); ");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = 0;
                                                                                                _rowsAffected = (UInt64)_mySqlCommand.ExecuteNonQuery();
                                                                                            }
                                                                                        }
                                                                                        /// End Insert in validation main

                                                                                        // Insert in data_object
                                                                                        if (componentItem.DataObjects != null && componentItem.DataObjects.DataObjectId > 0)
                                                                                        {
                                                                                            //Sanitize Input 
                                                                                            _dataobject_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(componentItem.DataObjects.DataObjectId)));
                                                                                            _dataobject_endpoint = Sanitization.Sanitize(componentItem.DataObjects.DataObjectEndPoint);
                                                                                            _dataobject_textfield = Sanitization.Sanitize(componentItem.DataObjects.DataObjectTextField);
                                                                                            _dataobject_valuefield = Sanitization.Sanitize(componentItem.DataObjects.DataObjectValueField);

                                                                                            //page error
                                                                                            if (string.IsNullOrEmpty(_dataobject_endpoint))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.DataObjectEndpoint;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_dataobject_textfield))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.DataObjectTextField;
                                                                                            }
                                                                                            else if (string.IsNullOrEmpty(_dataobject_valuefield))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.DataObjectValueField;
                                                                                            }
                                                                                            if (!string.IsNullOrEmpty(_errorMessage))
                                                                                                _success = false;
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `data_object` ( ");
                                                                                                _sqlQuery.Append("`id`");
                                                                                                _sqlQuery.Append(",`component_id`");
                                                                                                _sqlQuery.Append(",`end_point`");
                                                                                                _sqlQuery.Append(",`text_field`");
                                                                                                _sqlQuery.Append(",`value_field`");
                                                                                                _sqlQuery.Append(",`status`");
                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append(_dataobject_id);
                                                                                                _sqlQuery.Append("," + _comp_id);
                                                                                                _sqlQuery.Append(",'" + _dataobject_endpoint + "'");
                                                                                                _sqlQuery.Append(",'" + _dataobject_textfield + "'");
                                                                                                _sqlQuery.Append(",'" + _dataobject_valuefield + "'");
                                                                                                _sqlQuery.Append(",'1'");
                                                                                                _sqlQuery.Append(" ); ");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = 0;
                                                                                                _rowsAffected = (UInt64)_mySqlCommand.ExecuteNonQuery();
                                                                                            }

                                                                                        }
                                                                                        // End Insert in data object

                                                                                        // Insert in condition

                                                                                        if (componentItem.Conditions != null && componentItem.Conditions.ConditionId > 0)
                                                                                        {
                                                                                            //Sanitize Input 
                                                                                            _condition_id = Convert.ToUInt64(Sanitization.Sanitize(Convert.ToString(componentItem.Conditions.ConditionId)));
                                                                                            _condition_conditional = Sanitization.Sanitize(componentItem.Conditions.ConditionConditional);
                                                                                            _condition_eventType = Sanitization.Sanitize(componentItem.Conditions.ConditionEventType);
                                                                                            _condition_changeType = Sanitization.Sanitize(componentItem.Conditions.ConditionChangeType);
                                                                                            _condition_componentToChange = Sanitization.Sanitize(componentItem.Conditions.ConditionComponentToChange);
                                                                                            _ConditionsectionToShowHide = Sanitization.Sanitize(componentItem.Conditions.ConditionsectionToShowHide);
                                                                                            //page error
                                                                                            if (string.IsNullOrEmpty(_condition_conditional))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ConditionConditional;
                                                                                            }
                                                                                            if (string.IsNullOrEmpty(_condition_eventType))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ConditionConditional;
                                                                                            }
                                                                                            if (string.IsNullOrEmpty(_condition_changeType))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ConditionConditional;
                                                                                            }
                                                                                            if (string.IsNullOrEmpty(_condition_componentToChange))
                                                                                            {
                                                                                                //_errorMessage = ApplicationConstants.ValidationMessages.ConditionConditional;
                                                                                            }
                                                                                            if (!string.IsNullOrEmpty(_errorMessage))
                                                                                                _success = false;
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `condition_main` ( ");
                                                                                                _sqlQuery.Append("`id`");
                                                                                                _sqlQuery.Append(",`component_id`");
                                                                                                _sqlQuery.Append(",`condition_component_id`");
                                                                                                _sqlQuery.Append(",`conditional`");
                                                                                                _sqlQuery.Append(",`status`");
                                                                                                _sqlQuery.Append(",`eventType`");
                                                                                                _sqlQuery.Append(",`changeType`");
                                                                                                _sqlQuery.Append(",`componentToChange`");
                                                                                                _sqlQuery.Append(",`sectionToShowHide`");
                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append(_condition_id);
                                                                                                _sqlQuery.Append("," + _comp_id);
                                                                                                _sqlQuery.Append(",'" + _comp_guid + "'");
                                                                                                _sqlQuery.Append(",'" + _condition_conditional + "'");
                                                                                                _sqlQuery.Append(",'1'");
                                                                                                _sqlQuery.Append(",'" + _condition_eventType + "'");
                                                                                                _sqlQuery.Append(",'" + _condition_changeType + "'");
                                                                                                _sqlQuery.Append(",'" + _condition_componentToChange + "'");
                                                                                                _sqlQuery.Append(",'" + _ConditionsectionToShowHide + "'");
                                                                                                _sqlQuery.Append(" ); ");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _condition_id = (UInt64)_mySqlCommand.ExecuteNonQuery();
                                                                                            }
                                                                                        }
                                                                                        // End Insert in condition
                                                                                    }
                                                                                }
                                                                            }
                                                                            else
                                                                                break;
                                                                        }
                                                                        // end component loop
                                                                    }
                                                                    // end component
                                                                }
                                                            }
                                                            else
                                                                break;
                                                        }
                                                        // end section loop
                                                    }
                                                    // end section
                                                }
                                            }
                                            else
                                                break;
                                        }
                                        // end page loop

                                        // end from json
                                    }
                                    catch (Exception ex)
                                    {
                                        //ERROR - Treating as App Error
                                        _errorMessage = ex.Message;
                                        _success = false;
                                    }
                                }
                                // end page
                                #endregion
                            }
                            #endregion

                            if (_success)
                            {
                                _sqlQuery.Clear();
                                if (_response.ConfigMain != null && !string.IsNullOrEmpty(_response.ConfigMain.RegistrationGuid))
                                {
                                    _sqlQuery.Append("INSERT INTO config_main(");
                                    //_sqlQuery.Append("id");
                                    _sqlQuery.Append("config_type_id");
                                    _sqlQuery.Append(",config_key_id");
                                    _sqlQuery.Append(",value");
                                    _sqlQuery.Append(",status");
                                    _sqlQuery.Append(",registration_guid");
                                    _sqlQuery.Append(",datetimestamp)");
                                    _sqlQuery.Append("VALUES(");
                                    //_sqlQuery.Append("'" + Sanitization.Sanitize(_response.ConfigMain.Id) + "'");
                                    _sqlQuery.Append("1");
                                    _sqlQuery.Append(",1");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.ConfigMain.ConfigValue + _response.ConfigMain.RegistrationGuid) + "'");
                                    _sqlQuery.Append(",1");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.ConfigMain.RegistrationGuid) + "'");
                                    _sqlQuery.Append(",CURRENT_TIMESTAMP());");
                                }

                                if (_response.EmailSetup != null && !string.IsNullOrEmpty(_response.EmailSetup.RegistrationGuid))
                                {
                                    _sqlQuery.Append("INSERT INTO email_setup(");
                                    //_sqlQuery.Append("id");
                                    _sqlQuery.Append("registration_guid");
                                    _sqlQuery.Append(",smtp");
                                    _sqlQuery.Append(",smtp_port");
                                    _sqlQuery.Append(",sender_email");
                                    _sqlQuery.Append(",sender_name");
                                    _sqlQuery.Append(",verify_email_id");
                                    _sqlQuery.Append(",password");
                                    _sqlQuery.Append(",email_subject");
                                    _sqlQuery.Append(",email_template)VALUES(");
                                    //_sqlQuery.Append(Sanitization.Sanitize(_response.EmailSetup.Id));
                                    _sqlQuery.Append("'" + Sanitization.Sanitize(_response.EmailSetup.RegistrationGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.Smtp) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.SmtpPort) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.SenderEmail) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.SenderName) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.VerifyEmailId) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.Password) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.EmailSubject) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.EmailSetup.EmailTemplate) + "');");
                                }

                                if (_response.Exams != null && _response.Exams.Count > 0)
                                {
                                    foreach (Exams _data in _response.Exams)
                                    {
                                        _sqlQuery.Append("INSERT INTO exams_main(");
                                        //_sqlQuery.Append("id");
                                        //_sqlQuery.Append("exam_type_guid");
                                        //_sqlQuery.Append(",exam_type");
                                        _sqlQuery.Append("exam_guid");
                                        //_sqlQuery.Append(",exam_number");
                                        _sqlQuery.Append(",code");
                                        _sqlQuery.Append(",name");
                                        _sqlQuery.Append(",exam_duration");
                                        //_sqlQuery.Append(",planning_status_guid");
                                        _sqlQuery.Append(",duration_uom_guid");
                                        //_sqlQuery.Append(",no_of_shifts");
                                        _sqlQuery.Append(",no_of_city_priority");
                                        _sqlQuery.Append(",status)VALUES(");
                                        //_sqlQuery.Append("'" + Sanitization.Sanitize(_data.Id) + "'");
                                        //_sqlQuery.Append("'" + Sanitization.Sanitize(_data.ExamTypeGuid) + "'");
                                        //_sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ExamType) + "'");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.ExamGuid) + "'");
                                        //_sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ExamNumber) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ExamCode) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ExamName) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ExamDuration) + "'");
                                        //_sqlQuery.Append(",'" + Sanitization.Sanitize(_data.PlanningStatusGuid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.DurationUOMGuid) + "'");
                                        //_sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ExamNumberOfShifts)+"'");
                                        _sqlQuery.Append("," + (string.IsNullOrEmpty(_data.NoOfCityPriority) ? "NULL" : "'" + Sanitization.Sanitize(_data.NoOfCityPriority) + "'"));
                                        _sqlQuery.Append("," + _data.Status + ");");
                                    }
                                }

                                if (_response.RegistrationFeeSetup != null && _response.RegistrationFeeSetup.Count > 0 && !string.IsNullOrEmpty(_response.RegistrationFeeSetup.First().RegistrationGuid))
                                {
                                    foreach (RegistrationFeeSetup _feeData in _response.RegistrationFeeSetup)
                                    {
                                        _sqlQuery.Append("INSERT INTO registration_fee_setup(");
                                        //_sqlQuery.Append("`id`,");
                                        _sqlQuery.Append("`level1`,`level2`,`level3`,`Amount`,`status`,`exam_guid`,registration_guid,reg_type_guid)VALUES(");
                                        //_sqlQuery.Append(Sanitization.Sanitize(_feeData.Id));
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_feeData.Level1) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.Level2) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.Level3) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.Amount) + "'");
                                        _sqlQuery.Append("," + _feeData.Status);
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.ExamGuid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.RegistrationGuid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.RegTypeGuid) + "');");
                                    }
                                }

                                if (_response.RegistrationFeeType != null && _response.RegistrationFeeType.Count > 0 && !string.IsNullOrEmpty(_response.RegistrationFeeType.First().Guid))
                                {
                                    foreach (RegistrationFeeType _feeData in _response.RegistrationFeeType)
                                    {
                                        _sqlQuery.Append("INSERT INTO registrations_fee_type(");
                                        _sqlQuery.Append("guid,code,name,status)VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_feeData.Guid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.Code) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.Name) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.Status) + "');");
                                    }
                                }

                                if (_response.ExamToRegType != null && _response.ExamToRegType.Count > 0 && !string.IsNullOrEmpty(_response.ExamToRegType.First().Guid))
                                {
                                    foreach (ExamToRegType _data in _response.ExamToRegType)
                                    {
                                        _sqlQuery.Append("INSERT INTO exam_to_reg_type(");
                                        _sqlQuery.Append("guid");
                                        _sqlQuery.Append(",registration_guid");
                                        _sqlQuery.Append(",exam_guid");
                                        _sqlQuery.Append(",reg_type_guid");
                                        _sqlQuery.Append(")VALUES('");
                                        _sqlQuery.Append(Sanitization.Sanitize(_data.Guid));
                                        _sqlQuery.Append("','" + Sanitization.Sanitize(_data.RegistrationGuid));
                                        _sqlQuery.Append("','" + Sanitization.Sanitize(_data.ExamGuid));
                                        _sqlQuery.Append("','" + Sanitization.Sanitize(_data.RegTypeGuid) + "');");
                                    }
                                }

                                if (_response.RegistrationMain != null && _response.RegistrationMain.Count > 0)
                                {
                                    foreach (RegistrationMain _data in _response.RegistrationMain)
                                    {
                                        _sqlQuery.Append("INSERT INTO registrations_main(");
                                        //_sqlQuery.Append("id");
                                        _sqlQuery.Append("guid");
                                        _sqlQuery.Append(",code");
                                        _sqlQuery.Append(",name");
                                        _sqlQuery.Append(",status");
                                        _sqlQuery.Append(")VALUES(");
                                        // _sqlQuery.Append("'" + Sanitization.Sanitize(_data.Id) + "'");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.Guid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Code) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Name) + "'");
                                        _sqlQuery.Append("," + _data.Status + ");");
                                    }
                                }

                                if (_response.RegEligibilityFunctionsMain != null && !string.IsNullOrEmpty(_response.RegEligibilityFunctionsMain.Code))
                                {
                                    _sqlQuery.Append("INSERT INTO reg_eligibility_functions_main(");
                                    //_sqlQuery.Append("id");
                                    _sqlQuery.Append("code");
                                    _sqlQuery.Append(",name");
                                    _sqlQuery.Append(",description");
                                    _sqlQuery.Append(",status");
                                    _sqlQuery.Append(")VALUES(");
                                    //_sqlQuery.Append("'" + Sanitization.Sanitize(_response.RegEligibilityFunctionsMain.Id) + "'");
                                    _sqlQuery.Append("'" + Sanitization.Sanitize(_response.RegEligibilityFunctionsMain.Code) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegEligibilityFunctionsMain.Name) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegEligibilityFunctionsMain.Description) + "'");
                                    _sqlQuery.Append("," + _response.RegEligibilityFunctionsMain.Status + ");");
                                }

                                if (_response.RegistrationToRegTypeStatus != null && !string.IsNullOrEmpty(_response.RegistrationToRegTypeStatus.RegistrationGuid))
                                {
                                    _sqlQuery.Append("INSERT INTO registration_to_reg_type_status(");
                                    _sqlQuery.Append("registration_guid");
                                    _sqlQuery.Append(",reg_type_guid");
                                    _sqlQuery.Append(",eligibility_function_guid");
                                    _sqlQuery.Append(",eligibility_input_json");
                                    _sqlQuery.Append(")VALUES(");
                                    _sqlQuery.Append("'" + Sanitization.Sanitize(_response.RegistrationToRegTypeStatus.RegistrationGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegistrationToRegTypeStatus.RegTypeGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegistrationToRegTypeStatus.EligibilityFunctionGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegistrationToRegTypeStatus.EligibilityInputJson) + "');");
                                }

                                if (_response.CandidateToRegTypeStatus != null && !string.IsNullOrEmpty(_response.CandidateToRegTypeStatus.CandidateGuid))
                                {
                                    _sqlQuery.Append("INSERT INTO candidate_to_reg_type_status(");
                                    _sqlQuery.Append("candidate_guid");
                                    _sqlQuery.Append(",registration_guid");
                                    _sqlQuery.Append(",reg_type_guid");
                                    _sqlQuery.Append(",eligibility_output_json");
                                    _sqlQuery.Append(",eligibility_status");
                                    _sqlQuery.Append(")VALUES(");
                                    _sqlQuery.Append("'" + Sanitization.Sanitize(_response.CandidateToRegTypeStatus.CandidateGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.CandidateToRegTypeStatus.RegistrationGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.CandidateToRegTypeStatus.RegTypeGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.CandidateToRegTypeStatus.EligibilityOutputJson) + "'");
                                    _sqlQuery.Append("," + Sanitization.Sanitize(_response.CandidateToRegTypeStatus.EligibilityStatus) + ");");
                                }

                                if (_response.RegistrationToLayout != null && !string.IsNullOrEmpty(_response.RegistrationToLayout.RegistrationGuid))
                                {
                                    _sqlQuery.Append("INSERT INTO registration_to_layout(");
                                    //_sqlQuery.Append("id");
                                    _sqlQuery.Append("registration_guid");
                                    _sqlQuery.Append(",layout_id");
                                    _sqlQuery.Append(",initial_layout_id");
                                    _sqlQuery.Append(",initial_layout_json");
                                    _sqlQuery.Append(",layout_json");
                                    _sqlQuery.Append(",status)");
                                    _sqlQuery.Append("VALUES(");
                                    //_sqlQuery.Append("'" + Sanitization.Sanitize(_response.RegistrationToLayout.Id) + "'");
                                    _sqlQuery.Append("'" + Sanitization.Sanitize(_response.RegistrationToLayout.RegistrationGuid) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegistrationToLayout.LayoutId) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegistrationToLayout.InitialLayoutId) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegistrationToLayout.InitialLayoutJson) + "'");
                                    _sqlQuery.Append(",'" + Sanitization.Sanitize(_response.RegistrationToLayout.LayoutJson) + "'");
                                    _sqlQuery.Append("," + _response.RegistrationToLayout.Status + ");");
                                }

                                if (_response.RegistrationsToExam != null && _response.RegistrationsToExam.Count > 0 && !string.IsNullOrEmpty(_response.RegistrationsToExam.First().RegistrationGuid))
                                {
                                    foreach (RegistrationsToExam _feeData in _response.RegistrationsToExam)
                                    {
                                        _sqlQuery.Append("INSERT INTO registration_to_exam(");
                                        _sqlQuery.Append("`registration_guid`,`exam_guid`)VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_feeData.RegistrationGuid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_feeData.ExamGuid) + "');");
                                    }
                                }

                                if (_response.RegTypes != null && _response.RegTypes.Count > 0 && !string.IsNullOrEmpty(_response.RegTypes.First().Guid))
                                {
                                    foreach (RegType _data in _response.RegTypes)
                                    {
                                        _sqlQuery.Append("INSERT INTO reg_types(");
                                        _sqlQuery.Append("guid");
                                        _sqlQuery.Append(",registration_guid");
                                        _sqlQuery.Append(",code");
                                        _sqlQuery.Append(",name");
                                        _sqlQuery.Append(",description");
                                        _sqlQuery.Append(",status");
                                        _sqlQuery.Append(")VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.Guid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.RegistrationGuid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Code) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Name) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Description) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Status) + "');");
                                    }
                                }

                                if (_response.RegistrationsToCities != null && _response.RegistrationsToCities.Count > 0 && !string.IsNullOrEmpty(_response.RegistrationsToCities.First().RegistrationGuid))
                                {
                                    foreach (RegistrationsToCities _data in _response.RegistrationsToCities)
                                    {
                                        _sqlQuery.Append("INSERT INTO registrations_to_cities(");
                                        _sqlQuery.Append("registration_guid");
                                        _sqlQuery.Append(",city_number");
                                        _sqlQuery.Append(",city_guid");
                                        _sqlQuery.Append(")VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.RegistrationGuid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.CityNumber) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.CityGuid) + "');");
                                    }
                                }
                                /*******************************************/

                                if (_response.PaymentGatewayTypes != null && _response.PaymentGatewayTypes.Count > 0)
                                {
                                    foreach (PaymentGatewayTypes _data in _response.PaymentGatewayTypes)
                                    {
                                        _sqlQuery.Append("INSERT INTO payment_gateway_types(");
                                        _sqlQuery.Append("id");
                                        _sqlQuery.Append(",name");
                                        _sqlQuery.Append(",code");
                                        _sqlQuery.Append(",description");
                                        _sqlQuery.Append(",info_table_name");
                                        _sqlQuery.Append(",status");
                                        _sqlQuery.Append(",request_table_name");
                                        _sqlQuery.Append(",response_table_name");
                                        _sqlQuery.Append(",online_payment)");
                                        _sqlQuery.Append("VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.Id) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Name) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Code) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Description) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.InfoTableName) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Status) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.RequestTableName) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ResponseTableName) + "'");
                                        _sqlQuery.Append("," + _data.OnlinePayment + ");");

                                    }
                                }

                                if (_response.RegistrationToPaymentGateways != null && _response.RegistrationToPaymentGateways.Count > 0)
                                {
                                    foreach (RegistrationToPaymentGateways _data in _response.RegistrationToPaymentGateways)
                                    {
                                        _sqlQuery.Append("INSERT INTO registration_to_payment_gateways(");
                                        _sqlQuery.Append("id");
                                        _sqlQuery.Append(",registration_guid");
                                        _sqlQuery.Append(",payment_gateway_type_id");
                                        _sqlQuery.Append(",code");
                                        _sqlQuery.Append(",name");
                                        _sqlQuery.Append(",payment_gateway_environment_id");
                                        _sqlQuery.Append(",production_gateway");
                                        _sqlQuery.Append(",primary_gateway");
                                        _sqlQuery.Append(",status_guid");
                                        _sqlQuery.Append(",gateway_no)");
                                        _sqlQuery.Append("VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.Id) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.RegistrationGuid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.PaymentGatewayTypeId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Code) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Name) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.PaymentGatewayEnvironmentId) + "'");
                                        _sqlQuery.Append("," + Sanitization.Sanitize(_data.ProductionGateway));
                                        _sqlQuery.Append("," + Sanitization.Sanitize(_data.PrimaryGateway));
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.StatusGuid) + "'");
                                        _sqlQuery.Append("," + _data.GatewayNo + ");");
                                    }
                                }

                                if (_response.PaymentGatewayPaytm != null && _response.PaymentGatewayPaytm.Count > 0)
                                {
                                    foreach (PaymentGatewayPaytm _data in _response.PaymentGatewayPaytm)
                                    {
                                        _sqlQuery.Append("INSERT INTO payment_gateway_paytm(");
                                        _sqlQuery.Append("registration_pay_gateway_id");
                                        _sqlQuery.Append(",mid");
                                        _sqlQuery.Append(",merchant_key");
                                        _sqlQuery.Append(",channel_id");
                                        _sqlQuery.Append(",bank_name");
                                        _sqlQuery.Append(",return_url");
                                        _sqlQuery.Append(",paytm_url");
                                        _sqlQuery.Append(",app_url");
                                        _sqlQuery.Append(",web_site");
                                        _sqlQuery.Append(",industry_type");
                                        _sqlQuery.Append(",status)");
                                        _sqlQuery.Append("VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.RegistrationPayGatewayId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.Mid) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.MerchantKey) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ChannelId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.BankName) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ReturnUrl) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.PaytmUrl) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.AppUrl) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.WebSite) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.IndustryType) + "'");
                                        _sqlQuery.Append("," + _data.Status + ");");
                                    }
                                }

                                if (_response.PaymentGatewayPayUMoney != null && _response.PaymentGatewayPayUMoney.Count > 0)
                                {
                                    foreach (PaymentGatewayPayUMoney _data in _response.PaymentGatewayPayUMoney)
                                    {
                                        _sqlQuery.Append("INSERT INTO payment_gateway_payumoney(");
                                        _sqlQuery.Append("registration_pay_gateway_id");
                                        _sqlQuery.Append(",pay_gateway_environment_id");
                                        _sqlQuery.Append(",merchant_key");
                                        _sqlQuery.Append(",merchant_salt");
                                        _sqlQuery.Append(",auth_header");
                                        _sqlQuery.Append(",return_url");
                                        _sqlQuery.Append(",payment_url");
                                        _sqlQuery.Append(",status)");
                                        _sqlQuery.Append("VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.RegistrationPayGatewayId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.PaymentGatewayEnvironmentId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.MerchantKey) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.MerchantSalt) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.AuthHeader) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ReturnUrl) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.PaymentUrl) + "'");
                                        _sqlQuery.Append("," + Sanitization.Sanitize(_data.Status) + ");");
                                    }
                                }

                                if (_response.PaymentGatewayRazorpay != null && _response.PaymentGatewayRazorpay.Count > 0)
                                {
                                    foreach (PaymentGatewayRazorPay _data in _response.PaymentGatewayRazorpay)
                                    {
                                        _sqlQuery.Append("INSERT INTO payment_gateway_razorpay(");
                                        _sqlQuery.Append("registration_pay_gateway_id");
                                        _sqlQuery.Append(",pay_gateway_environment_id");
                                        _sqlQuery.Append(",key_id");
                                        _sqlQuery.Append(",key_secret");
                                        _sqlQuery.Append(",bank_name");
                                        _sqlQuery.Append(",return_url");
                                        _sqlQuery.Append(",status)");
                                        _sqlQuery.Append("VALUES(");
                                        _sqlQuery.Append("'" + Sanitization.Sanitize(_data.RegistrationPayGatewayId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.PayGatewayEnvironmentId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.KeyId) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.KeySecret) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.BankName) + "'");
                                        _sqlQuery.Append(",'" + Sanitization.Sanitize(_data.ReturnUrl) + "'");
                                        _sqlQuery.Append("," + Sanitization.Sanitize(_data.Status) + ");");
                                    }
                                }

                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _rowsAffected = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());
                                if (_rowsAffected <= 0)
                                    _success = false;
                            }
                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RegistrationExportSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(ApplicationConstants.GenericMessages.ErrorInSavingRecord, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.SystemError(exTran.Message, _methodName);
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, exTran.Message);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    //ERROR
                    try
                    {
                        _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, exTran.Message);
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection?.Close();
                        _mySqlConnection = null;
                    }
                    _mytransaction?.Dispose();
                    _mytransaction = null;
                    _mySqlCommand = null;
                    _mySqlConnection = null;
                    _sqlQuery = null;
                    _sqlConnectionString = string.Empty;
                }
            }
            return (_jsonReturn, _functionReturn);
        }
    }
}