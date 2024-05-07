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
using static IXCheckCandidateApi.Globals.ApplicationConstants;
using Microsoft.Extensions.Configuration;
using IXCheckCandidateApi.Models.Interfaces;
using IXCheckCommonLib.Models.Paging;
using IXCheckCandidateApi.AppValidations;
using Newtonsoft.Json;
using IXCheckCommonLib.Security;
using Microsoft.Extensions.Hosting;
using IxcheckRegApi.Models;
using static IXCheckCandidateApi.Globals.ApplicationEnumeration;
using IXCheckCommonLib.AppFunctions;
using Microsoft.AspNetCore.Hosting;

namespace IXCheckCandidateApi.AppFunctions
{
    public class RegistrationFunctions : IRegistrationFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly IDatabaseFunctions _databaseFunctions;
        private readonly ILoggerFunctions _loggerFunctions;
        private readonly IApiSettings _apiSettings;
        private readonly IStats _stats;
        private readonly IHttpClientFunctions _httpClientFunctions;
        private readonly IEmailFunctions _emailFunctions;
        private readonly IConfiguration _configuration;
        private readonly ISharedFunctions _sharedFunctions;
        private IWebHostEnvironment _env { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__databaseSettings"></param>
        /// <param name="__jwtIssuerOptions"></param>
        public RegistrationFunctions(IDatabaseSettings __databaseSettings, IEmailFunctions __emailFunctions, IHttpClientFunctions __httpClientFunctions, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration, IWebHostEnvironment __env, ISharedFunctions __sharedFunctions)
        {
            _databaseSettings = __databaseSettings;
            _sharedFunctions = __sharedFunctions;
            _loggerFunctions = __loggerFunctions;
            _apiSettings = __apiSettings;
            _databaseFunctions = __databaseFunctions;
            _emailFunctions = __emailFunctions;
            _stats = __stats;
            _httpClientFunctions = __httpClientFunctions;
            _configuration = __configuration;
            _env = __env;
        }


        /// <summary>
        /// Add Layout Json
        /// </summary>
        /// <param name="_templateForm"></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddLayoutJson(TemplateForm _templateForm)
        {
            #region Local Variables
            string _methodName = "F:Reg:AddLayoutJson";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            int _rowsAffected = 0;
            bool _success = true;
            UInt64 _layout_id = 0;
            string _layout_guid = "";
            string _layout_name = "";
            string _layout_description = "";
            string _layout_code = "";
            string _layout_exam_type = "";
            string _layout_page_name = "";
            string _layout_exam_type_guid = "";
            string _layout_number = "";
            string _layout_type_guid = "";
            string _layout_type = "";
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
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DataSet _dataSet = null;
            TimeSpan? _queryTime = null;
            string _status_guid = "";
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
            #endregion

            #region Input Sanitization and Validation

            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_templateForm == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.FormDataRequired; ;
                }
                else
                {
                    //Sanitize Input
                    _layout_id = Convert.ToUInt64(Sanitization.Sanitize(_templateForm.Form.LayoutId.ToString()));
                    _layout_guid = Sanitization.Sanitize(_templateForm.Form.LayoutGuid);
                    _layout_name = Sanitization.Sanitize(_templateForm.Form.LayoutName);
                    _layout_description = Sanitization.Sanitize(_templateForm.Form.LayoutDescription);
                    _layout_code = Sanitization.Sanitize(_templateForm.Form.LayoutCode);
                    _layout_exam_type = Sanitization.Sanitize(_templateForm.Form.LayoutExamType);
                    _layout_exam_type_guid = Sanitization.Sanitize(_templateForm.Form.LayoutExamTypeGuid);
                    _layout_page_name = Sanitization.Sanitize(_templateForm.Form.LayoutPageName);
                    _layout_number = Sanitization.Sanitize(_templateForm.Form.LayoutNumber);
                    _layout_type = Sanitization.Sanitize(_templateForm.Form.LayoutType);
                    _layout_type_guid = Sanitization.Sanitize(_templateForm.Form.LayoutTypeGuid);

                    //form error
                    if (string.IsNullOrEmpty(_layout_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutNameRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_exam_type_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.ExamTypeGuidRequired;
                    }

                    if (string.IsNullOrEmpty(_layout_type_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutTypeRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_type))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutTypeRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_name))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutNameRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_exam_type_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutTypeRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_description))
                    {
                        //_errorMessage = ApplicationConstants.ValidationMessages.LayoutDescriptionRequired;
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
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
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

                            #region Add Tab

                            _sqlQuery.Clear();
                            _sqlQuery.Append("INSERT INTO `layout_main` ( ");
                            _sqlQuery.Append("`layout_guid`");
                            _sqlQuery.Append(",`name`");
                            _sqlQuery.Append(",`description`");
                            _sqlQuery.Append(",`code`");
                            _sqlQuery.Append(",`exam_type`");
                            _sqlQuery.Append(",`exam_type_guid`");
                            _sqlQuery.Append(",`layout_type_guid`");
                            _sqlQuery.Append(",`page_name`");
                            _sqlQuery.Append(",`number`");
                            _sqlQuery.Append(",`status`");
                            _sqlQuery.Append(" ) VALUES ( ");
                            _sqlQuery.Append("'" + _layout_guid + "'");
                            _sqlQuery.Append(",'" + _layout_name + "'");
                            _sqlQuery.Append(",'" + _layout_description + "'");
                            _sqlQuery.Append(",'" + _layout_code + "'");
                            _sqlQuery.Append(",'" + _layout_exam_type + "'");
                            _sqlQuery.Append(",'" + _layout_exam_type_guid + "'");
                            _sqlQuery.Append(",'" + _layout_type_guid + "'");
                            _sqlQuery.Append(",'" + _layout_page_name + "'");
                            _sqlQuery.Append(",'" + _layout_number + "'");
                            _sqlQuery.Append(",'1'");
                            _sqlQuery.Append(" ); ");
                            _sqlQuery.Append("select LAST_INSERT_ID();");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _layout_id = (UInt64)_mySqlCommand.ExecuteScalar();

                            if (_layout_id <= 0)
                            {
                                _success = false;
                            }

                            if (_templateForm.Form.Pages.Count <= 0)
                            {
                                _success = false;
                            }
                            // start page
                            if (_success)
                            {
                                try
                                {
                                    // start page loop
                                    foreach (var pageItem in _templateForm.Form.Pages)
                                    {
                                        if (_success)
                                        {
                                            //Sanitize Input                                   
                                            _page_name = Sanitization.Sanitize(pageItem.PageName);
                                            _page_guid = Sanitization.Sanitize(pageItem.PageGuid);
                                            _page_description = Sanitization.Sanitize(pageItem.PageDescription);

                                            //page error
                                            if (string.IsNullOrEmpty(_page_guid))
                                            {
                                                _errorMessage = ApplicationConstants.ValidationMessages.PageGuidRequired;
                                            }
                                            else if (string.IsNullOrEmpty(_page_description))
                                            {
                                                //_errorMessage = ApplicationConstants.ValidationMessages.PageDescriptionRequired;
                                            }

                                            if (!string.IsNullOrEmpty(_errorMessage))
                                            {
                                                _success = false;
                                            }
                                            else
                                            {
                                                _sqlQuery.Clear();
                                                _sqlQuery.Append("INSERT INTO `pages_main` ( ");
                                                _sqlQuery.Append("`page_guid`");
                                                _sqlQuery.Append(",`form_id`");
                                                _sqlQuery.Append(",`code`");
                                                _sqlQuery.Append(",`description`");
                                                _sqlQuery.Append(",`status`");
                                                _sqlQuery.Append(" ) VALUES ( ");
                                                _sqlQuery.Append("'" + _page_guid + "'");
                                                _sqlQuery.Append("," + _layout_id + "");
                                                _sqlQuery.Append(",'" + _page_name + "'");
                                                _sqlQuery.Append(",'" + _page_description + "'");
                                                _sqlQuery.Append(",'1'");
                                                _sqlQuery.Append(" ); ");
                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                _page_id = (UInt64)_mySqlCommand.ExecuteScalar();

                                                if (_page_id <= 0)
                                                {
                                                    _success = false;
                                                }
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
                                                            //Sanitize Input                                   
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
                                                            {
                                                                _success = false;
                                                            }
                                                            else
                                                            {
                                                                _sqlQuery.Clear();
                                                                _sqlQuery.Append("INSERT INTO `section_main` ( ");
                                                                _sqlQuery.Append("`section_guid`");
                                                                _sqlQuery.Append(",`page_id`");
                                                                _sqlQuery.Append(",`code`");
                                                                _sqlQuery.Append(",`description`");
                                                                _sqlQuery.Append(",`status`");
                                                                _sqlQuery.Append(",`visibility`");
                                                                _sqlQuery.Append(",`css_class`");
                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                _sqlQuery.Append("'" + _section_guid + "'");
                                                                _sqlQuery.Append("," + _page_id + "");
                                                                _sqlQuery.Append(",'" + _section_name + "'");
                                                                _sqlQuery.Append(",'" + _section_description + "'");
                                                                _sqlQuery.Append(",'1'");
                                                                _sqlQuery.Append(",'" + _section_visibility + "'");
                                                                _sqlQuery.Append(",'" + _section_css_class + "'");
                                                                _sqlQuery.Append(" ); ");
                                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                _section_id = (UInt64)_mySqlCommand.ExecuteScalar();

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
                                                                                _sqlQuery.Append("`section_id`");
                                                                                _sqlQuery.Append(",`component_guid`");
                                                                                _sqlQuery.Append(",`name`");
                                                                                _sqlQuery.Append(",`cols`");
                                                                                _sqlQuery.Append(",`rows`");
                                                                                _sqlQuery.Append(",`x`");
                                                                                _sqlQuery.Append(",`y`");
                                                                                _sqlQuery.Append(",`status`");
                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                _sqlQuery.Append("" + _section_id + "");
                                                                                _sqlQuery.Append(",'" + _comp_guid + "'");
                                                                                _sqlQuery.Append(",'" + _comp_name + "'");
                                                                                _sqlQuery.Append(",'" + _comp_cols + "'");
                                                                                _sqlQuery.Append(",'" + _comp_rows + "'");
                                                                                _sqlQuery.Append(",'" + _comp_x + "'");
                                                                                _sqlQuery.Append(",'" + _comp_y + "'");
                                                                                _sqlQuery.Append(",'1'");
                                                                                _sqlQuery.Append(" ); ");
                                                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                _comp_id = (UInt64)_mySqlCommand.ExecuteScalar();

                                                                                if (_comp_id <= 0)
                                                                                {
                                                                                    _success = false;
                                                                                }

                                                                                if (_success)
                                                                                {
                                                                                    // Start Insert in Setting main
                                                                                    if (componentItem.Setting != null)
                                                                                    {
                                                                                        //Sanitize Input                                                                                  
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
                                                                                        {
                                                                                            _success = false;
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            _sqlQuery.Clear();
                                                                                            _sqlQuery.Append("INSERT INTO `settings_main` ( ");
                                                                                            _sqlQuery.Append("`component_id`");
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
                                                                                            _sqlQuery.Append(" ) VALUES ( ");
                                                                                            _sqlQuery.Append("" + _comp_id + "");
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
                                                                                            _sqlQuery.Append(" ); ");
                                                                                            _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                            _setting_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                        }
                                                                                    }
                                                                                    // End Insert in Setting main

                                                                                    // Start Insert in validation main
                                                                                    if (componentItem.Validations != null && _setting_type != "button")
                                                                                    {
                                                                                        //Sanitize Input 
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
                                                                                        {
                                                                                            _success = false;
                                                                                        }
                                                                                        else
                                                                                        {

                                                                                            _sqlQuery.Clear();
                                                                                            _sqlQuery.Append("INSERT INTO `validations_main` ( ");
                                                                                            _sqlQuery.Append("`component_id`");
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
                                                                                            _sqlQuery.Append("" + _comp_id + "");
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

                                                                                            if (!string.IsNullOrEmpty(_valid_mindate) && ValidationFunctions.IsValidDate(_valid_mindate) == true)
                                                                                            {
                                                                                                _sqlQuery.Append(",'" + _valid_mindate + "'");
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Append(",null");

                                                                                            }
                                                                                            if (!string.IsNullOrEmpty(_valid_maxdate) && ValidationFunctions.IsValidDate(_valid_maxdate) == true)
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
                                                                                            {
                                                                                                _sqlQuery.Append(",null");

                                                                                            }
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
                                                                                            {
                                                                                                _sqlQuery.Append(",null");

                                                                                            }




                                                                                            if (!string.IsNullOrEmpty(_valid_allowed_file_count))
                                                                                            {
                                                                                                _sqlQuery.Append(",'" + _valid_allowed_file_count + "'");
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Append(",null");

                                                                                            }
                                                                                            _sqlQuery.Append(" ); ");
                                                                                            _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                            _valid_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                        }
                                                                                    }
                                                                                    /// End Insert in validation main

                                                                                    // Insert in data_object
                                                                                    if (componentItem.DataObjects != null)
                                                                                    {
                                                                                        //Sanitize Input 
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
                                                                                        {
                                                                                            _success = false;
                                                                                        }
                                                                                        else
                                                                                        {

                                                                                            _sqlQuery.Clear();
                                                                                            _sqlQuery.Append("INSERT INTO `data_object` ( ");
                                                                                            _sqlQuery.Append("`component_id`");
                                                                                            _sqlQuery.Append(",`end_point`");
                                                                                            _sqlQuery.Append(",`text_field`");
                                                                                            _sqlQuery.Append(",`value_field`");
                                                                                            _sqlQuery.Append(",`status`");
                                                                                            _sqlQuery.Append(" ) VALUES ( ");
                                                                                            _sqlQuery.Append("" + _comp_id + "");
                                                                                            _sqlQuery.Append(",'" + _dataobject_endpoint + "'");
                                                                                            _sqlQuery.Append(",'" + _dataobject_textfield + "'");
                                                                                            _sqlQuery.Append(",'" + _dataobject_valuefield + "'");
                                                                                            _sqlQuery.Append(",'1'");
                                                                                            _sqlQuery.Append(" ); ");
                                                                                            _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                            _dataobject_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                        }

                                                                                    }
                                                                                    // End Insert in data object

                                                                                    // Insert in condition

                                                                                    if (componentItem.Conditions != null)
                                                                                    {
                                                                                        //Sanitize Input 
                                                                                        _condition_conditional = Sanitization.Sanitize(componentItem.Conditions.ConditionConditional);
                                                                                        _condition_eventType = Sanitization.Sanitize(componentItem.Conditions.ConditionEventType);
                                                                                        _condition_changeType = Sanitization.Sanitize(componentItem.Conditions.ConditionChangeType);
                                                                                        _condition_componentToChange = Sanitization.Sanitize(componentItem.Conditions.ConditionComponentToChange);
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
                                                                                        {
                                                                                            _success = false;
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            _sqlQuery.Clear();
                                                                                            _sqlQuery.Append("INSERT INTO `condition_main` ( ");
                                                                                            _sqlQuery.Append("`component_id`");
                                                                                            _sqlQuery.Append(",`condition_component_id`");
                                                                                            _sqlQuery.Append(",`conditional`");
                                                                                            _sqlQuery.Append(",`status`");
                                                                                            _sqlQuery.Append(",`eventType`");
                                                                                            _sqlQuery.Append(",`changeType`");
                                                                                            _sqlQuery.Append(",`componentToChange`");
                                                                                            _sqlQuery.Append(" ) VALUES ( ");
                                                                                            _sqlQuery.Append("" + _comp_id + "");
                                                                                            _sqlQuery.Append(",'" + _comp_guid + "'");
                                                                                            _sqlQuery.Append(",'" + _condition_conditional + "'");
                                                                                            _sqlQuery.Append(",'1'");
                                                                                            _sqlQuery.Append(",'" + _condition_eventType + "'");
                                                                                            _sqlQuery.Append(",'" + _condition_changeType + "'");
                                                                                            _sqlQuery.Append(",'" + _condition_componentToChange + "'");
                                                                                            _sqlQuery.Append(" ); ");
                                                                                            _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                            _condition_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                        }

                                                                                    }
                                                                                    // End Insert in condition

                                                                                }
                                                                            }
                                                                        }
                                                                        else
                                                                        {
                                                                            break;
                                                                        }
                                                                    }
                                                                    // end component loop
                                                                }
                                                                // end component

                                                            }
                                                        }
                                                        else
                                                        {
                                                            break;
                                                        }
                                                    }
                                                    // end section loop
                                                }
                                                // end section
                                            }
                                        }
                                        else
                                        {
                                            break;
                                        }
                                    }
                                    // end page loop
                                    // update form json
                                    if (_success)
                                    {
                                        (_jsonReturn, _functionReturn) = GenerateLayoutJsonById(_layout_id);
                                        if (_functionReturn.Status == false)
                                        {
                                            _success = false;

                                        }
                                        else
                                        {
                                            _sqlQuery.Clear();
                                            _sqlQuery.Append("select status_guid from reg_plan_status ");
                                            _sqlQuery.Append("where code = 'Pending';");

                                            (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                                            DataRow row = _dataSet.Tables[0].Rows[0];
                                            _status_guid = row["status_guid"] == DBNull.Value ? "" : Convert.ToString(row["status_guid"]);

                                            string _client_name = "test";
                                            _layout_number = "Layout_Number_" + _layout_id.ToString();
                                            _sqlQuery.Clear();
                                            _sqlQuery.Append("UPDATE `layout_main` SET ");
                                            _sqlQuery.Append("`client_name` = '" + _client_name + "'");
                                            _sqlQuery.Append(",`layout_json` = '" + _jsonReturn + "'");
                                            _sqlQuery.Append(",`number` = '" + _layout_number + "'");
                                            _sqlQuery.Append(",`status_guid` = '" + _status_guid + "'");
                                            //_sqlQuery.Append(",`status` = " + status + "");
                                            //_sqlQuery.Append(",`datetimestamp` = UTC_TIMESTAMP ");
                                            _sqlQuery.Append(" WHERE id = " + _layout_id + "");
                                            _sqlQuery.Append(";");

                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                            if (_rowsAffected <= 0)
                                            {
                                                _success = false;
                                            }
                                        }
                                    }
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

                            if (_layout_type != "initiallayout")
                            {
                                if (_manTitle == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.TitleRequired;
                                }
                                if (_manFirstName == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.FirstNameRequired;
                                }
                                if (_manFatherName == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.FatherNameRequired;
                                }
                                if (_manDateOfBirth == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.DateOfBirthRequired;
                                }
                                if (_manMobile == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.TitleRequired;
                                }
                                if (_manEmail == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.EmailRequired;
                                }
                                if (_manPhoto == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.PhotoRequired;
                                }
                                if (_manSign == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.SignatureRequired;
                                }
                                if (_manGender == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.GenderRequired;
                                }
                                if (_manPH == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.PhysicalDisabilityRequired;
                                }
                                if (_manCityPrefrence1 == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.CityPriority1Required;
                                }

                                if (!_manSuccess)
                                {
                                    _success = false;
                                }
                            }

                            if (_success)
                            {
                                _mytransaction.Commit();
                                _functionReturn.Status = true;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                                //_functionReturn.Message.Clear();

                                //_functionReturn.Message.Add(Constants.GenericMessages.RecordSavedSuccessfully);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordSavedSuccessfully, _methodName);
                            }
                            else
                            {
                                _mytransaction.Rollback();
                                //No Data // Need to send blank JSON object instead of error
                                //_functionReturn.Status = false;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                                //_functionReturn.Message.Add(Constants.GenericMessages.ErrorInSavingRecord);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                            }
                            //Cleanup
                            _mySqlCommand.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction.Rollback();
                                _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                                //_functionReturn.Status = false;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                                //_functionReturn.Message.Add(ex.Message);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
                                //_functionReturn.Status = false;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                                //_functionReturn.Message.Add(exTran.Message);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
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
                        //_functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(ex.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
                        //_functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(exTran.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, exTran.Message);
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mytransaction.Dispose();
                    _mytransaction = null;
                    _mySqlCommand = null;
                    _mySqlConnection = null;
                    _sqlQuery = null;
                    _sqlConnectionString = string.Empty;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Add Layout Json Async
        /// </summary>
        /// <param name="_templateForm"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddLayoutJsonAsync(TemplateForm _templateForm)
        {
            return Task.Run(() => AddLayoutJson(_templateForm));
        }

        /// <summary>
        /// Generate Layout Json By Id
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GenerateLayoutJsonById(UInt64 _id)
        {
            #region Local Variables
            string _methodName = "F:Reg:GetLayoutJson";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            int _randamNumber = 0;
            //JSON data
            DataTable _dataTable = null;
            DataTable _dataTablePage = null;
            DataTable _dataTableSection = null;
            DataTable _dataTableComps = null;
            DataTable _dataTableSettings = null;
            DataTable _dataTableData = null;
            DataTable _dataTableData_object = null;
            DataTable _dataTableValidations = null;
            DataTable _dataTableCondition = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            UInt64 _layout_id = 0;
            string _layout_guid = "";
            string _layout_name = "";
            string _layout_description = "";
            string _layout_code = "";
            string _layout_exam_type = "";
            string _layout_page_name = "";
            string _layout_exam_type_guid = "";
            string _layout_status = "";
            string _layout_number = "";
            UInt64 _page_id = 0;
            string _page_guid = "";
            string _page_name = "";
            string _page_description = "";
            string _page_status = "";
            UInt64 _section_id = 0;
            string _section_guid = "";
            string _section_name = "";
            string _section_description = "";
            string _section_status = "";
            string _section_visibility = "";
            string _section_css_class = "";
            string _layout_type_guid = "";
            UInt64 _comp_id = 0;
            string _comp_guid = "";
            string _comp_name = "";
            UInt64 _comp_cols = 0;
            UInt64 _comp_rows = 0;
            UInt64 _comp_x = 0;
            UInt64 _comp_y = 0;
            string _comp_status = "";
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
            bool _setting_allowTextUppercase = false;
            string _setting_status = "";
            bool _setting_showingrid = false;
            UInt64 _data_id = 0;
            string _data_value = "";
            string _data_status = "";
            UInt64 _dataobject_id = 0;
            string _dataobject_endpoint = "";
            string _dataobject_textfield = "";
            string _dataobject_valuefield = "";
            string _dataobject_status = "";
            UInt64 _valid_id = 0;
            bool _valid_required = false;
            UInt64? _valid_maxlength;
            UInt64? _valid_minlength;
            string _valid_regex = "";
            string _valid_errormessage = "";
            string _valid_mindate = "";
            string _valid_maxdate = "";
            string _valid_status = "";
            bool _valid_unique = false;
            string _valid_uniqueURL = "";
            string _valid_allowed_extentions = "";
            UInt64? _valid_allowed_size;
            UInt64? _valid_maxwidth;
            UInt64? _valid_minwidth;
            UInt64? _valid_maxheight;
            UInt64? _valid_minheight;
            UInt64? _valid_allowed_file_count;
            bool _valid_otp_varification = false;
            UInt64 _condition_id = 0;
            string _condition_componentid = "";
            string _condition_componentguid = "";
            string _condition_conditional = "";
            string _condition_status = "";
            string _condition_eventType = "";
            string _condition_changeType = "";
            string _condition_componentToChange = "";
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

                    _sqlQuery.Append("SELECT id, layout_guid, name, description, status, layout_json, " +
                     "code, exam_type, exam_type_guid, page_name, number, layout_type_guid ");
                    _sqlQuery.Append(" from layout_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" id = " + _id.ToString() + " and status = 1 ");
                    _sqlQuery.Append(" order by id; ");

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

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Layout);
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
                                    _layout_id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                                    _layout_guid = row["layout_guid"] == DBNull.Value ? "" : Convert.ToString(row["layout_guid"]);
                                    _layout_name = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);
                                    _layout_description = row["description"] == DBNull.Value ? "" : Convert.ToString(row["description"]);
                                    _layout_status = row["status"] == DBNull.Value ? "" : Convert.ToString(row["status"]);
                                    _layout_code = row["code"] == DBNull.Value ? "" : Convert.ToString(row["code"]);
                                    _layout_exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_type"]);
                                    _layout_exam_type_guid = row["exam_type_guid"] == DBNull.Value ? "" : Convert.ToString(row["exam_type_guid"]);
                                    _layout_page_name = row["page_name"] == DBNull.Value ? "" : Convert.ToString(row["page_name"]);
                                    _layout_number = row["number"] == DBNull.Value ? "" : Convert.ToString(row["number"]);

                                    _layout_type_guid = row["layout_type_guid"] == DBNull.Value ? "" : Convert.ToString(row["layout_type_guid"]);

                                    _writer.WriteStartObject();

                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutId, _layout_id.ToString());
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutGuid, _layout_guid);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutName, _layout_name);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutDescription, _layout_description);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutCode, _layout_code);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutExamType, _layout_exam_type);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutExamTypeGuid, _layout_exam_type_guid);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutPageName, _layout_page_name);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutNumber, _layout_number);
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutTypeGuid, _layout_type_guid);

                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.LayoutStatus, _layout_status);

                                    // Start Page Json
                                    _writer.WriteStartArray(ApplicationJsonReturnConstants.PropertyNames.Pages);
                                    _sqlQuery = new StringBuilder();
                                    _sqlQuery.Append(" select id, page_guid, code, description,status ");
                                    _sqlQuery.Append(" from pages_main ");
                                    _sqlQuery.Append(" WHERE ");
                                    _sqlQuery.Append(" form_id =" + _layout_id.ToString() + " and status = 1 ");
                                    _sqlQuery.Append(" order by id; ");

                                    //Call Function
                                    (_functionReturn, _dataTablePage, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                    if (_dataTablePage.Rows.Count <= 0)
                                    {
                                        _writer.WriteStartObject();
                                        _writer.WriteEndObject();
                                    }
                                    else
                                    {
                                        foreach (DataRow rowpage in _dataTablePage.Rows)
                                        {
                                            //check NULLS and DATA TYPE here for returned column values
                                            _page_id = rowpage["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowpage["id"]);
                                            _page_guid = rowpage["page_guid"] == DBNull.Value ? "" : Convert.ToString(rowpage["page_guid"]);
                                            _page_name = rowpage["code"] == DBNull.Value ? "" : Convert.ToString(rowpage["code"]);
                                            _page_description = rowpage["description"] == DBNull.Value ? "" : Convert.ToString(rowpage["description"]);
                                            _page_status = rowpage["status"] == DBNull.Value ? "" : Convert.ToString(rowpage["status"]);

                                            _writer.WriteStartObject();

                                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.PageId, _page_id.ToString());
                                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.PageGuid, _page_guid);
                                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.PageName, _page_name);
                                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.PageDescription, _page_description);
                                            //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.PageStatus, _page_status);

                                            // Start Section Json

                                            _writer.WriteStartArray(ApplicationJsonReturnConstants.PropertyNames.Sections);
                                            //_writer.WriteStartArray();

                                            _sqlQuery.Clear();
                                            _sqlQuery.Append("SELECT id, section_guid, code, description,status,visibility,css_class ");
                                            _sqlQuery.Append(" from section_main ");
                                            _sqlQuery.Append(" WHERE ");
                                            _sqlQuery.Append(" page_id = " + _page_id.ToString() + " and status = 1 ");
                                            _sqlQuery.Append(" order by page_id; ");

                                            //Call Function
                                            (_functionReturn, _dataTableSection, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                            if (_dataTableSection.Rows.Count <= 0)
                                            {
                                                _writer.WriteStartObject();
                                                _writer.WriteEndObject();
                                            }
                                            else
                                            {
                                                foreach (DataRow rowsection in _dataTableSection.Rows)
                                                {
                                                    //check NULLS and DATA TYPE here for returned column values
                                                    _section_id = rowsection["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowsection["id"]);
                                                    _section_guid = rowsection["section_guid"] == DBNull.Value ? "" : Convert.ToString(rowsection["section_guid"]);
                                                    _section_name = rowsection["code"] == DBNull.Value ? "" : Convert.ToString(rowsection["code"]);
                                                    _section_description = rowsection["description"] == DBNull.Value ? "" : Convert.ToString(rowsection["description"]);
                                                    _section_status = rowsection["status"] == DBNull.Value ? "" : Convert.ToString(rowsection["status"]);
                                                    _section_visibility = rowsection["visibility"] == DBNull.Value ? "" : Convert.ToString(rowsection["visibility"]);
                                                    _section_css_class = rowsection["css_class"] == DBNull.Value ? "" : Convert.ToString(rowsection["css_class"]);
                                                    _writer.WriteStartObject();

                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SectionId, _section_id.ToString());
                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SectionGuid, _section_guid);
                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SectionName, _section_name);
                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SectionDescription, _section_description);
                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SectionVisibility, _section_visibility);
                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SectionCssClass, _section_css_class);
                                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SectionStatus, _section_status);

                                                    // Start Component Json

                                                    _writer.WriteStartArray(ApplicationJsonReturnConstants.PropertyNames.Components);

                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append(" select id, component_guid, cols, `rows`, x, y, name, status ");
                                                    _sqlQuery.Append(" from components_main ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" section_id = " + _section_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" order by  y, (x*y); ");

                                                    //Call Function
                                                    (_functionReturn, _dataTableComps, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableComps.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesComp in _dataTableComps.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _comp_id = rowtablesComp["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["id"]);
                                                            _comp_guid = rowtablesComp["component_guid"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["component_guid"]);
                                                            _comp_name = rowtablesComp["name"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["name"]);
                                                            _comp_cols = rowtablesComp["cols"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["cols"]);
                                                            _comp_rows = rowtablesComp["rows"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["rows"]);
                                                            _comp_x = rowtablesComp["x"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["x"]);
                                                            _comp_y = rowtablesComp["y"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["y"]);
                                                            _comp_status = rowtablesComp["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["status"]);

                                                            _writer.WriteStartObject();

                                                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ComponentId, _comp_id.ToString());
                                                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ComponentGuid, _comp_guid);
                                                            _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ComponentName, _comp_name);
                                                            _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ComponentCols, _comp_cols);
                                                            _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ComponentRows, _comp_rows);
                                                            _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ComponentX, _comp_x);
                                                            _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ComponentY, _comp_y);
                                                            //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ComponentStatus, _comp_status);

                                                            // Start Setting Json

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Settings);

                                                            _sqlQuery.Clear();
                                                            _sqlQuery.Append(" select id, measurementType, height, width, labelposition, type, label, description, " +
                                                                "input, placeholder, endPoint, defaultValue, status, dataParameter, showingrid,allowTextUppercase  ");
                                                            _sqlQuery.Append(" from settings_main ");
                                                            _sqlQuery.Append(" WHERE ");
                                                            _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                            _sqlQuery.Append(" order by id;");

                                                            //Call Function
                                                            (_functionReturn, _dataTableSettings, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                            if (_dataTableSettings.Rows.Count <= 0)
                                                            {
                                                                _writer.WriteStartObject();
                                                                _writer.WriteEndObject();
                                                            }
                                                            else
                                                            {
                                                                foreach (DataRow rowtablesSetting in _dataTableSettings.Rows)
                                                                {
                                                                    //check NULLS and DATA TYPE here for returned column values
                                                                    _setting_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                                    _setting_measurementType = rowtablesSetting["measurementType"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["measurementType"]);
                                                                    _setting_height = rowtablesSetting["height"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["height"]);
                                                                    _setting_width = rowtablesSetting["width"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["width"]);
                                                                    _setting_labelposition = rowtablesSetting["labelposition"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["labelposition"]);
                                                                    _setting_type = rowtablesSetting["type"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["type"]);
                                                                    _setting_label = rowtablesSetting["label"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["label"]);
                                                                    _setting_description = rowtablesSetting["description"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["description"]);
                                                                    _setting_input = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                                    _setting_placeholder = rowtablesSetting["placeholder"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["placeholder"]);
                                                                    _setting_endpoint = rowtablesSetting["endPoint"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["endPoint"]);
                                                                    _setting_defaultValue = rowtablesSetting["defaultValue"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["defaultValue"]);
                                                                    _setting_status = rowtablesSetting["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["status"]);
                                                                    _setting_dataParameter = rowtablesSetting["dataParameter"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataParameter"]);
                                                                    _setting_showingrid = rowtablesSetting["showingrid"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["showingrid"]);

                                                                    _setting_allowTextUppercase = rowtablesSetting["allowTextUppercase"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["allowTextUppercase"]);


                                                                    _writer.WriteStartObject();

                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingId, _setting_id.ToString());
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingMeasurementType, _setting_measurementType);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingHeight, _setting_height);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingWidth, _setting_width);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingLabelposition, _setting_labelposition);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingType, _setting_type);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingLabel, _setting_label);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingDescription, _setting_description);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingInput, _setting_input);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingPlaceholder, _setting_placeholder);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingEndPoint, _setting_endpoint);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingDefaultValue, _setting_defaultValue);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingDataParameter, _setting_dataParameter);
                                                                    _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.SettingShowInGrid, _setting_showingrid);
                                                                    _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.SettingAllowTextUppercase, _setting_allowTextUppercase);
                                                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.SettingStatus, _setting_status);
                                                                    _writer.WriteEndObject();
                                                                    break;
                                                                }
                                                            }

                                                            // End Settings Json

                                                            // Start Data Json

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Data);

                                                            _sqlQuery.Clear();
                                                            _sqlQuery.Append(" select  id, data, status ");
                                                            _sqlQuery.Append(" from data_main ");
                                                            _sqlQuery.Append(" WHERE ");
                                                            _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                            _sqlQuery.Append(" order by id; ");

                                                            //Call Function
                                                            (_functionReturn, _dataTableData, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                            if (_dataTableData.Rows.Count <= 0)
                                                            {
                                                                _writer.WriteStartObject();
                                                                _writer.WriteEndObject();
                                                            }
                                                            else
                                                            {
                                                                foreach (DataRow rowtablesData in _dataTableData.Rows)
                                                                {
                                                                    //check NULLS and DATA TYPE here for returned column values
                                                                    _data_id = rowtablesData["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesData["id"]);
                                                                    _data_value = rowtablesData["data"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["data"]);
                                                                    _data_status = rowtablesData["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["status"]);

                                                                    _writer.WriteStartObject();

                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataId, _data_id.ToString());
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataValue, _data_value);
                                                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataStatus, _data_status);

                                                                    _writer.WriteEndObject();
                                                                    break;

                                                                }
                                                            }

                                                            // End Data Json
                                                            // Start Data_Object Json
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataObjects);

                                                            _sqlQuery.Clear();
                                                            _sqlQuery.Append(" select  id, end_point, text_field, value_field, status ");
                                                            _sqlQuery.Append(" from data_object ");
                                                            _sqlQuery.Append(" WHERE ");
                                                            _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                            _sqlQuery.Append(" order by id; ");

                                                            //Call Function
                                                            (_functionReturn, _dataTableData_object, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                            if (_dataTableData_object.Rows.Count <= 0)
                                                            {
                                                                _writer.WriteStartObject();
                                                                _writer.WriteEndObject();
                                                            }
                                                            else
                                                            {
                                                                foreach (DataRow rowtablesData_object in _dataTableData_object.Rows)
                                                                {
                                                                    //check NULLS and DATA TYPE here for returned column values
                                                                    _dataobject_id = rowtablesData_object["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesData_object["id"]);
                                                                    _dataobject_endpoint = rowtablesData_object["end_point"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["end_point"]);
                                                                    _dataobject_textfield = rowtablesData_object["text_field"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["text_field"]);
                                                                    _dataobject_valuefield = rowtablesData_object["value_field"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["value_field"]);
                                                                    _dataobject_status = rowtablesData_object["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["status"]);

                                                                    _writer.WriteStartObject();

                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataObjectId, _dataobject_id.ToString());
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataObjectEndPoint, _dataobject_endpoint);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataObjectTextField, _dataobject_textfield);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataObjectValueField, _dataobject_valuefield);
                                                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataObjectStatus, _dataobject_status);

                                                                    _writer.WriteEndObject();

                                                                    break;
                                                                }
                                                            }
                                                            // End Data_Object Json

                                                            // Start Validation Json

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Validations);


                                                            _sqlQuery.Clear();
                                                            _sqlQuery.Append(" select  id, required, maxlength, minlength, mindate, maxdate, regex , " +
                                                                "errormessage, status, isunique, uniqueURL, allowedExtentions, allowedSize, maxheight, minheight," +
                                                                "maxwidth, minwidth, allowedFileCount ,otp_varification  ");
                                                            _sqlQuery.Append(" from validations_main ");
                                                            _sqlQuery.Append(" WHERE ");
                                                            _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                            _sqlQuery.Append(" order by id; ");

                                                            //Call Function
                                                            (_functionReturn, _dataTableValidations, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                            if (_dataTableValidations.Rows.Count <= 0)
                                                            {
                                                                _writer.WriteStartObject();
                                                                _writer.WriteEndObject();

                                                            }
                                                            else
                                                            {
                                                                foreach (DataRow rowtablesValidation in _dataTableValidations.Rows)
                                                                {
                                                                    //check NULLS and DATA TYPE here for returned column values
                                                                    _valid_id = rowtablesValidation["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesValidation["id"]);
                                                                    _valid_required = rowtablesValidation["required"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["required"]);

                                                                    if (string.IsNullOrEmpty(rowtablesValidation["maxlength"].ToString()))
                                                                    {
                                                                        _valid_maxlength = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_maxlength = Convert.ToUInt64(rowtablesValidation["maxlength"]);
                                                                    }

                                                                    if (string.IsNullOrEmpty(rowtablesValidation["minlength"].ToString()))
                                                                    {
                                                                        _valid_minlength = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_minlength = Convert.ToUInt64(rowtablesValidation["minlength"]);
                                                                    }

                                                                    if (string.IsNullOrEmpty(rowtablesValidation["maxheight"].ToString()))
                                                                    {
                                                                        _valid_maxheight = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_maxheight = Convert.ToUInt64(rowtablesValidation["maxheight"]);
                                                                    }

                                                                    if (string.IsNullOrEmpty(rowtablesValidation["minheight"].ToString()))
                                                                    {
                                                                        _valid_minheight = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_minheight = Convert.ToUInt64(rowtablesValidation["minheight"]);
                                                                    }

                                                                    if (string.IsNullOrEmpty(rowtablesValidation["maxwidth"].ToString()))
                                                                    {
                                                                        _valid_maxwidth = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_maxwidth = Convert.ToUInt64(rowtablesValidation["maxwidth"]);
                                                                    }

                                                                    if (string.IsNullOrEmpty(rowtablesValidation["minwidth"].ToString()))
                                                                    {
                                                                        _valid_minwidth = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_minwidth = Convert.ToUInt64(rowtablesValidation["minwidth"]);
                                                                    }
                                                                    if (string.IsNullOrEmpty(rowtablesValidation["allowedFileCount"].ToString()))
                                                                    {
                                                                        _valid_allowed_file_count = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_allowed_file_count = Convert.ToUInt64(rowtablesValidation["allowedFileCount"]);
                                                                    }
                                                                    //_valid_maxlength = rowtablesValidation["maxlength"] == DBNull.Value ? null : Convert.ToUInt64(rowtablesValidation["maxlength"]);
                                                                    //_valid_minlength = rowtablesValidation["minlength"] == DBNull.Value ? null : Convert.ToUInt64(rowtablesValidation["minlength"]);


                                                                    _valid_regex = rowtablesValidation["regex"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["regex"]);
                                                                    _valid_errormessage = rowtablesValidation["errormessage"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["errormessage"]);
                                                                    _valid_mindate = rowtablesValidation["mindate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["mindate"]);
                                                                    _valid_maxdate = rowtablesValidation["maxdate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["maxdate"]);
                                                                    _valid_status = rowtablesValidation["maxdate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["status"]);
                                                                    _valid_unique = rowtablesValidation["isunique"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["isunique"]);
                                                                    _valid_uniqueURL = rowtablesValidation["uniqueURL"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["uniqueURL"]);
                                                                    _valid_allowed_extentions = rowtablesValidation["allowedExtentions"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["allowedExtentions"]);

                                                                    _valid_otp_varification = rowtablesValidation["otp_varification"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["otp_varification"]);

                                                                    if (string.IsNullOrEmpty(rowtablesValidation["allowedSize"].ToString()))
                                                                    {
                                                                        _valid_allowed_size = null;
                                                                    }
                                                                    else
                                                                    {
                                                                        _valid_allowed_size = Convert.ToUInt64(rowtablesValidation["allowedSize"]);
                                                                    }
                                                                    _writer.WriteStartObject();

                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ValidationId, _valid_id.ToString());
                                                                    _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.ValidationRequired, _valid_required);

                                                                    if (_valid_maxlength != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxLength, _valid_maxlength ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxLength);
                                                                    }
                                                                    if (_valid_minlength != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMinLength, _valid_minlength ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationMinLength);
                                                                    }

                                                                    if (_valid_maxheight != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxHeight, _valid_maxheight ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxHeight);
                                                                    }
                                                                    if (_valid_minheight != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMinHeight, _valid_minheight ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationMinHeight);
                                                                    }

                                                                    if (_valid_maxwidth != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxWidth, _valid_maxwidth ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxWidth);
                                                                    }
                                                                    if (_valid_minwidth != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMinWidth, _valid_minwidth ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationMinWidth);
                                                                    }
                                                                    if (_valid_allowed_file_count != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedFileCount, _valid_allowed_file_count ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedFileCount);
                                                                    }
                                                                    //_writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxLength, _valid_maxlength);
                                                                    //_writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMinLength, _valid_minlength);


                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ValidationRegex, _valid_regex);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ValidationErrorMessage, _valid_errormessage);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ValidationMinDate, _valid_mindate);
                                                                    _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.ValidationUnique, _valid_unique);

                                                                    _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.ValidationOTP, _valid_otp_varification);

                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ValidationUniqueURL, _valid_uniqueURL);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedExtentions, _valid_allowed_extentions);
                                                                    if (_valid_allowed_size != null)
                                                                    {
                                                                        _writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedSize, _valid_allowed_size ?? 0);
                                                                    }
                                                                    else
                                                                    {
                                                                        _writer.WriteNull(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedSize);
                                                                    }
                                                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ValidationStatus, _valid_status);

                                                                    _writer.WriteEndObject();
                                                                    break;
                                                                }
                                                            }
                                                            // End Validation Json

                                                            // Start Condition Json

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Conditions);

                                                            _sqlQuery.Clear();
                                                            _sqlQuery.Append(" select  id, component_id, condition_component_id, conditional, status, eventType, changeType, componentToChange ");
                                                            _sqlQuery.Append(" from condition_main ");
                                                            _sqlQuery.Append(" WHERE ");
                                                            _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                            _sqlQuery.Append(" order by id; ");

                                                            //Call Function
                                                            (_functionReturn, _dataTableCondition, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                            if (_dataTableCondition.Rows.Count <= 0)
                                                            {
                                                                _writer.WriteStartObject();
                                                                _writer.WriteEndObject();
                                                            }
                                                            else
                                                            {
                                                                foreach (DataRow rowtablesCondition in _dataTableCondition.Rows)
                                                                {
                                                                    //check NULLS and DATA TYPE here for returned column values
                                                                    _condition_id = rowtablesCondition["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesCondition["id"]);
                                                                    _condition_componentid = rowtablesCondition["component_id"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["component_id"]);
                                                                    _condition_componentguid = rowtablesCondition["condition_component_id"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["condition_component_id"]);
                                                                    _condition_conditional = rowtablesCondition["conditional"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["conditional"]);
                                                                    _condition_status = rowtablesCondition["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["status"]);
                                                                    _condition_eventType = rowtablesCondition["eventType"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["eventType"]);
                                                                    _condition_changeType = rowtablesCondition["changeType"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["changeType"]);
                                                                    _condition_componentToChange = rowtablesCondition["componentToChange"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["componentToChange"]);

                                                                    _writer.WriteStartObject();

                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionId, _condition_id.ToString());
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionComponentId, _condition_componentid);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionComponentGuid, _condition_componentguid);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionConditional, _condition_conditional);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionEventType, _condition_eventType);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionChangeType, _condition_changeType);
                                                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionComponentToChange, _condition_componentToChange);

                                                                    //_writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ConditionStatus, _condition_status);

                                                                    _writer.WriteEndObject();
                                                                    break;
                                                                }
                                                            }

                                                            // End Condition Json

                                                            _writer.WriteEndObject();
                                                        }
                                                    }
                                                    _writer.WriteEndArray();
                                                    // End Component Json
                                                    _writer.WriteEndObject();
                                                }
                                            }
                                            _writer.WriteEndArray();
                                            // End section Json
                                            _writer.WriteEndObject();
                                        }
                                    }
                                    _writer.WriteEndArray();
                                    // End Page Json
                                    _writer.WriteEndObject();
                                }
                            }
                            // End Main Object Json
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
        /// Add Layout Json Value Async
        /// </summary>
        /// <param name="_templateFormValue"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddLayoutJsonValueAsync(TemplateList _templateFormValue)
        {
            return Task.Run(() => AddLayoutJsonValue(_templateFormValue));
        }
        /// <summary>
        /// Add Layout Json Value
        /// </summary>
        /// <param name="_templateFormValue"></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddLayoutJsonValue(TemplateList _templateFormValue)
        {
            #region Local Variables
            string _methodName = "F:Reg:AddLayoutJsonValue";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            DataTable _dataTable = null;
            DataTable _dataTableExam = null;
            DataTable _dataTableERT;
            TimeSpan? _queryTime = null;
            string _passwordHash = "";
            bool _success = true;
            string _candidateGuid = string.Empty;
            UInt64 _layout_id = 0;
            string _layout_guid = "";
            string _layout_type_code = "";
            UInt64 _page_id = 0;
            string _page_guid = "";
            string _RegistrationGuid = "";
            UInt64 _section_id = 0;
            string _section_guid = "";
            UInt64 _comp_id = 0;
            string _comp_guid = "";
            UInt64 _data_id = 0;
            string _data_value = "";
            string _selectedExam = "";
            string _data_showingrid = "";
            string _image_value = "";
            string _candidate_email = "";
            DataTable _dataTableSettings = null;
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
            string _setting_status = "";
            bool _setting_showingrid = false;
            DataTable _dataTableValidations = null;
            DataTable _dataTablePermissions = null;
            UInt64 _valid_id = 0;
            bool _valid_required = false;
            UInt64? _valid_maxlength = 0;
            UInt64? _valid_minlength = 0;
            string _valid_regex = "";
            string _valid_errormessage = "";
            string _valid_mindate = "";
            string _valid_maxdate = "";
            string _valid_status = "";
            bool _valid_unique = false;
            bool _valid_otp_verification = false;
            string _valid_uniqueURL = "";
            string _valid_allowed_extentions = "";
            string _category_guid = "";
            string _gender_guid = "";
            string _ph_guid = "";
            string _columnname1 = "";
            string _columnname2 = "";
            string _columnname3 = "";
            string _columnname1value = "";
            string _columnname2value = "";
            string _columnname3value = "";
            UInt64 _feeamount = 0;
            UInt64 _feevalue = 0;
            UInt64? _valid_allowed_size;
            UInt64? _valid_maxwidth;
            UInt64? _valid_minwidth;
            UInt64? _valid_maxheight;
            UInt64? _valid_minheight;
            UInt64? _component_length;
            UInt64? _valid_allowed_file_count;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            bool _feeStatus = false;

            //JSON data
            string _jsonReturn = string.Empty;

            #endregion

            #region Input Sanitization and Validation

            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_templateFormValue == null || _templateFormValue.TemplateFormValue == null)
                    _errorMessage = ApplicationConstants.ValidationMessages.FormDataRequired;
                if (string.IsNullOrEmpty(_templateFormValue.RegistrationGuid))
                    _errorMessage = ApplicationConstants.ValidationMessages.RegistrationGUIDRequired;
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
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
            else
            {
                try
                {
                    _RegistrationGuid = Sanitization.Sanitize(_templateFormValue.RegistrationGuid);
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
                            #region Candidate-Registration
                            if (string.IsNullOrEmpty(_templateFormValue.CandidateGuid))
                            {
                                _sqlQuery.Append("INSERT INTO `registration_main_live` ( ");
                                _sqlQuery.Append("`registration_status_guid`");
                                _sqlQuery.Append(", `candidate_guid`");
                                _sqlQuery.Append(", `registration_guid`");
                                _sqlQuery.Append(", `email_verified`");
                                _sqlQuery.Append(", `registration_date`");
                                _sqlQuery.Append(", `modify_date`");
                                _sqlQuery.Append(", `payment_status_guid`");
                                _sqlQuery.Append(" ) VALUES ( ");
                                _sqlQuery.Append("(SELECT status_guid FROM registration_status WHERE code='INITIATED')");
                                _sqlQuery.Append(",UUID()");
                                _sqlQuery.Append(",'" + _RegistrationGuid + "'");
                                _sqlQuery.Append(",'0'");
                                _sqlQuery.Append(",NOW()");
                                _sqlQuery.Append(",NOW()");
                                _sqlQuery.Append(",(SELECT status_guid FROM payment_status WHERE code='UNPAID')");
                                _sqlQuery.Append(" ); ");
                                _sqlQuery.Append("SELECT candidate_guid FROM registration_main_live WHERE id=(select LAST_INSERT_ID());");
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _candidateGuid = Convert.ToString(_mySqlCommand.ExecuteScalar());
                            }
                            else
                            {
                                _candidateGuid = _templateFormValue.CandidateGuid;
                            }
                            if (string.IsNullOrEmpty(_candidateGuid))
                                _success = false;
                            else
                            {
                                foreach (var templateItem in _templateFormValue.TemplateFormValue)
                                {
                                    if (_success)
                                    {
                                        _layout_id = Convert.ToUInt64(Sanitization.Sanitize(templateItem.LayoutId.ToString()));
                                        _layout_guid = Sanitization.Sanitize(templateItem.LayoutGuid);
                                        _layout_type_code = Sanitization.Sanitize(templateItem.LayoutTypeCode);
                                        _page_id = Convert.ToUInt64(Sanitization.Sanitize(templateItem.PageId.ToString()));
                                        _page_guid = Sanitization.Sanitize(templateItem.PageGuid);
                                        _section_id = Convert.ToUInt64(Sanitization.Sanitize(templateItem.SectionId.ToString()));
                                        _section_guid = Sanitization.Sanitize(templateItem.SectionGuid);
                                        _comp_id = Convert.ToUInt64(Sanitization.Sanitize(templateItem.ComponentId.ToString()));
                                        _comp_guid = Sanitization.Sanitize(templateItem.ComponentGuid);
                                        //_data_id = Convert.ToUInt64(Sanitization.Sanitize(templateItem.DataId.ToString()));
                                        _data_value = Sanitization.Sanitize(templateItem.DataValue);
                                        _data_showingrid = Sanitization.Sanitize(templateItem.DataShowInGrid.ToString());

                                        _sqlQuery.Clear();
                                        _sqlQuery.Append(" select  id, measurementType,  height,  width, labelposition, type, label, description, " +
                                            "input, placeholder, endPoint, defaultValue, status, dataParameter, showingrid ");
                                        _sqlQuery.Append(" from settings_main ");
                                        _sqlQuery.Append(" WHERE ");
                                        _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                        _sqlQuery.Append(" order by id; ");

                                        //Call Function
                                        (_functionReturn, _dataTableSettings, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                        if (_dataTableSettings.Rows.Count <= 0)
                                        {

                                        }
                                        else
                                        {
                                            foreach (DataRow rowtablesSetting in _dataTableSettings.Rows)
                                            {
                                                //check NULLS and DATA TYPE here for returned column values
                                                _setting_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                _setting_measurementType = rowtablesSetting["measurementType"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["measurementType"]);
                                                _setting_height = rowtablesSetting["height"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["height"]);
                                                _setting_width = rowtablesSetting["width"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["width"]);
                                                _setting_labelposition = rowtablesSetting["labelposition"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["labelposition"]);
                                                _setting_type = rowtablesSetting["type"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["type"]);
                                                _setting_label = rowtablesSetting["label"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["label"]);
                                                _setting_description = rowtablesSetting["description"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["description"]);
                                                _setting_input = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                _setting_placeholder = rowtablesSetting["placeholder"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["placeholder"]);
                                                _setting_endpoint = rowtablesSetting["endPoint"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["endPoint"]);
                                                _setting_defaultValue = rowtablesSetting["defaultValue"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["defaultValue"]);
                                                _setting_status = rowtablesSetting["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["status"]);
                                                _setting_dataParameter = rowtablesSetting["dataParameter"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataParameter"]);
                                                _setting_showingrid = rowtablesSetting["showingrid"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["showingrid"]);
                                                break;
                                            }
                                        }
                                        _sqlQuery.Clear();
                                        _sqlQuery.Append(" select  id, required, maxlength, minlength, mindate, maxdate, regex , " +
                                            "errormessage, status, isunique, uniqueURL, allowedExtentions, allowedSize, maxheight, minheight," +
                                            "maxwidth, minwidth, allowedFileCount, otp_varification ");
                                        _sqlQuery.Append(" from validations_main ");
                                        _sqlQuery.Append(" WHERE ");
                                        _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                        _sqlQuery.Append(" order by id; ");

                                        //Call Function
                                        (_functionReturn, _dataTableValidations, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                        if (_dataTableValidations.Rows.Count <= 0)
                                        {

                                        }
                                        else
                                        {
                                            foreach (DataRow rowtablesValidation in _dataTableValidations.Rows)
                                            {
                                                //check NULLS and DATA TYPE here for returned column values
                                                _valid_id = rowtablesValidation["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesValidation["id"]);
                                                _valid_required = rowtablesValidation["required"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["required"]);

                                                if (string.IsNullOrEmpty(rowtablesValidation["maxlength"].ToString()))
                                                {
                                                    _valid_maxlength = null;
                                                }
                                                else
                                                {
                                                    _valid_maxlength = Convert.ToUInt64(rowtablesValidation["maxlength"]);
                                                }
                                                if (string.IsNullOrEmpty(rowtablesValidation["minlength"].ToString()))
                                                {
                                                    _valid_minlength = null;
                                                }
                                                else
                                                {
                                                    _valid_minlength = Convert.ToUInt64(rowtablesValidation["minlength"]);
                                                }
                                                if (string.IsNullOrEmpty(rowtablesValidation["maxheight"].ToString()))
                                                {
                                                    _valid_maxheight = null;
                                                }
                                                else
                                                {
                                                    _valid_maxheight = Convert.ToUInt64(rowtablesValidation["maxheight"]);
                                                }
                                                if (string.IsNullOrEmpty(rowtablesValidation["minheight"].ToString()))
                                                {
                                                    _valid_minheight = null;
                                                }
                                                else
                                                {
                                                    _valid_minheight = Convert.ToUInt64(rowtablesValidation["minheight"]);
                                                }
                                                if (string.IsNullOrEmpty(rowtablesValidation["maxwidth"].ToString()))
                                                {
                                                    _valid_maxwidth = null;
                                                }
                                                else
                                                {
                                                    _valid_maxwidth = Convert.ToUInt64(rowtablesValidation["maxwidth"]);
                                                }
                                                if (string.IsNullOrEmpty(rowtablesValidation["minwidth"].ToString()))
                                                {
                                                    _valid_minwidth = null;
                                                }
                                                else
                                                {
                                                    _valid_minwidth = Convert.ToUInt64(rowtablesValidation["minwidth"]);
                                                }

                                                if (string.IsNullOrEmpty(rowtablesValidation["allowedFileCount"].ToString()))
                                                {
                                                    _valid_allowed_file_count = null;
                                                }
                                                else
                                                {
                                                    _valid_allowed_file_count = Convert.ToUInt64(rowtablesValidation["allowedFileCount"]);
                                                }

                                                _valid_regex = rowtablesValidation["regex"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["regex"]);
                                                _valid_errormessage = rowtablesValidation["errormessage"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["errormessage"]);
                                                _valid_mindate = rowtablesValidation["mindate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["mindate"]);
                                                _valid_maxdate = rowtablesValidation["maxdate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["maxdate"]);
                                                _valid_status = rowtablesValidation["maxdate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["status"]);
                                                _valid_unique = rowtablesValidation["isunique"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["isunique"]);
                                                _valid_uniqueURL = rowtablesValidation["uniqueURL"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["uniqueURL"]);
                                                _valid_allowed_extentions = rowtablesValidation["allowedExtentions"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["allowedExtentions"]);

                                                _valid_otp_verification = rowtablesValidation["otp_varification"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["otp_varification"]);

                                                if (string.IsNullOrEmpty(rowtablesValidation["allowedSize"].ToString()))
                                                {
                                                    _valid_allowed_size = null;
                                                }
                                                else
                                                {
                                                    _valid_allowed_size = Convert.ToUInt64(rowtablesValidation["allowedSize"]);
                                                }
                                                break;
                                            }
                                        }

                                        if (templateItem.ComponentName.ToLower() == "ngxixcheckphysicaldisability")
                                        {
                                            if (string.IsNullOrEmpty(_data_value))
                                            {
                                                _data_value = "0";
                                            }
                                        }

                                        _component_length = Convert.ToUInt64(string.IsNullOrEmpty(_data_value) ? 0 : _data_value.Length);

                                        if (_valid_unique)
                                        {
                                            ValidateComponent __validateComponent = new ValidateComponent();
                                            __validateComponent.ComponentName = templateItem.ComponentName.ToLower();
                                            __validateComponent.ComponentValue = _data_value;
                                            __validateComponent.CandidateGuid = _candidateGuid;

                                            (_jsonReturn, _functionReturn) = ValidateUniqueComponent(__validateComponent);
                                            if (!_functionReturn.Status)
                                            {
                                                _success = false;
                                                _errorMessage = GenericMessages.RecordAlreadyExists;
                                            }
                                        }

                                        if (_valid_required && _success)
                                        {
                                            if (_setting_type == "text")
                                            {
                                                if (_component_length >= _valid_minlength && _component_length <= _valid_maxlength)
                                                    _success = true;
                                                else
                                                {
                                                    _success = false;
                                                    if (_component_length == 0)
                                                    {
                                                        _errorMessage = _setting_label + ValidationMessages.ComponentRequired;
                                                    }
                                                    else
                                                    {
                                                        _errorMessage = _setting_label + ValidationMessages.MinMaxLengthInvalid + _valid_minlength + " and " + _valid_maxlength + ".";
                                                    }
                                                }
                                            }
                                            else if (_setting_type == "email")
                                            {
                                                if (_component_length > 0)
                                                {
                                                    _success = true;
                                                    _candidate_email = _data_value;
                                                }
                                                else
                                                {
                                                    _success = false;
                                                    _errorMessage = _setting_label + ValidationMessages.ComponentRequired;
                                                }
                                            }
                                            else if (_setting_type == "select")
                                            {
                                                if (_component_length > 0)
                                                {
                                                    _success = true;
                                                }
                                                else
                                                {
                                                    _success = false;
                                                    _errorMessage = _setting_label + ValidationMessages.ComponentRequired;
                                                }
                                            }
                                        }

                                        if (_success)
                                        {
                                            if (templateItem.ComponentName.ToLower() == "ngxixcheckphotouploaderai" && !string.IsNullOrEmpty(_data_value))
                                            {
                                                AiImageValidation _aiImageValidation = new AiImageValidation
                                                {
                                                    ComponentId = Convert.ToString(templateItem.ComponentId),
                                                    Image = _data_value,
                                                    RegGuid = _RegistrationGuid,
                                                    CreateLog = "1"
                                                };

                                                (_jsonReturn, _functionReturn) =
                                                    Task.Run(() => _sharedFunctions.AiValidationsAsync(_aiImageValidation)).Result;
                                                if (_functionReturn.Status)
                                                {
                                                    _image_value = _data_value + "~" + _jsonReturn;
                                                    _data_value = "";
                                                }
                                                else
                                                    _success = false;
                                            }

                                            if ((templateItem.ComponentName.ToLower() == "ngxixcheckfileuploader" || templateItem.ComponentName.ToLower() == "ngxixcheckphotouploader" || templateItem.ComponentName.ToLower() == "ngxixchecksignatureuploader") && _data_value != null)
                                            {
                                                _image_value = _data_value;
                                                _data_value = "";
                                            }

                                            if (_data_showingrid != null)
                                            {
                                                if (_data_showingrid.ToLower() == "true")
                                                {
                                                    _data_showingrid = "1";
                                                }
                                                else
                                                {
                                                    _data_showingrid = "0";
                                                }
                                            }
                                            else
                                            {
                                                _data_showingrid = "0";
                                            }

                                            if (templateItem.ComponentName.ToLower() == "ngxixcheckregtypelist")
                                            {
                                                if (_data_value != "" && _data_value != null)
                                                {
                                                    _selectedExam = _data_value;
                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append("SELECT registration_guid, GROUP_CONCAT(CONCAT(reg_type_guid, '~', exam_guid) SEPARATOR '|')  as exam_to_reg_type_guid ");
                                                    _sqlQuery.Append("FROM exam_to_reg_type ");
                                                    _sqlQuery.Append("WHERE reg_type_guid  in ");
                                                    _sqlQuery.Append(" (SELECT guid FROM reg_types WHERE FIND_IN_SET(guid, '" + _data_value.Replace("~", ",") + "'));");


                                                    //Call Function
                                                    (_functionReturn, _dataTableERT, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                                    if (_dataTableERT.Rows.Count <= 0)
                                                    {
                                                        _data_value = "";
                                                    }
                                                    else
                                                    {
                                                        _data_value = _dataTableERT.Rows[0]["exam_to_reg_type_guid"].ToString();
                                                    }
                                                }
                                                else
                                                {
                                                    _data_value = "";
                                                }
                                            }

                                            if (templateItem.ComponentName.ToLower() == "ngxixcheckpassword")
                                            {
                                                _data_value = _passwordHash = SecurityHash.HashPassword(_data_value);
                                            }
                                            if (templateItem.ComponentName.ToLower() == "ngxixcheckconfirmpassword")
                                            {
                                                _data_value = "";
                                            }
                                            _sqlQuery.Clear();
                                            _dataTable = new DataTable();
                                            _sqlQuery.Append(" select id ");

                                            _sqlQuery.Append(" from data_save_main_live ");
                                            _sqlQuery.Append(" WHERE ");
                                            _sqlQuery.Append(" candidate_guid = '" + _candidateGuid + "'");
                                            _sqlQuery.Append(" and comp_id = " + _comp_id.ToString() + " and status = 1 ");
                                            _sqlQuery.Append(" order by id; ");

                                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                            if (_dataTable.Rows.Count <= 0)
                                            {
                                                if (templateItem.ComponentName.ToLower() == "ngxixcheckpassword")
                                                {
                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append(" select  id  ");
                                                    _sqlQuery.Append(" from permission_groups ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" fixed_permission = 1");

                                                    //Call Function
                                                    (_functionReturn, _dataTablePermissions, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTablePermissions.Rows.Count <= 0)
                                                    {

                                                    }
                                                    else
                                                    {
                                                        _sqlQuery.Clear();
                                                        foreach (DataRow rowtablesPermission in _dataTablePermissions.Rows)
                                                        {
                                                            _valid_id = rowtablesPermission["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesPermission["id"]);
                                                            _sqlQuery.Append("INSERT into users_to_permission_groups(candidate_guid, permission_group_id) ");
                                                            _sqlQuery.Append("  Values('" + _candidateGuid + "', '" + _valid_id + "'); ");
                                                        }
                                                        _sqlQuery.Append("select LAST_INSERT_ID();");
                                                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                        _data_id = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                                    }
                                                }


                                                _sqlQuery.Clear();
                                                if (string.IsNullOrEmpty(_RegistrationGuid))
                                                    _sqlQuery.Append("INSERT INTO `data_save_main` ( ");
                                                else
                                                    _sqlQuery.Append("INSERT INTO `data_save_main_live` ( ");

                                                _sqlQuery.Append("`candidate_guid`");
                                                _sqlQuery.Append(",`form_id`");
                                                _sqlQuery.Append(",`page_id`");
                                                _sqlQuery.Append(",`section_id`");
                                                _sqlQuery.Append(",`comp_id`");
                                                _sqlQuery.Append(",`datavalue`");
                                                if ((templateItem.ComponentName.ToLower() == "ngxixcheckfileuploader" || templateItem.ComponentName.ToLower() == "ngxixcheckphotouploader" || templateItem.ComponentName.ToLower() == "ngxixchecksignatureuploader" || templateItem.ComponentName.ToLower() == "ngxixcheckphotouploaderai") && _data_value != null)
                                                {
                                                    _sqlQuery.Append(",`imageValue`");
                                                }
                                                _sqlQuery.Append(",`showingrid`");
                                                _sqlQuery.Append(",`status`");
                                                _sqlQuery.Append(" ) VALUES ( ");
                                                _sqlQuery.Append("'" + _candidateGuid + "'");
                                                _sqlQuery.Append(",'" + _layout_id + "'");
                                                _sqlQuery.Append(",'" + _page_id + "'");
                                                _sqlQuery.Append(",'" + _section_id + "'");
                                                _sqlQuery.Append(",'" + _comp_id + "'");
                                                _sqlQuery.Append(",'" + _data_value + "'");
                                                if ((templateItem.ComponentName.ToLower() == "ngxixcheckfileuploader" || templateItem.ComponentName.ToLower() == "ngxixcheckphotouploader" || templateItem.ComponentName.ToLower() == "ngxixchecksignatureuploader" || templateItem.ComponentName.ToLower() == "ngxixcheckphotouploaderai") && _data_value != null)
                                                {
                                                    _sqlQuery.Append(",'" + _image_value + "'");
                                                }
                                                _sqlQuery.Append(",'" + _data_showingrid + "'");
                                                _sqlQuery.Append(",'1'");
                                                _sqlQuery.Append(" ); ");
                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                _data_id = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                            }
                                            else
                                            {
                                                _sqlQuery.Clear();
                                                if (_RegistrationGuid == "")
                                                    _sqlQuery.Append("update `data_save_main` ");
                                                else
                                                    _sqlQuery.Append("update `data_save_main_live` ");
                                                _sqlQuery.Append("set");
                                                _sqlQuery.Append("`datavalue` =");
                                                _sqlQuery.Append("'" + _data_value + "'");
                                                _sqlQuery.Append(",`imageValue` =");
                                                _sqlQuery.Append("'" + _image_value + "'");
                                                _sqlQuery.Append(" WHERE ");
                                                _sqlQuery.Append(" candidate_guid = '" + _candidateGuid + "'");
                                                _sqlQuery.Append(" and comp_id = " + _comp_id.ToString() + " and status = 1 ");
                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                _data_id = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());
                                            }
                                            if (_data_id <= 0)
                                                _success = false;
                                        }
                                    }
                                }
                            }

                            if (_success)
                            {
                                _sqlQuery.Clear();
                                _sqlQuery.Append(" select  max(if(c.name='NgxIxcheckCategory',d.datavalue,null)) as Category, ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckGender',d.datavalue,null)) as Gender, ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckPhysicalDisability','07766973-1aa2-11eb-8364-5a28b94f0bf6','0')) as PhysicalDisability ");
                                _sqlQuery.Append("  from components_main c ");
                                _sqlQuery.Append(" join  data_save_main_live d on d.comp_id=c.id  ");
                                _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "';");

                                //Call Function
                                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                if (_dataTable.Rows.Count > 0)
                                {
                                    foreach (DataRow rowtables in _dataTable.Rows)
                                    {
                                        _category_guid = rowtables["Category"] == DBNull.Value ? "" : Convert.ToString(rowtables["Category"]);
                                        _gender_guid = rowtables["Gender"] == DBNull.Value ? "" : Convert.ToString(rowtables["Gender"]);
                                        _ph_guid = rowtables["PhysicalDisability"] == DBNull.Value ? "" : Convert.ToString(rowtables["PhysicalDisability"]);
                                    }
                                }


                                /*fee logic*/
                                if (_success && _layout_type_code != "initiallayout")
                                {
                                    _sqlQuery.Clear();
                                    if (string.IsNullOrEmpty(_selectedExam))
                                    {
                                        _sqlQuery.Append("SELECT exam_guid FROM registration_to_exam WHERE registration_guid='" + _RegistrationGuid + "';");
                                        (_functionReturn, _dataTableExam, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                    }
                                    else
                                    {
                                        string[] val = _selectedExam.Split("~");
                                        _sqlQuery.Append("SELECT exam_guid FROM exam_to_reg_type WHERE reg_type_guid IN(");
                                        foreach (string item in val)
                                        {
                                            _sqlQuery.Append("'" + item + "'");
                                            _sqlQuery.Append(",");
                                        }
                                        _sqlQuery.Append("'abcd');");
                                        (_functionReturn, _dataTableExam, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                    }
                                    if (_dataTableExam.Rows.Count > 0)
                                    {
                                        foreach (DataRow _dtr in _dataTableExam.Rows)
                                        {
                                            _sqlQuery.Clear();
                                            _sqlQuery.Append("SELECT RFS.Amount,RFS.priority,RFS.exam_guid ");
                                            _sqlQuery.Append(" ,FSM1.level1 columnname1, FSM1.guid columnValue1 ");
                                            _sqlQuery.Append(" ,FSM2.level1 columnname2, FSM2.guid columnValue2 ");
                                            _sqlQuery.Append(" ,FSM3.level1 columnname3, FSM3.guid columnValue3 ");
                                            _sqlQuery.Append(" FROM registration_fee_setup RFS ");
                                            _sqlQuery.Append(" JOIN fee_setup_master FSM1 ON RFS.level1 = FSM1.guid ");
                                            _sqlQuery.Append(" LEFT JOIN fee_setup_master FSM2 ON RFS.level2 = FSM2.guid ");
                                            _sqlQuery.Append(" LEFT JOIN fee_setup_master FSM3 ON RFS.level3 = FSM3.guid ");
                                            _sqlQuery.Append(" WHERE status=1 AND RFS.exam_guid='" + _dtr["exam_guid"] + "' ORDER BY RFS.priority;");
                                            (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                            if (_dataTable.Rows.Count > 0)
                                            {
                                                foreach (DataRow rowtables in _dataTable.Rows)
                                                {
                                                    _columnname1 = rowtables["columnname1"] == DBNull.Value ? "" : Convert.ToString(rowtables["columnname1"]);
                                                    _columnname2 = rowtables["columnname2"] == DBNull.Value ? "" : Convert.ToString(rowtables["columnname2"]);
                                                    _columnname3 = rowtables["columnname3"] == DBNull.Value ? "" : Convert.ToString(rowtables["columnname3"]);

                                                    _columnname1value = rowtables["columnValue1"] == DBNull.Value ? "" : Convert.ToString(rowtables["columnValue1"]);
                                                    _columnname2value = rowtables["columnValue2"] == DBNull.Value ? "" : Convert.ToString(rowtables["columnValue2"]);
                                                    _columnname3value = rowtables["columnValue3"] == DBNull.Value ? "" : Convert.ToString(rowtables["columnValue3"]);

                                                    _feevalue = rowtables["Amount"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtables["Amount"]);

                                                    FeeObject _feeobject = new FeeObject();

                                                    _feeobject.CategoryValue = _category_guid;
                                                    _feeobject.GenderValue = _gender_guid;
                                                    _feeobject.PhValue = _ph_guid;

                                                    if (!string.IsNullOrEmpty(_columnname1) && !string.IsNullOrEmpty(_columnname1value))
                                                        _feeStatus = CheckFee(_columnname1, _columnname1value, _feeobject);
                                                    if (!string.IsNullOrEmpty(_columnname2) && !string.IsNullOrEmpty(_columnname2value) && _feeStatus)
                                                        _feeStatus = CheckFee(_columnname2, _columnname2value, _feeobject);
                                                    if (!string.IsNullOrEmpty(_columnname3) && !string.IsNullOrEmpty(_columnname3value) && _feeStatus)
                                                        _feeStatus = CheckFee(_columnname3, _columnname3value, _feeobject);

                                                    if (_feeStatus)
                                                    {
                                                        _feeamount += _feevalue;
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (_feeamount <= 0)
                                        {
                                            _success = false;
                                            _errorMessage = ApplicationConstants.GenericMessages.InvalidFeeAmount;
                                        }
                                        else
                                        {
                                            _sqlQuery.Clear();
                                            if (string.IsNullOrEmpty(_RegistrationGuid))
                                                _sqlQuery.Append("UPDATE `data_save_main` ");
                                            else
                                                _sqlQuery.Append("UPDATE `registration_main_live` ");
                                            _sqlQuery.Append("SEt ");
                                            _sqlQuery.Append("`Fee_Amount` ='" + _feeamount + "'");
                                            if (!string.IsNullOrEmpty(_RegistrationGuid))
                                                _sqlQuery.Append(" ,modify_date=NOW()");
                                            _sqlQuery.Append(" WHERE ");
                                            _sqlQuery.Append(" candidate_guid ='" + _candidateGuid + "';");

                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                            _data_id = (UInt64)_mySqlCommand.ExecuteNonQuery();
                                        }
                                    }
                                }
                                /*fee logic*/
                            }

                            if (_success && _layout_type_code == "initiallayout")
                            {
                                if (!string.IsNullOrEmpty(_candidate_email))
                                {
                                    ValidationOTP _validationOTP = new ValidationOTP();
                                    _validationOTP.RegistrationGuid = _RegistrationGuid;
                                    _validationOTP.CandidateGuid = _candidateGuid;
                                    _validationOTP.EmailID = _candidate_email;
                                    _functionReturn = GenerateOTP(_validationOTP);
                                }
                                //_candidate_email
                            }
                            #endregion

                            #region Create Json
                            var options = new JsonWriterOptions
                            {
                                Indented = true
                            };
                            using (var stream = new MemoryStream())
                            {
                                using (var _writer = new Utf8JsonWriter(stream, options))
                                {
                                    _writer.WriteStartObject();

                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Response);
                                    _writer.WriteStartObject();
                                    if (_success)
                                    {
                                        _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.Status, true);
                                    }
                                    else
                                    {
                                        _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.Status, false);
                                    }
                                    _writer.WriteEndObject();

                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Registration);
                                    _writer.WriteStartObject();
                                    _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid, _candidateGuid);
                                    _writer.WriteEndObject();
                                    _writer.WriteEndObject();
                                }
                                _jsonReturn = Encoding.UTF8.GetString(stream.ToArray());
                            }
                            #endregion
                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn.Status = true;

                                if (_layout_type_code != "initiallayout")
                                {
                                    var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.EditRegistration, "Registration Edited");
                                    _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RegistrationHasCompleted, _methodName);
                                }
                                else
                                {
                                    var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.Initiated, "Registration Initiated");
                                    _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RegistrationInfoSaved, _methodName);
                                }
                            }
                            else
                            {
                                if (!string.IsNullOrEmpty(_errorMessage))
                                    _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                                _mytransaction?.Rollback();
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
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

        private bool CheckFee(string _feeKey, string _feeValue, FeeObject _feeObject)
        {
            bool _status = false;

            // string enumValue = Enum.GetName(typeof(FeeCategory), _feeKey);

            if (_feeKey == "Default")
            {
                _status = true;
            }
            else if (_feeKey == "Category" && _feeValue == _feeObject.CategoryValue)
            {
                _status = true;
            }
            else if (_feeKey == "Gender" && _feeValue == _feeObject.GenderValue)
            {
                _status = true;
            }
            else if (_feeKey == "Special Category" && _feeValue == _feeObject.PhValue)
            {
                _status = true;
            }


            return _status;


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

                    if (string.IsNullOrEmpty(validateComponent.ExamGuid))
                    {
                        _sqlQuery.Append(" select d.reg_id,d.candidate_guid, c.name, d.datavalue, v.isunique ");
                        _sqlQuery.Append(" from components_main c ");
                        _sqlQuery.Append(" join  data_save_main d on c.id=d.comp_id ");
                        _sqlQuery.Append(" join validations_main v on c.id=v.component_id ");
                        _sqlQuery.Append(" where ");
                        _sqlQuery.Append(" c.name = '" + validateComponent.ComponentName + "'");
                        _sqlQuery.Append(" and d.datavalue = '" + validateComponent.ComponentValue + "'");
                        _sqlQuery.Append(" and d.candidate_guid != '" + validateComponent.CandidateGuid + "'");
                        _sqlQuery.Append(" order by d.id; ");
                    }
                    else
                    {
                        _sqlQuery.Append(" select d.reg_id,d.candidate_guid, c.name, d.datavalue, v.isunique ");
                        _sqlQuery.Append(" from components_main c ");
                        _sqlQuery.Append(" join  data_save_main_live d on c.id=d.comp_id ");
                        _sqlQuery.Append(" join validations_main v on c.id=v.component_id ");
                        _sqlQuery.Append(" where ");
                        _sqlQuery.Append(" c.name = '" + validateComponent.ComponentName + "'");
                        _sqlQuery.Append(" and d.datavalue = '" + validateComponent.ComponentValue + "'");
                        _sqlQuery.Append(" and d.candidate_guid != '" + validateComponent.CandidateGuid + "'");
                        _sqlQuery.Append(" order by d.id; ");

                    }
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

                                        _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid, _candidateGuid);
                                        _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.ComponentName, _name);
                                        _writer.WriteString(ApplicationJsonReturnConstants.PropertyNames.DataValue, _data_value);
                                        _writer.WriteBoolean(ApplicationJsonReturnConstants.PropertyNames.ValidationUnique, _unique);

                                        _writer.WriteEndObject();
                                        _functionReturn.Status = false;

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

        /// <summary>
        /// Edit Layout Json Async
        /// </summary>
        /// <param name="_templateForm"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> EditLayoutJsonAsync(TemplateForm _templateForm)
        {
            return Task.Run(() => EditLayoutJson(_templateForm));
        }
        /// <summary>
        /// Edit Layout Json
        /// </summary>
        /// <param name="_templateForm"></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) EditLayoutJson(TemplateForm _templateForm)
        {
            #region Local Variables
            string _methodName = "F:Reg:EditLayoutJson";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            int _rowsAffected = 0;
            bool _success = true;

            UInt64 _retValue = 0;

            UInt64 _layout_id = 0;
            string _layout_guid = "";
            string _layout_name = "";
            string _layout_description = "";
            string _layout_code = "";
            string _layout_exam_type = "";
            string _layout_page_name = "";
            string _layout_exam_type_guid = "";
            string _layout_number = "";

            string _layout_type_guid = "";
            string _layout_type = "";
            UInt64 _page_id = 0;
            string _page_guid = "";
            UInt64 _page_id_prev = 0;
            string _page_name = "";
            string _page_description = "";
            UInt64 _section_id = 0;
            string _section_guid = "";
            UInt64 _section_id_prev = 0;
            string _section_name = "";
            string _section_description = "";
            string _section_visibility = "";
            string _section_css_class = "";
            UInt64 _comp_id = 0;
            UInt64 _comp_id_prev = 0;
            string _comp_guid = "";
            string _comp_name = "";
            string _comp_cols = "";
            string _comp_rows = "";
            string _comp_x = "";
            string _comp_y = "";

            UInt64 _setting_id_prev = 0;
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

            UInt64 _dataobject_id_prev = 0;
            UInt64 _dataobject_id = 0;
            string _dataobject_endpoint = "";
            string _dataobject_textfield = "";
            string _dataobject_valuefield = "";


            UInt64 _valid_id_prev = 0;
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

            UInt64 _condition_id_prev = 0;
            UInt64 _condition_id = 0;
            string _condition_conditional = "";
            string _condition_eventType = "";
            string _condition_changeType = "";
            string _condition_componentToChange = "";

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

            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;

            //JSON data
            string _jsonReturn = string.Empty;
            Object _obj = null;

            #endregion

            #region Input Sanitization and Validation

            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_templateForm == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.FormDataRequired; ;
                }
                else
                {
                    //Sanitize Input
                    _layout_id = Convert.ToUInt64(Sanitization.Sanitize(_templateForm.Form.LayoutId.ToString()));
                    _layout_guid = Sanitization.Sanitize(_templateForm.Form.LayoutGuid);
                    _layout_name = Sanitization.Sanitize(_templateForm.Form.LayoutName);
                    _layout_description = Sanitization.Sanitize(_templateForm.Form.LayoutDescription);
                    _layout_code = Sanitization.Sanitize(_templateForm.Form.LayoutCode);
                    _layout_exam_type = Sanitization.Sanitize(_templateForm.Form.LayoutExamType);
                    _layout_exam_type_guid = Sanitization.Sanitize(_templateForm.Form.LayoutExamTypeGuid);
                    _layout_page_name = Sanitization.Sanitize(_templateForm.Form.LayoutPageName);
                    _layout_number = Sanitization.Sanitize(_templateForm.Form.LayoutNumber);

                    _layout_type = Sanitization.Sanitize(_templateForm.Form.LayoutType);
                    _layout_type_guid = Sanitization.Sanitize(_templateForm.Form.LayoutTypeGuid);

                    //form error
                    if (_layout_id <= 0)
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutIdRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutNameRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_exam_type_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.ExamTypeGuidRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_type_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutTypeRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_type))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutTypeRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_name))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutNameRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_exam_type_guid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.LayoutTypeRequired;
                    }
                    if (string.IsNullOrEmpty(_layout_description))
                    {
                        //_errorMessage = ApplicationConstants.ValidationMessages.LayoutDescriptionRequired;
                    }
                }
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _success = false;
                _errorMessage = ex.Message;
            }

            #endregion

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

                            #region Add Tab

                            _sqlQuery.Clear();
                            _sqlQuery.Append("select count(id) from layout_main where id = " + _templateForm.Form.LayoutId + ";");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _obj = _mySqlCommand.ExecuteScalar();
                            _retValue = (_obj != DBNull.Value) ? Convert.ToUInt64(_obj) : 0;

                            if (_retValue <= 0)
                            {
                                _success = false;
                                _errorMessage = ApplicationConstants.ValidationMessages.FormDataExist;
                            }

                            if (_success)
                            {
                                _sqlQuery.Clear();
                                _sqlQuery.Append("UPDATE `layout_main` SET ");
                                _sqlQuery.Append("`layout_guid` = '" + _layout_guid + "'");
                                _sqlQuery.Append(",`name` = '" + _layout_name + "'");
                                _sqlQuery.Append(",`description` = '" + _layout_description + "'");
                                _sqlQuery.Append(",`code` = '" + _layout_code + "'");
                                _sqlQuery.Append(",`exam_type` = '" + _layout_exam_type + "'");
                                _sqlQuery.Append(",`exam_type_guid` = '" + _layout_exam_type_guid + "'");
                                _sqlQuery.Append(",`page_name` = '" + _layout_type_guid + "'");
                                _sqlQuery.Append(",`layout_type_guid` = '" + _layout_page_name + "'");

                                //_sqlQuery.Append(",`number` = '" + _layout_number + "'");
                                //_sqlQuery.Append(",`status` = " + status + "");
                                //_sqlQuery.Append(",`datetimestamp` = UTC_TIMESTAMP ");
                                _sqlQuery.Append(" WHERE id = " + _layout_id + "");
                                _sqlQuery.Append(";");

                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                if (_rowsAffected <= 0)
                                {
                                    _success = false;
                                    _errorMessage = ApplicationConstants.ValidationMessages.FormDataExist;
                                }
                                if (_templateForm.Form.Pages.Count <= 0)
                                {
                                    _success = false;
                                }

                                // start page
                                if (_success)
                                {
                                    try
                                    {
                                        // start page loop
                                        foreach (var pageItem in _templateForm.Form.Pages)
                                        {
                                            if (_success)
                                            {
                                                //Sanitize Input    
                                                _page_id_prev = Convert.ToUInt64(Sanitization.Sanitize(pageItem.PageId.ToString()));
                                                _page_guid = Sanitization.Sanitize(pageItem.PageGuid);
                                                _page_name = Sanitization.Sanitize(pageItem.PageName);
                                                _page_description = Sanitization.Sanitize(pageItem.PageDescription);

                                                //page error
                                                if (_page_id_prev == 0)
                                                {
                                                    //_errorMessage = ApplicationConstants.ValidationMessages.PageIdRequired;
                                                }
                                                else if (string.IsNullOrEmpty(_page_name))
                                                {
                                                    _errorMessage = ApplicationConstants.ValidationMessages.PageNameRequired;
                                                }
                                                else if (string.IsNullOrEmpty(_page_description))
                                                {
                                                    //_errorMessage = ApplicationConstants.ValidationMessages.PageDescriptionRequired;
                                                }

                                                if (!string.IsNullOrEmpty(_errorMessage))
                                                {
                                                    _success = false;
                                                }
                                                else
                                                {
                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append("UPDATE `pages_main` SET ");
                                                    _sqlQuery.Append("`status` = 2");
                                                    _sqlQuery.Append(" WHERE form_id = " + _layout_id + " and id=" + _page_id_prev + " ");
                                                    _sqlQuery.Append(";");

                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                    _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                                    if (_rowsAffected <= 0)
                                                    {
                                                        //_success = false;
                                                        //_errorMessage = ApplicationConstants.ValidationMessages.PageDataExist;
                                                    }
                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append("INSERT INTO `pages_main` ( ");
                                                    _sqlQuery.Append("`page_guid`");
                                                    _sqlQuery.Append(",`form_id`");
                                                    _sqlQuery.Append(",`code`");
                                                    _sqlQuery.Append(",`description`");
                                                    _sqlQuery.Append(",`status`");
                                                    _sqlQuery.Append(" ) VALUES ( ");
                                                    _sqlQuery.Append("'" + _page_guid + "'");
                                                    _sqlQuery.Append("," + _layout_id + "");
                                                    _sqlQuery.Append(",'" + _page_name + "'");
                                                    _sqlQuery.Append(",'" + _page_description + "'");
                                                    _sqlQuery.Append(",'1'");
                                                    _sqlQuery.Append(" ); ");
                                                    _sqlQuery.Append("select LAST_INSERT_ID();");

                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                    _page_id = (UInt64)_mySqlCommand.ExecuteScalar();

                                                    if (_page_id <= 0)
                                                    {
                                                        _success = false;
                                                    }
                                                    if (pageItem.Sections.Count <= 0)
                                                    {
                                                        _success = false;
                                                    }
                                                    // strart section
                                                    if (_success)
                                                    {
                                                        // start section loop 
                                                        foreach (var sectionItem in pageItem.Sections)
                                                        {

                                                            if (_success)
                                                            {
                                                                //Sanitize Input  
                                                                _section_id_prev = Convert.ToUInt64(Sanitization.Sanitize(sectionItem.SectionId.ToString()));
                                                                _section_guid = Sanitization.Sanitize(sectionItem.SectionGuid);
                                                                _section_name = Sanitization.Sanitize(sectionItem.SectionName);
                                                                _section_description = Sanitization.Sanitize(sectionItem.SectionDescription);
                                                                _section_visibility = Sanitization.Sanitize(sectionItem.SectionVisibility);
                                                                _section_css_class = Sanitization.Sanitize(sectionItem.SectionCssClass);

                                                                //page error
                                                                if (_section_id_prev == 0)
                                                                {
                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.SectionIdRequired;
                                                                }
                                                                else if (string.IsNullOrEmpty(_section_name))
                                                                {
                                                                    _errorMessage = ApplicationConstants.ValidationMessages.SectionNameRequired;
                                                                }
                                                                else if (string.IsNullOrEmpty(_section_description))
                                                                {
                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.SectionDescriptionRequired;
                                                                }

                                                                if (!string.IsNullOrEmpty(_errorMessage))
                                                                {
                                                                    _success = false;
                                                                }
                                                                else
                                                                {
                                                                    _sqlQuery.Clear();
                                                                    _sqlQuery.Append("UPDATE `section_main` SET ");
                                                                    _sqlQuery.Append("`status` = 2");
                                                                    _sqlQuery.Append(" WHERE page_id = " + _page_id_prev + "");
                                                                    _sqlQuery.Append(";");

                                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                    _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                                                    if (_rowsAffected <= 0)
                                                                    {
                                                                        //_success = false;
                                                                        //_errorMessage = ApplicationConstants.ValidationMessages.SectionDataExist;
                                                                    }

                                                                    _sqlQuery.Clear();
                                                                    _sqlQuery.Append("INSERT INTO `section_main` ( ");
                                                                    _sqlQuery.Append("`section_guid`");
                                                                    _sqlQuery.Append(",`page_id`");
                                                                    _sqlQuery.Append(",`code`");
                                                                    _sqlQuery.Append(",`description`");
                                                                    _sqlQuery.Append(",`status`");
                                                                    _sqlQuery.Append(",`visibility`");
                                                                    _sqlQuery.Append(",`css_class`");
                                                                    _sqlQuery.Append(" ) VALUES ( ");
                                                                    _sqlQuery.Append("'" + _section_guid + "'");
                                                                    _sqlQuery.Append("," + _page_id + "");
                                                                    _sqlQuery.Append(",'" + _section_name + "'");
                                                                    _sqlQuery.Append(",'" + _section_description + "'");
                                                                    _sqlQuery.Append(",'1'");
                                                                    _sqlQuery.Append(",'" + _section_visibility + "'");
                                                                    _sqlQuery.Append(",'" + _section_css_class + "'");
                                                                    _sqlQuery.Append(" ); ");
                                                                    _sqlQuery.Append("SELECT LAST_INSERT_ID();");

                                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                    _section_id = (UInt64)_mySqlCommand.ExecuteScalar();

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
                                                                                _comp_id_prev = Convert.ToUInt64(Sanitization.Sanitize(componentItem.ComponentId.ToString()));
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
                                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.ComponentGuidRequired;
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
                                                                                    _sqlQuery.Append("UPDATE `components_main` SET ");
                                                                                    _sqlQuery.Append("`status` = 2");
                                                                                    _sqlQuery.Append(" WHERE section_id = " + _section_id_prev + "");
                                                                                    _sqlQuery.Append(";");

                                                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                    _rowsAffected = _mySqlCommand.ExecuteNonQuery();

                                                                                    if (_rowsAffected <= 0)
                                                                                    {
                                                                                        //_success = false;
                                                                                        //_errorMessage = ApplicationConstants.ValidationMessages.ComponentDataExist;
                                                                                    }
                                                                                    _sqlQuery.Clear();
                                                                                    _sqlQuery.Append("INSERT INTO `components_main` ( ");
                                                                                    _sqlQuery.Append("`section_id`");
                                                                                    _sqlQuery.Append(",`component_guid`");
                                                                                    _sqlQuery.Append(",`name`");
                                                                                    _sqlQuery.Append(",`cols`");
                                                                                    _sqlQuery.Append(",`rows`");
                                                                                    _sqlQuery.Append(",`x`");
                                                                                    _sqlQuery.Append(",`y`");
                                                                                    _sqlQuery.Append(",`status`");
                                                                                    _sqlQuery.Append(" ) VALUES ( ");
                                                                                    _sqlQuery.Append("" + _section_id + "");
                                                                                    _sqlQuery.Append(",'" + _comp_guid + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_name + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_cols + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_rows + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_x + "'");
                                                                                    _sqlQuery.Append(",'" + _comp_y + "'");
                                                                                    _sqlQuery.Append(",'1'");
                                                                                    _sqlQuery.Append(" ); ");
                                                                                    _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                    _comp_id = (UInt64)_mySqlCommand.ExecuteScalar();

                                                                                    if (_comp_id <= 0)
                                                                                    {
                                                                                        _success = false;
                                                                                    }

                                                                                    if (_success)
                                                                                    {
                                                                                        // Start Insert in Setting main
                                                                                        if (componentItem.Setting != null)
                                                                                        {
                                                                                            //Sanitize Input   
                                                                                            _setting_id_prev = Convert.ToUInt64(Sanitization.Sanitize(componentItem.Setting.SettingId.ToString()));
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
                                                                                            //page error
                                                                                            if (string.IsNullOrEmpty(_setting_height))
                                                                                            {
                                                                                                _setting_height = "0";
                                                                                            }
                                                                                            if (string.IsNullOrEmpty(_setting_width))
                                                                                            {
                                                                                                _setting_width = "0";
                                                                                            }

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
                                                                                            {
                                                                                                _success = false;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("UPDATE `settings_main` SET ");
                                                                                                _sqlQuery.Append("`status` = 2");
                                                                                                _sqlQuery.Append(" WHERE component_id = " + _comp_id_prev + "");
                                                                                                _sqlQuery.Append(";");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();

                                                                                                if (_rowsAffected <= 0)
                                                                                                {
                                                                                                    //	_success = false;
                                                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.SettingDataExist;
                                                                                                }

                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `settings_main` ( ");
                                                                                                _sqlQuery.Append("`component_id`");
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
                                                                                                _sqlQuery.Append(",`showingrid`");
                                                                                                _sqlQuery.Append(",`status`");
                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append("" + _comp_id + "");
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
                                                                                                _sqlQuery.Append(",'" + _setting_showingrid + "'");
                                                                                                _sqlQuery.Append(",'1'");
                                                                                                _sqlQuery.Append(" ); ");
                                                                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _setting_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                            }
                                                                                        }
                                                                                        // End Insert in Setting main

                                                                                        // Start Insert in validation main
                                                                                        if (componentItem.Validations != null)
                                                                                        {
                                                                                            //Sanitize Input 
                                                                                            _valid_id_prev = Convert.ToUInt64(Sanitization.Sanitize(componentItem.Validations.ValidationId.ToString()));
                                                                                            _valid_errormessage = Sanitization.Sanitize(componentItem.Validations.ValidationErrorMessage);
                                                                                            _valid_maxdate = Sanitization.Sanitize(componentItem.Validations.ValidationMaxDate);
                                                                                            _valid_maxlength = Sanitization.Sanitize(componentItem.Validations.ValidationMaxLength);
                                                                                            _valid_mindate = Sanitization.Sanitize(componentItem.Validations.ValidationMinDate);
                                                                                            _valid_minlength = Sanitization.Sanitize(componentItem.Validations.ValidationMinLength);
                                                                                            _valid_regex = Sanitization.Sanitize(componentItem.Validations.ValidationRegex);
                                                                                            _valid_required = Sanitization.Sanitize(componentItem.Validations.ValidationRequired);
                                                                                            _valid_unique = Sanitization.Sanitize(componentItem.Validations.ValidationUnique);
                                                                                            _valid_uniqueURL = Sanitization.Sanitize(componentItem.Validations.ValidationUniqueURL);
                                                                                            _valid_otp_varification = Sanitization.Sanitize(componentItem.Validations.ValidationOtpVerification);
                                                                                            _valid_allowed_extentions = Sanitization.Sanitize(componentItem.Validations.ValidationAllowedExtentions);
                                                                                            _valid_allowed_size = Sanitization.Sanitize(componentItem.Validations.ValidationAllowedSize);
                                                                                            _valid_maxwidth = Sanitization.Sanitize(componentItem.Validations.ValidationMaxWidth);
                                                                                            _valid_minwidth = Sanitization.Sanitize(componentItem.Validations.ValidationMinWidth);
                                                                                            _valid_maxheight = Sanitization.Sanitize(componentItem.Validations.ValidationMaxHeight);
                                                                                            _valid_minheight = Sanitization.Sanitize(componentItem.Validations.ValidationMinHeight);
                                                                                            _valid_allowed_file_count = Sanitization.Sanitize(componentItem.Validations.ValidationAllowedFileCount);

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



                                                                                            if (string.IsNullOrEmpty(_valid_maxlength))
                                                                                            {
                                                                                                //_valid_maxlength = "0";
                                                                                            }
                                                                                            if (string.IsNullOrEmpty(_valid_minlength))
                                                                                            {
                                                                                                //_valid_minlength = "0";
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
                                                                                            else if (string.IsNullOrEmpty(_valid_uniqueURL))
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
                                                                                            {
                                                                                                _success = false;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("UPDATE `validations_main` SET ");
                                                                                                _sqlQuery.Append("`status` = 2");
                                                                                                _sqlQuery.Append(" WHERE component_id = " + _comp_id_prev + "");
                                                                                                _sqlQuery.Append(";");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();

                                                                                                if (_rowsAffected <= 0)
                                                                                                {
                                                                                                    //	_success = false;
                                                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.ValidationDataExist;
                                                                                                }
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `validations_main` ( ");
                                                                                                _sqlQuery.Append("`component_id`");
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
                                                                                                _sqlQuery.Append("" + _comp_id + "");
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
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");

                                                                                                }
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
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");

                                                                                                }



                                                                                                if (!string.IsNullOrEmpty(_valid_allowed_file_count))
                                                                                                {
                                                                                                    _sqlQuery.Append(",'" + _valid_allowed_file_count + "'");
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    _sqlQuery.Append(",null");

                                                                                                }
                                                                                                _sqlQuery.Append(" ); ");
                                                                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _valid_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                            }
                                                                                        }
                                                                                        // End Insert in validation main

                                                                                        // Insert in data_object
                                                                                        if (componentItem.DataObjects != null)
                                                                                        {
                                                                                            //Sanitize Input 
                                                                                            _dataobject_id_prev = Convert.ToUInt64(Sanitization.Sanitize(componentItem.DataObjects.DataObjectId.ToString()));
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
                                                                                            {
                                                                                                _success = false;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("UPDATE `data_object` SET ");
                                                                                                _sqlQuery.Append("`status` = 2");
                                                                                                _sqlQuery.Append(" WHERE component_id = " + _comp_id_prev + "");
                                                                                                _sqlQuery.Append(";");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();

                                                                                                if (_rowsAffected <= 0)
                                                                                                {
                                                                                                    //	_success = false;
                                                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.DataObjectDataExist;
                                                                                                }

                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `data_object` ( ");
                                                                                                _sqlQuery.Append("`component_id`");
                                                                                                _sqlQuery.Append(",`end_point`");
                                                                                                _sqlQuery.Append(",`text_field`");
                                                                                                _sqlQuery.Append(",`value_field`");
                                                                                                _sqlQuery.Append(",`status`");
                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append("" + _comp_id + "");
                                                                                                _sqlQuery.Append(",'" + _dataobject_endpoint + "'");
                                                                                                _sqlQuery.Append(",'" + _dataobject_textfield + "'");
                                                                                                _sqlQuery.Append(",'" + _dataobject_valuefield + "'");
                                                                                                _sqlQuery.Append(",'1'");
                                                                                                _sqlQuery.Append(" ); ");
                                                                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _dataobject_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                            }

                                                                                        }
                                                                                        // End Insert in data object

                                                                                        // Insert in condition

                                                                                        if (componentItem.Conditions != null)
                                                                                        {
                                                                                            //Sanitize Input 
                                                                                            _condition_id_prev = Convert.ToUInt64(Sanitization.Sanitize(componentItem.Conditions.ConditionId.ToString()));
                                                                                            _condition_conditional = Sanitization.Sanitize(componentItem.Conditions.ConditionConditional);
                                                                                            _condition_eventType = Sanitization.Sanitize(componentItem.Conditions.ConditionEventType);
                                                                                            _condition_changeType = Sanitization.Sanitize(componentItem.Conditions.ConditionChangeType);
                                                                                            _condition_componentToChange = Sanitization.Sanitize(componentItem.Conditions.ConditionComponentToChange);
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
                                                                                            {
                                                                                                _success = false;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("UPDATE `condition_main` SET ");
                                                                                                _sqlQuery.Append("`status` = 2");
                                                                                                _sqlQuery.Append(" WHERE component_id = " + _comp_id_prev + "");
                                                                                                _sqlQuery.Append(";");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();

                                                                                                if (_rowsAffected <= 0)
                                                                                                {
                                                                                                    //	_success = false;
                                                                                                    //_errorMessage = ApplicationConstants.ValidationMessages.ConditionDataExist;
                                                                                                }

                                                                                                _sqlQuery.Clear();
                                                                                                _sqlQuery.Append("INSERT INTO `condition_main` ( ");
                                                                                                _sqlQuery.Append("`component_id`");
                                                                                                _sqlQuery.Append(",`condition_component_id`");
                                                                                                _sqlQuery.Append(",`conditional`");
                                                                                                _sqlQuery.Append(",`status`");
                                                                                                _sqlQuery.Append(",`eventType`");
                                                                                                _sqlQuery.Append(",`changeType`");
                                                                                                _sqlQuery.Append(",`componentToChange`");
                                                                                                _sqlQuery.Append(" ) VALUES ( ");
                                                                                                _sqlQuery.Append("" + _comp_id + "");
                                                                                                _sqlQuery.Append(",'" + _comp_guid + "'");
                                                                                                _sqlQuery.Append(",'" + _condition_conditional + "'");
                                                                                                _sqlQuery.Append(",'1'");
                                                                                                _sqlQuery.Append(",'" + _condition_eventType + "'");
                                                                                                _sqlQuery.Append(",'" + _condition_changeType + "'");
                                                                                                _sqlQuery.Append(",'" + _condition_componentToChange + "'");
                                                                                                _sqlQuery.Append(" ); ");
                                                                                                _sqlQuery.Append("select LAST_INSERT_ID();");

                                                                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                                                                _condition_id = (UInt64)_mySqlCommand.ExecuteScalar();
                                                                                            }

                                                                                        }
                                                                                        // End Insert in condition

                                                                                    }
                                                                                }
                                                                            }
                                                                            else
                                                                            {
                                                                                break;
                                                                            }
                                                                        }
                                                                        // end component loop 
                                                                    }
                                                                    // end component
                                                                }
                                                            }
                                                            else
                                                            {
                                                                break;
                                                            }
                                                        }
                                                        // end section loop 

                                                    }
                                                    // end section
                                                }
                                            }
                                            else
                                            {
                                                break;
                                            }
                                        }
                                        // end page loop
                                        // update form json
                                        if (_success)
                                        {

                                            (_jsonReturn, _functionReturn) = GenerateLayoutJsonById(_layout_id);
                                            if (_functionReturn.Status == false)
                                            {
                                                _success = false;

                                            }
                                            else
                                            {
                                                string _client_name = "test";
                                                _sqlQuery.Clear();
                                                _sqlQuery.Append("UPDATE `layout_main` SET ");
                                                _sqlQuery.Append("`client_name` = '" + _client_name + "'");
                                                _sqlQuery.Append(",`layout_json` = '" + _jsonReturn + "'");
                                                //_sqlQuery.Append(",`status` = " + status + "");
                                                //_sqlQuery.Append(",`datetimestamp` = UTC_TIMESTAMP ");
                                                _sqlQuery.Append(" WHERE id = " + _layout_id + "");
                                                _sqlQuery.Append(";");

                                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                                _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                                                if (_rowsAffected <= 0)
                                                {
                                                    _success = false;
                                                }
                                            }
                                        }
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


                            }
                            #endregion
                            if (_layout_type != "initiallayout")
                            {
                                if (_manTitle == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.TitleRequired;
                                }
                                if (_manFirstName == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.FirstNameRequired;
                                }
                                if (_manFatherName == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.FatherNameRequired;
                                }
                                if (_manDateOfBirth == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.DateOfBirthRequired;
                                }
                                if (_manMobile == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.TitleRequired;
                                }
                                if (_manEmail == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.EmailRequired;
                                }
                                if (_manPhoto == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.PhotoRequired;
                                }
                                if (_manSign == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.SignatureRequired;
                                }
                                if (_manGender == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.GenderRequired;
                                }
                                if (_manPH == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.PhysicalDisabilityRequired;
                                }
                                if (_manCityPrefrence1 == 0)
                                {
                                    _manSuccess = false;
                                    _errorMessage += ApplicationConstants.ValidationMessages.CityPriority1Required;
                                }

                                if (_manSuccess == false)
                                {
                                    _success = false;
                                }
                            }

                            if (_success)
                            {

                                _mytransaction.Commit();

                                _functionReturn.Status = true;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                                //_functionReturn.Message.Clear();

                                //_functionReturn.Message.Add(Constants.GenericMessages.RecordSavedSuccessfully);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;

                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordSavedSuccessfully, _methodName);

                            }
                            else
                            {
                                _mytransaction.Rollback();
                                //No Data // Need to send blank JSON object instead of error
                                //_functionReturn.Status = false;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                                //_functionReturn.Message.Add(Constants.GenericMessages.ErrorInSavingRecord);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;

                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                            }
                            //Cleanup
                            _mySqlCommand.Dispose();

                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction.Rollback();
                                _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                                //_functionReturn.Status = false;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                                //_functionReturn.Message.Add(ex.Message);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
                                //_functionReturn.Status = false;
                                //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                                //_functionReturn.Message.Add(exTran.Message);
                                //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
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
                        //_functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(ex.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
                        //_functionReturn.Status = false;
                        //_functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        //_functionReturn.Message.Add(exTran.Message);
                        //_functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, exTran.Message);
                    }

                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mytransaction.Dispose();
                    _mytransaction = null;
                    _mySqlCommand = null;
                    _mySqlConnection = null;
                    _sqlQuery = null;
                    _sqlConnectionString = string.Empty;
                }
            }
            return (_jsonReturn, _functionReturn);
        }

        /// <summary>
        /// Get Layout Json Async
        /// </summary>
        /// <param name="_id"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> LayoutJsonByIdAsync(UInt64 _id)
        {
            return Task.Run(() => LayoutJsonById(_id));
        }
        /// <summary>
        /// Get Layout Json
        /// </summary>
        /// <param name="_id"></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) LayoutJsonById(UInt64 _id)
        {
            #region Local Variables
            string _methodName = "F:Reg:GetLayoutJson";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            int _randamNumber = 0;
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

                    _sqlQuery.Append(" select id, layout_guid, name, description,status, layout_json ");
                    _sqlQuery.Append(" from layout_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" id = " + _id.ToString() + " and status = 1 ");
                    _sqlQuery.Append(" order by id; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    if (_dataTable.Rows.Count > 0)
                    {
                        _jsonReturn = _dataTable.Rows[0]["layout_json"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["layout_json"]);
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
        /// Genarate OTP Async
        /// </summary>
        /// <param name="_validationOTP"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<IFunctionReturn> ValidateOTPAsync(ValidationOTP _validationOTP)
        {
            return Task.Run(() => ValidateOTP(_validationOTP));
        }
        /// <summary>
        /// Genarate OTP Async
        /// </summary>
        /// <param name="_validationOTP"></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn ValidateOTP(ValidationOTP _validationOTP)
        {
            #region Local Variables
            string _methodName = "F:Reg:ValidateOTP";
            MySqlConnection _mySqlConnection = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlCommand _mySqlCommand = null;
            MySqlTransaction _mytransaction = null;
            string _sqlConnectionString = string.Empty;
            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            int _rowsAffected = 0;
            bool _success = true;
            DataSet _dataSet = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime;
            string _RegistrationGuid = string.Empty;
            string _emailId = string.Empty;
            string _otp = string.Empty;
            string _candidateGuid = string.Empty;
            //JSON data
            string _jsonReturn;
            #endregion
            #region OTP validate Sanitization and Validation

            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_validationOTP == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.OTPDataRequired; ;
                }
                else
                {
                    // Sanitize Input
                    _RegistrationGuid = Sanitization.Sanitize(_validationOTP.RegistrationGuid);
                    _emailId = Sanitization.Sanitize(_validationOTP.EmailID);
                    _otp = Sanitization.Sanitize(_validationOTP.OTP);
                    _candidateGuid = Sanitization.Sanitize(_validationOTP.CandidateGuid);

                    if (string.IsNullOrEmpty(_emailId))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.EmailRequired;
                    }
                    if (!ApplicationValidationFunctions.IsValidEmail(_emailId, true))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.InvaliidEmailId;
                    }
                    if (string.IsNullOrEmpty(_otp))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.OTPRequired;
                    }
                    if (string.IsNullOrEmpty(_candidateGuid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;
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
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
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
                        // Open connection;
                        _sqlconnStart = DateTime.Now;
                        _mySqlConnection.Open();
                        _sqlconnEnd = DateTime.Now;
                        _sqlconnTime = (_sqlconnEnd - _sqlconnStart);
                        _mySqlCommand.Connection = _mySqlConnection;
                        _mytransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                        _mySqlCommand.Connection = _mySqlConnection;
                        _mySqlCommand.Transaction = _mytransaction;
                        _sqlQuery = new StringBuilder();
                        //Check If code exists or not
                        _sqlQuery.Append(" select  otp  from  otp_validation where ");
                        _sqlQuery.Append(" status=1  and expiretime >  now() ");
                        _sqlQuery.Append(" and registration_guid='" + _RegistrationGuid + "'");
                        _sqlQuery.Append(" and email_id='" + _emailId + "'");
                        _sqlQuery.Append(" and otp='" + _otp + "';");

                        (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                        if (_dataSet.Tables[0].Rows.Count == 0)
                        {
                            _errorMessage = ApplicationConstants.GenericMessages.OTPWrongExpired;
                        }
                        else
                        {
                            _sqlQuery.Clear();
                            _sqlQuery.Append(" update registration_main_live set email_verified=1, modify_date=NOW()");
                            _sqlQuery.Append(" where candidate_guid='" + _candidateGuid + "';");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_rowsAffected <= 0)
                                _success = false;
                            if (_success)
                            {
                                _mytransaction?.Commit();
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.OtpVerified, GenericMessages.OTPValidateSuccessfully);
                                _functionReturn = CommonFunctions.AppSuccess(GenericMessages.OTPValidateSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                        }
                        if (!string.IsNullOrEmpty(_errorMessage))
                        {
                            _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                        }
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                        _jsonReturn = string.Empty;
                        _mytransaction?.Rollback();
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
        /// Genarate OTP Async
        /// </summary>
        /// <param name="_validationOTP"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<IFunctionReturn> GenerateOTPAsync(ValidationOTP _validationOTP)
        {
            return Task.Run(() => GenerateOTP(_validationOTP));
        }

        /// <summary>
        /// Genarate OTP Async
        /// </summary>
        /// <param name="_validationOTP"></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn GenerateOTP(ValidationOTP _validationOTP)
        {
            #region Local Variables
            string _methodName = "F:Reg:GenerateOTP";
            MySqlConnection _mySqlConnection = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlTransaction _mytransaction = null;
            MySqlCommand _mySqlCommand = null;

            string _sqlConnectionString = string.Empty;

            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            DataSet _dataSet = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime;
            string _RegistrationGuid = string.Empty;
            string _emailId = string.Empty;
            string _candidateGuid = string.Empty;
            string _email_subject = "";
            string _email_template = "";
            string _otp = "";
            string _mailMessage = "";
            string _smtp = "";
            string _smtp_port = "";
            string _sender_email = "";
            string _sender_name = "";
            string _verify_email_id = "";
            string _vpassword = "";
            string _admit_card_attach = "";
            string _config_type_name = "";
            string _sendergridapikey = "";
            string _adminserverurl = "";
            string _techserverurl = "";
            string _otpExpireTime = "";
            //JSON data
            string _jsonReturn;
            #endregion
            #region OTP Validation and Sanitization
            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_validationOTP == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.OTPDataRequired; ;
                }
                else
                {
                    // Sanitize Input
                    _RegistrationGuid = Sanitization.Sanitize(_validationOTP.RegistrationGuid);
                    _emailId = Sanitization.Sanitize(_validationOTP.EmailID);
                    _candidateGuid = Sanitization.Sanitize(_validationOTP.CandidateGuid);

                    if (string.IsNullOrEmpty(_emailId))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.EmailRequired;
                    }
                    if (!ApplicationValidationFunctions.IsValidEmail(_emailId, true))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.InvaliidEmailId;
                    }
                    if (string.IsNullOrEmpty(_RegistrationGuid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.RegistrationGUIDRequired;
                    }
                    if (string.IsNullOrEmpty(_candidateGuid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.RegistrationIDRequired;
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

            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
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

                        // Open connection;
                        _sqlconnStart = DateTime.Now;
                        _mySqlConnection.Open();
                        _sqlconnEnd = DateTime.Now;
                        _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                        _mytransaction = _mySqlConnection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                        _mySqlCommand.Connection = _mySqlConnection;
                        _mySqlCommand.Transaction = _mytransaction;

                        #region otp validation

                        _sqlQuery = new StringBuilder();
                        //Check If code exists or not
                        _sqlQuery.Append(" select smtp, smtp_port, sender_email, sender_name, verify_email_id, ");
                        _sqlQuery.Append(" password, email_subject, admit_card_attach,email_template, ");
                        _sqlQuery.Append("  config_type_name, sendergridapikey, adminserverurl, techserverurl, otp_expire_minutes ");
                        _sqlQuery.Append(" from email_setup ;");

                        (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                        if (_dataSet.Tables.Count == 0)
                        {
                            _mytransaction.Rollback();
                            _errorMessage = ApplicationConstants.GenericMessages.EmailSettingNotExist;
                        }
                        else
                        {
                            #region mail setting

                            IXCheckCommonLib.Models.EmailSettings _emailSettings = new IXCheckCommonLib.Models.EmailSettings();

                            foreach (DataRow row in _dataSet.Tables[0].Rows)
                            {
                                _email_subject = row["email_subject"] == DBNull.Value ? "" : Convert.ToString(row["email_subject"]);
                                _email_template = row["email_template"] == DBNull.Value ? "" : Convert.ToString(row["email_template"]);
                                _smtp = row["smtp"] == DBNull.Value ? "" : Convert.ToString(row["smtp"]);
                                _smtp_port = row["smtp_port"] == DBNull.Value ? "0" : Convert.ToString(row["smtp_port"]);
                                _sender_email = row["sender_email"] == DBNull.Value ? "" : Convert.ToString(row["sender_email"]);
                                _sender_name = row["sender_name"] == DBNull.Value ? "" : Convert.ToString(row["sender_name"]);
                                _verify_email_id = row["verify_email_id"] == DBNull.Value ? "" : Convert.ToString(row["verify_email_id"]);
                                _vpassword = row["password"] == DBNull.Value ? "" : Convert.ToString(row["password"]);
                                _admit_card_attach = row["admit_card_attach"] == DBNull.Value ? "" : Convert.ToString(row["admit_card_attach"]);
                                _config_type_name = row["config_type_name"] == DBNull.Value ? "email" : Convert.ToString(row["config_type_name"]);
                                _sendergridapikey = row["sendergridapikey"] == DBNull.Value ? "" : Convert.ToString(row["sendergridapikey"]);
                                _adminserverurl = row["adminserverurl"] == DBNull.Value ? "http://i2k2.com" : Convert.ToString(row["adminserverurl"]);
                                _techserverurl = row["techserverurl"] == DBNull.Value ? "http://i2k2.com" : Convert.ToString(row["techserverurl"]);
                                _otpExpireTime = row["otp_expire_minutes"] == DBNull.Value ? "15" : Convert.ToString(row["otp_expire_minutes"]);

                                _emailSettings.AdminServerURL = _adminserverurl;
                                _emailSettings.ConfigTypeName = _config_type_name;
                                _emailSettings.FromEmail = _sender_email;
                                _emailSettings.FromEmailName = _sender_name;
                                _emailSettings.MailServer = _smtp;
                                _emailSettings.PortNumber = Convert.ToInt32(_smtp_port);
                                _emailSettings.SendGridAPIKey = _sendergridapikey;
                                _emailSettings.TechServerURL = _techserverurl;
                                _emailSettings.Username = _verify_email_id;
                                _emailSettings.Password = _vpassword;
                            }
                            #endregion
                            Random r = new Random();
                            if (_env.IsDevelopment())
                                _otp = "1234";
                            else
                                _otp = Convert.ToString(r.Next(1000, 9999));

                            _mailMessage = "Dear Candidate,</br></br>";
                            _mailMessage = _mailMessage + " Your email verification code for the exam is given below. </br>" + _otp;
                            _mailMessage = _mailMessage + "</br></br> Regards, </br> Team Exam";

                            IXCheckCommonLib.Models.MailAddress _mailAddress = new IXCheckCommonLib.Models.MailAddress();
                            _mailAddress.Email = _emailId;
                            _mailAddress.Name = "Exam Project";
                            EmailParams _emailParams = new EmailParams();
                            _emailParams.MailTo.Add(_mailAddress);
                            _emailParams.MailSubject = _email_subject;
                            _emailParams.MailBody = _mailMessage;
                            Task<bool> mailSent = _emailFunctions.SendMailAsync(_emailParams, _emailSettings);
                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Clear();
                            _sqlQuery.Append(" update otp_validation set status=0 ");
                            _sqlQuery.Append(" where registration_guid='" + _RegistrationGuid + "' ");
                            _sqlQuery.Append(" and  email_id='" + _emailId + "' ");
                            _sqlQuery.Append(" and  candidate_guid='" + _candidateGuid + "'; ");

                            _sqlQuery.Append(" INSERT INTO otp_validation ( ");
                            _sqlQuery.Append(" `registration_guid` ");
                            _sqlQuery.Append(" ,`email_id` ");
                            _sqlQuery.Append(" ,`otp` ");
                            _sqlQuery.Append(" ,`candidate_guid` ");
                            _sqlQuery.Append(" ,`expiretime` ");
                            _sqlQuery.Append(" ,`status` ");
                            _sqlQuery.Append(" ) VALUES ( ");
                            _sqlQuery.Append("'" + _RegistrationGuid + "'");
                            _sqlQuery.Append(" ,'" + _emailId + "' ");
                            _sqlQuery.Append(" ,'" + _otp + "' ");
                            _sqlQuery.Append(" ,'" + _candidateGuid + "' ");
                            _sqlQuery.Append(" ,DATE_ADD(NOW(), INTERVAL " + _otpExpireTime + " minute) ");
                            _sqlQuery.Append(" ,'1' ");
                            _sqlQuery.Append(" ); ");
                            _sqlQuery.Append(" SELECT LAST_INSERT_ID(); ");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            int _batchId = Convert.ToInt32(_mySqlCommand.ExecuteScalar());

                            if (_batchId > 0)
                            {
                                _mytransaction?.Commit();
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, ApplicationConstants.PaymentActivityTypes.OtpResend, ApplicationConstants.GenericMessages.OTPSendSuccessfully);
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.OTPSendSuccessfully, _methodName);
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                if (string.IsNullOrEmpty(_errorMessage))
                                    _errorMessage = Constants.GenericMessages.ErrorInSavingRecord;
                            }
                            _mySqlCommand?.Dispose();
                            #endregion
                        }
                        if (!string.IsNullOrEmpty(_errorMessage))
                        {
                            _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                        }
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
        /// Get Candidate Reg Id By Guid
        /// </summary>
        /// <param name="_candidateGuid"></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> CandidateJsonByGuidAsync(string _candidateGuid)
        {
            return Task.Run(() => CandidateJsonByGuid(_candidateGuid));
        }

        private (string jsonReturn, IFunctionReturn functionReturn) CandidateJsonByGuid(string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "F:Registration:CandidateJsonByGuid";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            bool _success = true;
            //JSON data
            string _jsonReturn = string.Empty;
            string _errorMessage = string.Empty;
            DataTable _dataTable = new DataTable();
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;

            #endregion
            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    if (string.IsNullOrEmpty(Sanitization.Sanitize(_candidateGuid)))
                        _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;
                    if (!string.IsNullOrEmpty(_errorMessage))
                    {
                        _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                        _success = false;
                    }
                    else
                    {
                        _sqlQuery = new StringBuilder();
                        _sqlQuery.Append(" SELECT candidate_guid ");
                        _sqlQuery.Append(" FROM registration_main_live ");
                        _sqlQuery.Append(" WHERE candidate_guid='" + _candidateGuid + "';");
                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                        if (_dataTable.Rows.Count > 0)
                        {
                            _candidateGuid = _dataTable.Rows[0]["candidate_guid"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["candidate_guid"]);
                            (_jsonReturn, _functionReturn) = this.CandidateJsonById(_candidateGuid);
                        }
                        else
                        {
                            _errorMessage = ApplicationConstants.ValidationMessages.InvalidGuid;
                            _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                            _success = false;
                        }
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

        private (string jsonReturn, IFunctionReturn functionReturn) CandidateJsonById(string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "F:Reg:CandidateJsonById";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            int _randamNumber = 0;
            //JSON data
            DataTable _dataTable;
            DataTable _dataTablePage;
            DataTable _dataTableSection;
            DataTable _dataTableComps;
            DataTable _dataTableSettings;
            DataTable _dataTableData;
            DataTable _dataTableData_object;
            DataTable _dataTableValidations;
            DataTable _dataTableCondition;
            TimeSpan? _sqlconnTime;
            TimeSpan? _queryTime;
            DataTable _dataTableAiSetting;
            DataTable _dataTableAiColor;
            DataTable _dataTableSubComponents;
            string _jsonReturn = string.Empty;
            UInt64 _layout_id = 0;
            string _layout_guid = "";
            string _layout_name = "";
            string _layout_description = "";
            string _layout_code = "";
            string _layout_exam_type = "";
            string _layout_page_name = "";
            string _layout_exam_type_guid = "";
            string _layout_status = "";
            string _layout_number = "";
            string _registrationGuid = "";
            UInt64 _page_id = 0;
            string _page_guid = "";
            string _page_name = "";
            string _page_description = "";
            string _page_status = "";
            UInt64 _section_id = 0;
            string _section_guid = "";
            string _section_name = "";
            string _section_description = "";
            string _section_status = "";
            string _section_visibility = "";
            string _section_css_class = "";
            UInt64 _comp_id = 0;
            string _comp_guid = "";
            string _comp_name = "";
            UInt64 _comp_cols = 0;
            UInt64 _comp_rows = 0;
            UInt64 _comp_x = 0;
            UInt64 _comp_y = 0;
            string _comp_status = "";
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
            string _setting_dataGetEndpoint = "";
            string _setting_dataDeleteEndpoint = "";
            string _setting_defaultValue = "";
            string _setting_dataParameter = "";
            bool _setting_allowTextUppercase = false;

            string _setting_status = "";
            bool _setting_showingrid = false;
            bool _setting_isdisabled = false;
            bool _setting_isoutput = false;
            UInt64 _data_id = 0;
            string _data_value = "";
            string _data_status = "";
            string _image_value = "";
            UInt64 _dataobject_id = 0;
            string _dataobject_endpoint = "";
            string _dataobject_textfield = "";
            string _dataobject_valuefield = "";
            string _dataobject_status = "";
            UInt64 _valid_id = 0;
            bool _valid_required = false;
            UInt64? _valid_maxlength;
            UInt64? _valid_minlength;
            string _valid_regex = "";
            string _valid_errormessage = "";
            string _valid_mindate = "";
            string _valid_maxdate = "";
            string _valid_status = "";
            bool _valid_unique = false;
            string _valid_uniqueURL = "";
            string _valid_allowed_extentions = "";
            UInt64? _valid_allowed_size;
            UInt64? _valid_maxwidth;
            UInt64? _valid_minwidth;
            UInt64? _valid_maxheight;
            UInt64? _valid_minheight;
            UInt64? _valid_allowed_file_count;
            bool _valid_otp_varification = false;
            DataSet _dataSet = null;
            UInt64 _condition_id = 0;
            string _condition_componentid = "";
            string _condition_componentguid = "";
            string _condition_conditional = "";
            string _condition_status = "";
            string _condition_eventType = "";
            string _condition_changeType = "";
            string _condition_componentToChange = "";
            DateTime _loopStart;
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            UInt64 _sub_comp_id = 0;
            string _sub_comp_name = "";
            string _sub_comp_code = "";
            string _sub_comp_value = "";
            string _sub_comp_group_name = "";
            UInt64 _sub_setting_id = 0;
            string _sub_setting_measurementType = "";
            string _sub_setting_height = "";
            string _sub_setting_width = "";
            string _sub_setting_labelposition = "";
            string _sub_setting_type = "";
            string _sub_setting_label = "";
            string _sub_setting_description = "";
            string _sub_setting_input = "";
            string _sub_setting_placeholder = "";
            string _sub_setting_endpoint = "";
            string _sub_setting_defaultValue = "";
            string _sub_setting_dataParameter = "";
            bool _sub_setting_showingrid = false;
            bool _sub_setting_isdisabled = false;
            bool _sub_setting_isoutput = false;
            bool _sub_setting_visibility = false;
            bool _sub_setting_required = false;
            string _sub_setting_status = "";
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

                    _sqlQuery.Append("SELECT LM.id, LM.layout_guid, LM.name, LM.description, LM.status,RTL.registration_guid, ");
                    _sqlQuery.Append(" LM.code, LM.exam_type, LM.exam_type_guid, LM.page_name, LM.number, DSM.candidate_guid ");
                    _sqlQuery.Append(" FROM layout_main LM ");
                    _sqlQuery.Append(" JOIN data_save_main_live DSM ON LM.id=DSM.form_id ");
                    _sqlQuery.Append(" JOIN registration_to_layout RTL ON RTL.layout_id=LM.id ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" DSM.candidate_guid = '" + _candidateGuid + "'");
                    _sqlQuery.Append(" ORDER BY LM.id LIMIT 1;");

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    // Start Main Object Json
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;

                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Layout);
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
                            _layout_id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _layout_guid = row["layout_guid"] == DBNull.Value ? "" : Convert.ToString(row["layout_guid"]);
                            _layout_name = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);
                            _layout_description = row["description"] == DBNull.Value ? "" : Convert.ToString(row["description"]);
                            _layout_status = row["status"] == DBNull.Value ? "" : Convert.ToString(row["status"]);
                            _layout_code = row["code"] == DBNull.Value ? "" : Convert.ToString(row["code"]);
                            _layout_exam_type = row["exam_type"] == DBNull.Value ? "" : Convert.ToString(row["exam_type"]);
                            _layout_exam_type_guid = row["exam_type_guid"] == DBNull.Value ? "" : Convert.ToString(row["exam_type_guid"]);
                            _layout_page_name = row["page_name"] == DBNull.Value ? "" : Convert.ToString(row["page_name"]);
                            _layout_number = row["number"] == DBNull.Value ? "" : Convert.ToString(row["number"]);
                            _registrationGuid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);

                            _writer.WriteStartObject();

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutId);
                            _writer.WriteValue(_layout_id.ToString());
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutGuid);
                            _writer.WriteValue(_layout_guid);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutName);
                            _writer.WriteValue(_layout_name);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutDescription);
                            _writer.WriteValue(_layout_description);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutCode);
                            _writer.WriteValue(_layout_code);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutExamType);
                            _writer.WriteValue(_layout_exam_type);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutExamTypeGuid);
                            _writer.WriteValue(_layout_exam_type_guid);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutPageName);
                            _writer.WriteValue(_layout_page_name);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutNumber);
                            _writer.WriteValue(_layout_number);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutRegistrationGuid);
                            _writer.WriteValue(_registrationGuid);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.CandidateGuid);
                            _writer.WriteValue(_candidateGuid);

                            // Start Page Json
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pages);
                            _writer.WriteStartArray();

                            _sqlQuery.Clear();
                            _sqlQuery.Append("SELECT id, page_guid, code, description,status ");
                            _sqlQuery.Append(" FROM pages_main ");
                            _sqlQuery.Append(" WHERE ");
                            _sqlQuery.Append(" form_id =" + _layout_id.ToString() + " AND status = 1 ");
                            _sqlQuery.Append(" ORDER BY id; ");

                            //Call Function
                            (_functionReturn, _dataTablePage, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                            if (_dataTablePage.Rows.Count <= 0)
                            {
                                _writer.WriteStartObject();
                                _writer.WriteEndObject();
                            }
                            else
                            {
                                foreach (DataRow rowpage in _dataTablePage.Rows)
                                {
                                    //check NULLS and DATA TYPE here for returned column values
                                    _page_id = rowpage["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowpage["id"]);
                                    _page_guid = rowpage["page_guid"] == DBNull.Value ? "" : Convert.ToString(rowpage["page_guid"]);
                                    _page_name = rowpage["code"] == DBNull.Value ? "" : Convert.ToString(rowpage["code"]);
                                    _page_description = rowpage["description"] == DBNull.Value ? "" : Convert.ToString(rowpage["description"]);
                                    _page_status = rowpage["status"] == DBNull.Value ? "" : Convert.ToString(rowpage["status"]);

                                    _writer.WriteStartObject();

                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageId);
                                    _writer.WriteValue(_page_id.ToString());
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageGuid); _writer.WriteValue(_page_guid);
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageName); _writer.WriteValue(_page_name);
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageDescription); _writer.WriteValue(_page_description);
                                    //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageStatus, _page_status);

                                    // Start Section Json

                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Sections);
                                    _writer.WriteStartArray();
                                    //_writer.WriteStartArray();

                                    _sqlQuery = new StringBuilder();
                                    _sqlQuery.Append("SELECT id, section_guid, code, description,status,visibility,css_class ");
                                    _sqlQuery.Append(" FROM section_main ");
                                    _sqlQuery.Append(" WHERE ");
                                    _sqlQuery.Append(" page_id = " + _page_id.ToString() + " AND status = 1 ");
                                    _sqlQuery.Append(" ORDER BY page_id; ");

                                    //Call Function
                                    (_functionReturn, _dataTableSection, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                    if (_dataTableSection.Rows.Count <= 0)
                                    {
                                        _writer.WriteStartObject();
                                        _writer.WriteEndObject();
                                    }
                                    else
                                    {
                                        foreach (DataRow rowsection in _dataTableSection.Rows)
                                        {
                                            //check NULLS and DATA TYPE here for returned column values
                                            _section_id = rowsection["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowsection["id"]);
                                            _section_guid = rowsection["section_guid"] == DBNull.Value ? "" : Convert.ToString(rowsection["section_guid"]);
                                            _section_name = rowsection["code"] == DBNull.Value ? "" : Convert.ToString(rowsection["code"]);
                                            _section_description = rowsection["description"] == DBNull.Value ? "" : Convert.ToString(rowsection["description"]);
                                            _section_status = rowsection["status"] == DBNull.Value ? "" : Convert.ToString(rowsection["status"]);
                                            _section_visibility = rowsection["visibility"] == DBNull.Value ? "" : Convert.ToString(rowsection["visibility"]);
                                            _section_css_class = rowsection["css_class"] == DBNull.Value ? "" : Convert.ToString(rowsection["css_class"]);
                                            _writer.WriteStartObject();

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionId); _writer.WriteValue(_section_id.ToString());
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionGuid); _writer.WriteValue(_section_guid);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionName); _writer.WriteValue(_section_name);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionDescription); _writer.WriteValue(_section_description);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionVisibility); _writer.WriteValue(_section_visibility);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionCssClass); _writer.WriteValue(_section_css_class);
                                            //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionStatus, _section_status);

                                            // Start Component Json

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Components);
                                            _writer.WriteStartArray();

                                            _sqlQuery.Clear();
                                            _sqlQuery.Append("SELECT id, component_guid, cols, `rows`, x, y, name, status ");
                                            _sqlQuery.Append(" FROM components_main ");
                                            _sqlQuery.Append(" WHERE ");
                                            _sqlQuery.Append(" section_id = " + _section_id.ToString() + " AND status = 1 ");
                                            _sqlQuery.Append(" ORDER BY y,x ;");

                                            //Call Function
                                            (_functionReturn, _dataTableComps, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                            if (_dataTableComps.Rows.Count <= 0)
                                            {
                                                _writer.WriteStartObject();
                                                _writer.WriteEndObject();
                                            }
                                            else
                                            {
                                                foreach (DataRow rowtablesComp in _dataTableComps.Rows)
                                                {
                                                    //check NULLS and DATA TYPE here for returned column values
                                                    _comp_id = rowtablesComp["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["id"]);
                                                    _comp_guid = rowtablesComp["component_guid"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["component_guid"]);
                                                    _comp_name = rowtablesComp["name"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["name"]);
                                                    _comp_cols = rowtablesComp["cols"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["cols"]);
                                                    _comp_rows = rowtablesComp["rows"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["rows"]);
                                                    _comp_x = rowtablesComp["x"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["x"]);
                                                    _comp_y = rowtablesComp["y"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["y"]);
                                                    _comp_status = rowtablesComp["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["status"]);

                                                    _writer.WriteStartObject();

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentId);
                                                    _writer.WriteValue(_comp_id.ToString());
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentGuid);
                                                    _writer.WriteValue(_comp_guid);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentName);
                                                    _writer.WriteValue(_comp_name);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentCols);
                                                    _writer.WriteValue(_comp_cols);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentRows);
                                                    _writer.WriteValue(_comp_rows);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentX); _writer.WriteValue(_comp_x);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentY); _writer.WriteValue(_comp_y);
                                                    //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentStatus, _comp_status);

                                                    // Start Setting Json

                                                    /*AI settings starts*/
                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append("SELECT id,comp_id,algo_guid,algo_url,color_url,validation_url,color_percent_min,color_percent_max,face_percent_min,face_percent_max,status");
                                                    _sqlQuery.Append(" FROM reg_components_ai_setting WHERE comp_id=" + _comp_id + ";");
                                                    (_functionReturn, _dataTableAiSetting, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AiParameters);
                                                    if (_dataTableAiSetting.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow _row in _dataTableAiSetting.Rows)
                                                        {
                                                            _writer.WriteStartObject();
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                                                            _writer.WriteValue(_row["id"] == DBNull.Value ? "" : Convert.ToString(_row["id"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentId);
                                                            _writer.WriteValue(_row["comp_id"] == DBNull.Value ? "" : Convert.ToString(_row["comp_id"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AlgoGuid);
                                                            _writer.WriteValue(_row["algo_guid"] == DBNull.Value ? "" : Convert.ToString(_row["algo_guid"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AlgoURL);
                                                            _writer.WriteValue(_row["algo_url"] == DBNull.Value ? "" : Convert.ToString(_row["algo_url"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorURL);
                                                            _writer.WriteValue(_row["color_url"] == DBNull.Value ? "" : Convert.ToString(_row["color_url"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationURL);
                                                            _writer.WriteValue(_row["validation_url"] == DBNull.Value ? "" : Convert.ToString(_row["validation_url"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorPercentMin);
                                                            _writer.WriteValue(_row["color_percent_min"] == DBNull.Value ? "" : Convert.ToString(_row["color_percent_min"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorPercentMax);
                                                            _writer.WriteValue(_row["color_percent_max"] == DBNull.Value ? "" : Convert.ToString(_row["color_percent_max"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FacePercentMin);
                                                            _writer.WriteValue(_row["face_percent_min"] == DBNull.Value ? "" : Convert.ToString(_row["face_percent_min"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.FacePercentMax);
                                                            _writer.WriteValue(_row["face_percent_max"] == DBNull.Value ? "" : Convert.ToString(_row["face_percent_max"]));
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                            _writer.WriteValue(_row["status"] == DBNull.Value ? "" : Convert.ToString(_row["status"]));

                                                            _sqlQuery.Clear();
                                                            _sqlQuery.Append("SELECT id,reg_components_ai_setting_id,color_guid,blue_percent_min,blue_percent_max,green_percent_min,green_percent_max,red_percent_min,red_percent_max,status");
                                                            _sqlQuery.Append(" FROM reg_components_ai_color WHERE reg_components_ai_setting_id=" + _row["id"] + ";");
                                                            (_functionReturn, _dataTableAiColor, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Colors);
                                                            if (_dataTableAiColor.Rows.Count <= 0)
                                                            {
                                                                _writer.WriteStartArray();
                                                                _writer.WriteStartObject();
                                                                _writer.WriteEndObject();
                                                                _writer.WriteEndArray();
                                                            }
                                                            else
                                                            {
                                                                _writer.WriteStartArray();
                                                                foreach (DataRow _color in _dataTableAiColor.Rows)
                                                                {
                                                                    _writer.WriteStartObject();
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Id);
                                                                    _writer.WriteValue(_color["id"] == DBNull.Value ? "" : Convert.ToString(_color["id"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.RegComponentAiSettingId);
                                                                    _writer.WriteValue(_color["reg_components_ai_setting_id"] == DBNull.Value ? "" : Convert.ToString(_color["reg_components_ai_setting_id"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ColorGuid);
                                                                    _writer.WriteValue(_color["color_guid"] == DBNull.Value ? "" : Convert.ToString(_color["color_guid"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BlueMin);
                                                                    _writer.WriteValue(_color["blue_percent_min"] == DBNull.Value ? "" : Convert.ToString(_color["blue_percent_min"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.BlueMax);
                                                                    _writer.WriteValue(_color["blue_percent_max"] == DBNull.Value ? "" : Convert.ToString(_color["blue_percent_max"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GreenMin);
                                                                    _writer.WriteValue(_color["green_percent_min"] == DBNull.Value ? "" : Convert.ToString(_color["green_percent_min"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.GreenMax);
                                                                    _writer.WriteValue(_color["green_percent_max"] == DBNull.Value ? "" : Convert.ToString(_color["green_percent_max"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.RedMin);
                                                                    _writer.WriteValue(_color["red_percent_min"] == DBNull.Value ? "" : Convert.ToString(_color["red_percent_min"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.RedMax);
                                                                    _writer.WriteValue(_color["red_percent_max"] == DBNull.Value ? "" : Convert.ToString(_color["red_percent_max"]));
                                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                                    _writer.WriteValue(_color["status"] == DBNull.Value ? "" : Convert.ToString(_color["status"]));
                                                                    _writer.WriteEndObject();
                                                                }
                                                                _writer.WriteEndArray();
                                                            }
                                                            _writer.WriteEndObject();
                                                        }
                                                    }
                                                    /*AI settings ends*/


                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Settings);

                                                    _sqlQuery.Clear();
                                                    _sqlQuery.Append("SELECT id,measurementType,height,width, labelposition, type, label, description,");
                                                    _sqlQuery.Append("input,placeholder,endPoint, defaultValue, status, dataParameter, showingrid, isdisabled, isoutput,dataGetEndpoint,dataDeleteEndpoint, allowTextUppercase ");
                                                    _sqlQuery.Append(" FROM settings_main ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" ORDER BY id; ");

                                                    //_sqlQuery.Clear();
                                                    _sqlQuery.Append("SELECT id, datavalue as data,imagevalue, status ");
                                                    _sqlQuery.Append(" FROM data_save_main_live ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" comp_id = " + _comp_id.ToString() + " AND status = 1 and candidate_guid='" + Sanitization.Sanitize(_candidateGuid) + "'");
                                                    //sqlQuery.Append(" comp_id = " + comp_id.ToString() + " and reg_id = " + _reg_id.ToString());
                                                    _sqlQuery.Append(" ORDER BY id; ");

                                                    _sqlQuery.Append("SELECT  id, end_point, text_field, value_field, status ");
                                                    _sqlQuery.Append(" FROM data_object ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" ORDER BY id; ");

                                                    _sqlQuery.Append("SELECT id, required, maxlength, minlength, mindate, maxdate, regex , ");
                                                    _sqlQuery.Append(" errormessage, status, isunique, uniqueURL, allowedExtentions, allowedSize, maxheight, minheight,");
                                                    _sqlQuery.Append(" maxwidth, minwidth, allowedFileCount ,otp_varification  ");
                                                    _sqlQuery.Append(" FROM validations_main ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" ORDER BY id; ");

                                                    _sqlQuery.Append("SELECT  id, component_id, condition_component_id, conditional, status, eventType, changeType, componentToChange,sectionToShowHide");
                                                    _sqlQuery.Append(" FROM condition_main ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" ORDER BY id; ");

                                                    //Call Function

                                                    (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                                                    // DataRow row = _dataSet.Tables[0].Rows[0];
                                                    _dataTableSettings = _dataSet.Tables[0];
                                                    _dataTableData = _dataSet.Tables[1];

                                                    // (_functionReturn, _dataTableSettings, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableSettings.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesSetting in _dataTableSettings.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _setting_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                            _setting_measurementType = rowtablesSetting["measurementType"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["measurementType"]);
                                                            _setting_height = rowtablesSetting["height"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["height"]);
                                                            _setting_width = rowtablesSetting["width"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["width"]);
                                                            _setting_labelposition = rowtablesSetting["labelposition"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["labelposition"]);
                                                            _setting_type = rowtablesSetting["type"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["type"]);
                                                            _setting_label = rowtablesSetting["label"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["label"]);
                                                            _setting_description = rowtablesSetting["description"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["description"]);
                                                            _setting_input = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                            _setting_placeholder = rowtablesSetting["placeholder"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["placeholder"]);
                                                            _setting_endpoint = rowtablesSetting["endPoint"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["endPoint"]);
                                                            _setting_dataGetEndpoint = rowtablesSetting["dataGetEndpoint"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataGetEndpoint"]);
                                                            _setting_dataDeleteEndpoint = rowtablesSetting["dataDeleteEndpoint"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataDeleteEndpoint"]);
                                                            _setting_allowTextUppercase = rowtablesSetting["dataDeleteEndpoint"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["allowTextUppercase"]);

                                                            if (_dataTableData.Rows.Count > 0)
                                                            {
                                                                if (_comp_name.ToLower() == "ngxixcheckregtypelist")
                                                                {
                                                                    _setting_defaultValue = _dataTableData.Rows[0]["data"] == DBNull.Value ? "" : Convert.ToString(_dataTableData.Rows[0]["data"]);
                                                                    if (_setting_defaultValue != "" && _setting_defaultValue != null)
                                                                    {
                                                                        string _regType = "";
                                                                        string[] _exam_to_reg_type_guid = _setting_defaultValue.Split("|");
                                                                        foreach (string item in _exam_to_reg_type_guid)
                                                                        {
                                                                            _regType = _regType + item.Split("~")[0] + "~";
                                                                        }
                                                                        _setting_defaultValue = _regType.Remove(_regType.Length - 1);
                                                                    }
                                                                    else
                                                                    {
                                                                        _setting_defaultValue = "";
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    _setting_defaultValue = _dataTableData.Rows[0]["data"] == DBNull.Value ? "" : Convert.ToString(_dataTableData.Rows[0]["data"]);
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _setting_defaultValue = string.Empty;
                                                            }
                                                            _setting_status = rowtablesSetting["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["status"]);
                                                            _setting_dataParameter = rowtablesSetting["dataParameter"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataParameter"]);
                                                            _setting_showingrid = rowtablesSetting["showingrid"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["showingrid"]);

                                                            _setting_isdisabled = rowtablesSetting["isdisabled"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isdisabled"]);
                                                            _setting_isoutput = rowtablesSetting["isoutput"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isoutput"]);

                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingId);
                                                            _writer.WriteValue(_setting_id.ToString());
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingMeasurementType);
                                                            _writer.WriteValue(_setting_measurementType);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingHeight);
                                                            _writer.WriteValue(_setting_height);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingWidth);
                                                            _writer.WriteValue(_setting_width);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabelposition);
                                                            _writer.WriteValue(_setting_labelposition);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingType);
                                                            _writer.WriteValue(_setting_type);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabel);
                                                            _writer.WriteValue(_setting_label);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDescription);
                                                            _writer.WriteValue(_setting_description);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingInput);
                                                            _writer.WriteValue(_setting_input);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingPlaceholder);
                                                            _writer.WriteValue(_setting_placeholder);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingEndPoint);
                                                            _writer.WriteValue(_setting_endpoint);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDefaultValue);
                                                            _writer.WriteValue(_setting_defaultValue);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDataParameter);
                                                            _writer.WriteValue(_setting_dataParameter);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingShowInGrid);
                                                            _writer.WriteValue(_setting_showingrid);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsDisabled);
                                                            _writer.WriteValue(_setting_isdisabled);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsOutput);
                                                            _writer.WriteValue(_setting_isoutput);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDataGetEndpoint);
                                                            _writer.WriteValue(_setting_dataGetEndpoint);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDataDeleteEndpoint);
                                                            _writer.WriteValue(_setting_dataDeleteEndpoint);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingAllowTextUppercase);
                                                            _writer.WriteValue(_setting_allowTextUppercase);

                                                            _writer.WriteEndObject();

                                                            break;
                                                        }
                                                    }
                                                    // End Settings Json

                                                    // Start Data Json

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Data);

                                                    _dataTableData = _dataSet.Tables[1];
                                                    if (_dataTableData.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesData in _dataTableData.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _data_id = rowtablesData["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesData["id"]);
                                                            if (_comp_name.ToLower() == "ngxixcheckregtypelist")
                                                            {
                                                                _data_value = rowtablesData["data"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["data"]);
                                                                if (_data_value != "" && _data_value != null)
                                                                {
                                                                    string _regType = "";
                                                                    string[] _exam_to_reg_type_guid = _data_value.Split("|");
                                                                    foreach (string item in _exam_to_reg_type_guid)
                                                                    {
                                                                        _regType = _regType + item.Split("~")[0] + "~";
                                                                    }
                                                                    _data_value = _regType.Remove(_regType.Length - 1);
                                                                }
                                                                else
                                                                {
                                                                    _data_value = "";
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _data_value = rowtablesData["data"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["data"]);
                                                            }
                                                            _data_status = rowtablesData["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["status"]);
                                                            _image_value = rowtablesData["imagevalue"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["imagevalue"]);
                                                            if (_comp_name == "NgxIxcheckPhotouploaderAi")
                                                            {
                                                                _image_value = _image_value.Split('~')[0];
                                                            }
                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataId);
                                                            _writer.WriteValue(_data_id.ToString());
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataValue);
                                                            _writer.WriteValue(_data_value);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ImageValue);
                                                            _writer.WriteValue(_image_value);
                                                            //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataStatus, _data_status);

                                                            _writer.WriteEndObject();
                                                            break;
                                                        }
                                                    }
                                                    // End Data Json

                                                    // Start Data_Object Json

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataObjects);
                                                    //Call Function

                                                    _dataTableData_object = _dataSet.Tables[2];
                                                    //(_functionReturn, _dataTableData_object, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableData_object.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesData_object in _dataTableData_object.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _dataobject_id = rowtablesData_object["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesData_object["id"]);
                                                            _dataobject_endpoint = rowtablesData_object["end_point"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["end_point"]);
                                                            _dataobject_textfield = rowtablesData_object["text_field"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["text_field"]);
                                                            _dataobject_valuefield = rowtablesData_object["value_field"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["value_field"]);
                                                            _dataobject_status = rowtablesData_object["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesData_object["status"]);

                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataObjectId);
                                                            _writer.WriteValue(_dataobject_id.ToString());
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataObjectEndPoint);
                                                            _writer.WriteValue(_dataobject_endpoint);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataObjectTextField);
                                                            _writer.WriteValue(_dataobject_textfield);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataObjectValueField);
                                                            _writer.WriteValue(_dataobject_valuefield);
                                                            //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataObjectStatus);_writer.WriteValue (_dataobject_status);

                                                            _writer.WriteEndObject();

                                                            break;
                                                        }
                                                    }
                                                    // End Data_Object Json

                                                    // Start Validation Json

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Validations);

                                                    //Call Function
                                                    _dataTableValidations = _dataSet.Tables[3];
                                                    //(_functionReturn, _dataTableValidations, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableValidations.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesValidation in _dataTableValidations.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _valid_id = rowtablesValidation["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesValidation["id"]);
                                                            _valid_required = rowtablesValidation["required"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["required"]);

                                                            if (string.IsNullOrEmpty(rowtablesValidation["maxlength"].ToString()))
                                                            {
                                                                _valid_maxlength = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_maxlength = Convert.ToUInt64(rowtablesValidation["maxlength"]);
                                                            }

                                                            if (string.IsNullOrEmpty(rowtablesValidation["minlength"].ToString()))
                                                            {
                                                                _valid_minlength = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_minlength = Convert.ToUInt64(rowtablesValidation["minlength"]);
                                                            }

                                                            if (string.IsNullOrEmpty(rowtablesValidation["maxheight"].ToString()))
                                                            {
                                                                _valid_maxheight = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_maxheight = Convert.ToUInt64(rowtablesValidation["maxheight"]);
                                                            }

                                                            if (string.IsNullOrEmpty(rowtablesValidation["minheight"].ToString()))
                                                            {
                                                                _valid_minheight = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_minheight = Convert.ToUInt64(rowtablesValidation["minheight"]);
                                                            }

                                                            if (string.IsNullOrEmpty(rowtablesValidation["maxwidth"].ToString()))
                                                            {
                                                                _valid_maxwidth = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_maxwidth = Convert.ToUInt64(rowtablesValidation["maxwidth"]);
                                                            }

                                                            if (string.IsNullOrEmpty(rowtablesValidation["minwidth"].ToString()))
                                                            {
                                                                _valid_minwidth = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_minwidth = Convert.ToUInt64(rowtablesValidation["minwidth"]);
                                                            }
                                                            if (string.IsNullOrEmpty(rowtablesValidation["allowedFileCount"].ToString()))
                                                            {
                                                                _valid_allowed_file_count = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_allowed_file_count = Convert.ToUInt64(rowtablesValidation["allowedFileCount"]);
                                                            }
                                                            //_valid_maxlength = rowtablesValidation["maxlength"] == DBNull.Value ? null : Convert.ToUInt64(rowtablesValidation["maxlength"]);
                                                            //_valid_minlength = rowtablesValidation["minlength"] == DBNull.Value ? null : Convert.ToUInt64(rowtablesValidation["minlength"]);


                                                            _valid_regex = rowtablesValidation["regex"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["regex"]);
                                                            _valid_errormessage = rowtablesValidation["errormessage"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["errormessage"]);
                                                            _valid_mindate = rowtablesValidation["mindate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["mindate"]);
                                                            _valid_maxdate = rowtablesValidation["maxdate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["maxdate"]);
                                                            _valid_status = rowtablesValidation["maxdate"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["status"]);
                                                            _valid_unique = rowtablesValidation["isunique"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["isunique"]);
                                                            _valid_uniqueURL = rowtablesValidation["uniqueURL"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["uniqueURL"]);
                                                            _valid_allowed_extentions = rowtablesValidation["allowedExtentions"] == DBNull.Value ? "" : Convert.ToString(rowtablesValidation["allowedExtentions"]);

                                                            _valid_otp_varification = rowtablesValidation["otp_varification"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesValidation["otp_varification"]);

                                                            if (string.IsNullOrEmpty(rowtablesValidation["allowedSize"].ToString()))
                                                            {
                                                                _valid_allowed_size = null;
                                                            }
                                                            else
                                                            {
                                                                _valid_allowed_size = Convert.ToUInt64(rowtablesValidation["allowedSize"]);
                                                            }
                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationId);
                                                            _writer.WriteValue(_valid_id.ToString());
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationRequired);
                                                            _writer.WriteValue(_valid_required);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxLength);
                                                            _writer.WriteValue(_valid_maxlength ?? 0);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMinLength);
                                                            _writer.WriteValue(_valid_minlength ?? 0);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxHeight);
                                                            _writer.WriteValue(_valid_maxheight ?? 0);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMinHeight);
                                                            _writer.WriteValue(_valid_minheight ?? 0);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxWidth);
                                                            _writer.WriteValue(_valid_maxwidth ?? 0);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMinWidth);
                                                            _writer.WriteValue(_valid_minwidth ?? 0);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedFileCount);
                                                            _writer.WriteValue(_valid_allowed_file_count ?? 0);
                                                            //_writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxLength, _valid_maxlength);
                                                            //_writer.WriteNumber(ApplicationJsonReturnConstants.PropertyNames.ValidationMinLength, _valid_minlength);


                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationRegex);
                                                            _writer.WriteValue(_valid_regex);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationErrorMessage);
                                                            _writer.WriteValue(_valid_errormessage);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMinDate);
                                                            _writer.WriteValue(_valid_mindate);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationMaxDate);
                                                            _writer.WriteValue(_valid_maxdate);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationUnique);
                                                            _writer.WriteValue(_valid_unique);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationOTP);
                                                            _writer.WriteValue(_valid_otp_varification);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationUniqueURL);
                                                            _writer.WriteValue(_valid_uniqueURL);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedExtentions);
                                                            _writer.WriteValue(_valid_allowed_extentions);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationAllowedSize);
                                                            _writer.WriteValue(_valid_allowed_size ?? 0);
                                                            //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationStatus);_writer.WriteValue (_valid_status);

                                                            _writer.WriteEndObject();

                                                            break;
                                                        }
                                                    }
                                                    // End Validation Json

                                                    // Start Condition Json

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Conditions);

                                                    //Call Function
                                                    _dataTableCondition = _dataSet.Tables[4];

                                                    // (_functionReturn, _dataTableCondition, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableCondition.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesCondition in _dataTableCondition.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _condition_id = rowtablesCondition["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesCondition["id"]);
                                                            _condition_componentid = rowtablesCondition["component_id"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["component_id"]);
                                                            _condition_componentguid = rowtablesCondition["condition_component_id"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["condition_component_id"]);
                                                            _condition_conditional = rowtablesCondition["conditional"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["conditional"]);
                                                            _condition_status = rowtablesCondition["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["status"]);
                                                            _condition_eventType = rowtablesCondition["eventType"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["eventType"]);
                                                            _condition_changeType = rowtablesCondition["changeType"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["changeType"]);
                                                            _condition_componentToChange = rowtablesCondition["componentToChange"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["componentToChange"]);
                                                            string _sectionToShowHide = rowtablesCondition["sectionToShowHide"] == DBNull.Value ? "" : Convert.ToString(rowtablesCondition["sectionToShowHide"]);

                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionId);
                                                            _writer.WriteValue(_condition_id.ToString());
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionComponentId);
                                                            _writer.WriteValue(_condition_componentid);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionComponentGuid);
                                                            _writer.WriteValue(_condition_componentguid);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionConditional);
                                                            _writer.WriteValue(_condition_conditional);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionEventType);
                                                            _writer.WriteValue(_condition_eventType);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionChangeType);
                                                            _writer.WriteValue(_condition_changeType);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionComponentToChange);
                                                            _writer.WriteValue(_condition_componentToChange);
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionsectionToShowHide);
                                                            _writer.WriteValue(_sectionToShowHide);

                                                            //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ConditionStatus, _condition_status);

                                                            _writer.WriteEndObject();
                                                            break;
                                                        }
                                                    }
                                                    // End Condition Json

                                                    // reg_grid_components_main
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponents);
                                                    _writer.WriteStartArray();

                                                    _sqlQuery = new StringBuilder();
                                                    _sqlQuery.Append("SELECT id,reg_component_id,code,name,display_name, measurementType, ");
                                                    _sqlQuery.Append(" height,  width, labelposition, type, label, description, ");
                                                    _sqlQuery.Append(" input, placeholder, api_url, defaultValue, status, dataParameter, showingrid,isdisabled,isoutput,visibility,required ");
                                                    _sqlQuery.Append(" FROM reg_grid_components_main ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" reg_component_id = " + _comp_id + " and status = 1 ");
                                                    _sqlQuery.Append(" order by id; ");

                                                    //Call Function
                                                    (_functionReturn, _dataTableSubComponents, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableSubComponents.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesSetting in _dataTableSubComponents.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _sub_comp_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                            //_sub_comp_guid = rowtablesSetting["guid"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["guid"]);
                                                            _sub_comp_name = rowtablesSetting["name"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["name"]);
                                                            _sub_comp_code = rowtablesSetting["code"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["code"]);
                                                            _sub_comp_value = rowtablesSetting["display_name"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["display_name"]);
                                                            _sub_comp_group_name = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentId);
                                                            _writer.WriteValue(_sub_comp_id.ToString());

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentName);
                                                            _writer.WriteValue(_sub_comp_name);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentCode);
                                                            _writer.WriteValue(_sub_comp_code);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentValue);
                                                            _writer.WriteValue(_sub_comp_value);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentGroupName);
                                                            _writer.WriteValue(_sub_comp_group_name);

                                                            _sub_setting_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                            _sub_setting_measurementType = rowtablesSetting["measurementType"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["measurementType"]);
                                                            _sub_setting_height = rowtablesSetting["height"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["height"]);
                                                            _sub_setting_width = rowtablesSetting["width"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["width"]);
                                                            _sub_setting_labelposition = rowtablesSetting["labelposition"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["labelposition"]);
                                                            _sub_setting_type = rowtablesSetting["type"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["type"]);
                                                            _sub_setting_label = rowtablesSetting["label"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["label"]);
                                                            _sub_setting_description = rowtablesSetting["description"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["description"]);
                                                            _sub_setting_input = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                            _sub_setting_placeholder = rowtablesSetting["placeholder"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["placeholder"]);
                                                            _sub_setting_endpoint = rowtablesSetting["api_url"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["api_url"]);
                                                            _sub_setting_defaultValue = rowtablesSetting["defaultValue"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["defaultValue"]);
                                                            _sub_setting_status = rowtablesSetting["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["status"]);
                                                            _sub_setting_dataParameter = rowtablesSetting["dataParameter"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataParameter"]);
                                                            _sub_setting_showingrid = rowtablesSetting["showingrid"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["showingrid"]);

                                                            _sub_setting_isdisabled = rowtablesSetting["isdisabled"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isdisabled"]);
                                                            _sub_setting_isoutput = rowtablesSetting["isoutput"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isoutput"]);
                                                            _sub_setting_visibility = rowtablesSetting["visibility"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["visibility"]);
                                                            _sub_setting_required = rowtablesSetting["required"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["required"]);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentSettings);

                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingId);
                                                            _writer.WriteValue(_sub_setting_id.ToString());

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingMeasurementType);
                                                            _writer.WriteValue(_sub_setting_measurementType);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingHeight);
                                                            _writer.WriteValue(_sub_setting_height);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationRequired);
                                                            _writer.WriteValue(_sub_setting_required);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingWidth);
                                                            _writer.WriteValue(_sub_setting_width);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabelposition);
                                                            _writer.WriteValue(_sub_setting_labelposition);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingType);
                                                            _writer.WriteValue(_sub_setting_type);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabel);
                                                            _writer.WriteValue(_sub_setting_label);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDescription);
                                                            _writer.WriteValue(_sub_setting_description);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingInput);
                                                            _writer.WriteValue(_sub_setting_input);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingPlaceholder);
                                                            _writer.WriteValue(_sub_setting_placeholder);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingEndPoint);
                                                            _writer.WriteValue(_sub_setting_endpoint);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDefaultValue);
                                                            _writer.WriteValue(_sub_setting_defaultValue);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDataParameter);
                                                            _writer.WriteValue(_sub_setting_dataParameter);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingShowInGrid);
                                                            _writer.WriteValue(_sub_setting_showingrid);


                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsDisabled);
                                                            _writer.WriteValue(_sub_setting_isdisabled);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsOutput);
                                                            _writer.WriteValue(_sub_setting_isoutput);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingVisibility);
                                                            _writer.WriteValue(_sub_setting_visibility);

                                                            _writer.WriteEndObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentValidations);
                                                            _writer.WriteStartObject();
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingVisibility);
                                                            _writer.WriteValue(_sub_setting_visibility);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationRequired);
                                                            _writer.WriteValue(_sub_setting_required);

                                                            _writer.WriteEndObject();

                                                            _writer.WriteEndObject();
                                                            //break;
                                                        }
                                                    }
                                                    _writer.WriteEndArray();
                                                    // reg_grid_components_main

                                                    _writer.WriteEndObject();
                                                }
                                            }
                                            _writer.WriteEndArray();
                                            // End Component Json
                                            _writer.WriteEndObject();
                                        }
                                    }
                                    _writer.WriteEndArray();
                                    // End section Json
                                    _writer.WriteEndObject();
                                }
                            }
                            _writer.WriteEndArray();
                            // End Page Json
                            _writer.WriteEndObject();
                        }
                    }
                    _writer.WriteEndObject();
                    _functionReturn.Status = true;
                    _jsonReturn = _sw.ToString();
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

        public Task<(string jsonReturn, IFunctionReturn functionReturn)> CandidateInitialInfoByIdAsync(string _guid)
        {
            return Task.Run(() => CandidateInitialInfoById(_guid));

        }


        /// <summary>
        /// Candidate List by Layout for Drop Down
        /// </summary>
        /// <param name="_guid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) CandidateInitialInfoById(string _guid)
        {
            #region Local Variables
            string _methodName = "F:Registration:CandidateInitialInfoById";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            //JSON data
            string _jsonReturn = string.Empty;
            #endregion
            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    _sqlQuery.Clear();
                    _sqlQuery.Append(" select RML.id reg_id,RML.candidate_guid, RML.registration_guid,RML.registration_status_guid,RS.status_text registration_status,RS.status_css_tag registration_status_css_tag, RML.email_verified,RML.payment_status_guid,PS.status_text payment_status,PS.status_css_tag payment_status_css_tag,");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckEmail',DSML.comp_id,null)) as comp_id, ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckFirstname',DSML.datavalue,null)) as first_name,  ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckLastname',DSML.datavalue,null)) as last_name,  ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckEmail',DSML.datavalue,null)) as email,  ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckAddressline1',DSML.datavalue,null)) as address_line1,  ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckAddressline2',DSML.datavalue,null)) as address_line2,  ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckAddress',DSML.datavalue,null)) as address,  ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckMobilenumber',DSML.datavalue,null)) as phone_no , ");
                    _sqlQuery.Append(" max(if (CM.name = 'NgxIxcheckUserName',DSML.datavalue,null)) as userName ");
                    _sqlQuery.Append(" from registration_main_live RML ");
                    _sqlQuery.Append(" join data_save_main_live DSML on RML.candidate_guid = DSML.candidate_guid ");
                    _sqlQuery.Append(" join components_main CM on CM.id = DSML.comp_id ");
                    _sqlQuery.Append("INNER JOIN registration_status RS ON RS.status_guid=RML.registration_status_guid ");
                    _sqlQuery.Append("LEFT JOIN payment_status PS ON PS.status_guid=RML.payment_status_guid");
                    _sqlQuery.Append(" where RML.candidate_guid = '" + Sanitization.Sanitize(_guid) + "';");

                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                          { ApplicationDatabaseConstants.ColumnNames.RegistrationId, (ApplicationJsonReturnConstants.PropertyNames.RegistrationId, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.CandidateGuid, (ApplicationJsonReturnConstants.PropertyNames.CandidateGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.RegistrationGuid, (ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.RegistrationStatusGuid, (ApplicationJsonReturnConstants.PropertyNames.RegistrationStatusGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.RegistrationStatus, (ApplicationJsonReturnConstants.PropertyNames.RegistrationStatus, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.RegistrationStatusCSSTag, (ApplicationJsonReturnConstants.PropertyNames.RegistrationStatusCSSTag, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.PaymentStatusGuid, (ApplicationJsonReturnConstants.PropertyNames.PaymentStatusGuid, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.PaymentStatus, (ApplicationJsonReturnConstants.PropertyNames.PaymentStatus, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.PaymentStatusCSSTag, (ApplicationJsonReturnConstants.PropertyNames.PaymentStatusCSSTag, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.FirstName, (ApplicationJsonReturnConstants.PropertyNames.FirstName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.LastName, (ApplicationJsonReturnConstants.PropertyNames.LastName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Email, (ApplicationJsonReturnConstants.PropertyNames.Email, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.AddressLine1, (ApplicationJsonReturnConstants.PropertyNames.AddressLine1, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.AddressLine2, (ApplicationJsonReturnConstants.PropertyNames.AddressLine2, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.PhoneNo, (ApplicationJsonReturnConstants.PropertyNames.PhoneNo, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.ComponentId, (ApplicationJsonReturnConstants.PropertyNames.ComponentId, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.UserName, (ApplicationJsonReturnConstants.PropertyNames.UserName, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.EmailVerified, (ApplicationJsonReturnConstants.PropertyNames.EmailVerified, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Address, (ApplicationJsonReturnConstants.PropertyNames.Address, DatabaseConstants.DataTypes.String) }
                     };

                    //Call Function
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
        /// RegistrationSubmitAsync
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<IFunctionReturn> RegistrationSubmitAsync(RegistrationData _registrationData)
        {
            return Task.Run(() => RegistrationSubmit(_registrationData));
        }
        /// <summary>
        /// RegistrationSubmitAsync
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn RegistrationSubmit(RegistrationData _registrationData)
        {
            #region Local Variables
            string _methodName = "F:Reg:RegistrationSubmit";
            MySqlConnection _mySqlConnection = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlTransaction _mytransaction = null;
            MySqlCommand _mySqlCommand = null;
            string _sqlConnectionString = string.Empty;
            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;
            bool _success = false;
            DataSet _dataSet = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime;
            string _id = string.Empty;
            string _RegistrationGuid = string.Empty;
            string _emailId = string.Empty;
            string _candidateGuid = string.Empty;
            //JSON data
            string _jsonReturn;
            #endregion
            #region Input Sanitization and Validation
            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_registrationData == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.EmailRequired; ;
                }
                else
                {
                    // Sanitize Input

                    _candidateGuid = Sanitization.Sanitize(_registrationData.CandidateGuid);
                    _RegistrationGuid = Sanitization.Sanitize(_registrationData.RegistrationGuid);
                    if (string.IsNullOrEmpty(_RegistrationGuid))
                        _errorMessage = ApplicationConstants.ValidationMessages.RegistrationGUIDRequired;

                    if (string.IsNullOrEmpty(_candidateGuid))
                        _errorMessage = ApplicationConstants.ValidationMessages.RegistrationIDRequired;
                }
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            #endregion
            //Initiate Default Function Settings

            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
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
                        // Open connection;
                        _sqlconnStart = DateTime.Now;
                        _mySqlConnection.Open();
                        _sqlconnEnd = DateTime.Now;
                        _sqlconnTime = (_sqlconnEnd - _sqlconnStart);
                        _mytransaction = _mySqlConnection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                        _mySqlCommand.Connection = _mySqlConnection;
                        _mySqlCommand.Transaction = _mytransaction;

                        #region Update registration of candidate

                        _sqlQuery = new StringBuilder();
                        //Check If code exists or not
                        _sqlQuery.Append("SELECT id from registration_main_live ");
                        _sqlQuery.Append("WHERE candidate_guid='" + _candidateGuid + "' AND registration_guid='" + _RegistrationGuid + "';");

                        (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                        if (_dataSet.Tables[0].Rows.Count > 0)
                        {
                            _success = true;
                            _sqlQuery.Clear();

                            _sqlQuery.Append("UPDATE registration_main_live ");
                            _sqlQuery.Append(" SET registration_status_guid=(SELECT status_guid FROM registration_status WHERE code='SUBMITTED')");
                            _sqlQuery.Append(" ,modify_date=NOW()");
                            _sqlQuery.Append(" WHERE candidate_guid='" + _candidateGuid + "'");
                            _sqlQuery.Append(" AND registration_guid='" + _RegistrationGuid + "';");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            int _batchId = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());

                            if (_batchId > 0)
                            {
                                _mytransaction?.Commit();
                                //Success
                                _functionReturn = CommonFunctions.AppSuccess(GenericMessages.FormSubmittedSuccessfully, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.RegistrationSubmit, GenericMessages.FormSubmittedSuccessfully);
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.RegistrationSubmit, Constants.GenericMessages.ErrorInSavingRecord);
                                _errorMessage = Constants.GenericMessages.ErrorInSavingRecord;
                            }
                            _mySqlCommand?.Dispose();
                        }
                        else
                            _errorMessage = ValidationMessages.RegInfoNotMatched;

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
        /// UpdateEmailAsync
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<IFunctionReturn> UpdateEmailAsync(RegistrationData _registrationData)
        {
            return Task.Run(() => UpdateEmail(_registrationData));
        }
        /// <summary>
        /// UpdateEmailAsync
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn UpdateEmail(RegistrationData _registrationData)
        {
            #region Local Variables
            string _methodName = "F:Reg:UpdateEmail";
            MySqlConnection _mySqlConnection = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlTransaction _mytransaction = null;
            MySqlCommand _mySqlCommand = null;

            string _sqlConnectionString = string.Empty;

            DateTime _sqlconnStart;
            DateTime _sqlconnEnd;

            bool _success = false;
            DataSet _dataSet = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime;
            string _id = string.Empty;
            string _RegistrationGuid = string.Empty;
            string _emailId = string.Empty;
            string _candidateGuid = string.Empty;

            //JSON data
            string _jsonReturn;
            #endregion

            #region Update Email Sanitization and Validation

            //Validate Input
            string _errorMessage = "";
            try
            {
                if (_registrationData == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.EmailRequired; ;
                }
                else
                {
                    // Sanitize Input
                    _id = Sanitization.Sanitize(_registrationData.Id);
                    _emailId = Sanitization.Sanitize(_registrationData.EmailId);
                    _candidateGuid = Sanitization.Sanitize(_registrationData.CandidateGuid);
                    _RegistrationGuid = Sanitization.Sanitize(_registrationData.RegistrationGuid);

                    if (string.IsNullOrEmpty(_id))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.ComponentIdRequired;
                    }
                    if (string.IsNullOrEmpty(_RegistrationGuid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.RegistrationGUIDRequired;
                    }
                    if (string.IsNullOrEmpty(_emailId))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.EmailRequired;
                    }
                    if (!ApplicationValidationFunctions.IsValidEmail(_emailId, true))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.InvaliidEmailId;
                    }
                    if (string.IsNullOrEmpty(_candidateGuid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;
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

            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
            }
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

                        // Open connection;
                        _sqlconnStart = DateTime.Now;
                        _mySqlConnection.Open();
                        _sqlconnEnd = DateTime.Now;
                        _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                        _mytransaction = _mySqlConnection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                        _mySqlCommand.Connection = _mySqlConnection;
                        _mySqlCommand.Transaction = _mytransaction;

                        #region update email

                        _sqlQuery = new StringBuilder();
                        //Check If code exists or not
                        _sqlQuery.Append(" select email from ");
                        _sqlQuery.Append(" ( select   max(if(CM.name='NgxIxcheckEmail',DSML.datavalue,null)) as email ");
                        _sqlQuery.Append("  from registration_main_live  RML ");
                        _sqlQuery.Append(" join data_save_main_live DSML on RML.candidate_guid = DSML.candidate_guid ");
                        _sqlQuery.Append(" join components_main CM on CM.id = DSML.comp_id ");
                        _sqlQuery.Append("  where  RML.email_verified=1 and RML.registration_guid= '" + _RegistrationGuid + "' )data ");
                        _sqlQuery.Append("  where data.email='" + _emailId + "';");

                        (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);

                        if (_dataSet.Tables[0].Rows.Count == 0)
                        {
                            _success = true;
                            _sqlQuery = new StringBuilder();

                            _sqlQuery.Append(" update data_save_main_live ");
                            _sqlQuery.Append(" set datavalue='" + _emailId + "'");
                            _sqlQuery.Append(" where candidate_guid='" + _candidateGuid + "' ");
                            _sqlQuery.Append(" and  comp_id='" + _id + "'; ");

                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            int _batchId = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());

                            if (_batchId > 0)
                            {
                                _mytransaction?.Commit();
                                //Success
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.EmailUpdatedSuccessfully, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.EmailChanged, GenericMessages.EmailUpdatedSuccessfully);
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.EmailChanged, Constants.GenericMessages.ErrorInSavingRecord);
                                _errorMessage = Constants.GenericMessages.ErrorInSavingRecord;
                            }
                            _mySqlCommand?.Dispose();
                        }
                        else
                        {
                            var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.EmailChanged, ApplicationConstants.ValidationMessages.EmailAlreadyExist);
                            _errorMessage = ApplicationConstants.ValidationMessages.EmailAlreadyExist;
                        }
                        if (!string.IsNullOrEmpty(_errorMessage))
                        {
                            _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                        }
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
        /// Update Customer User
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private IFunctionReturn ChangeCustomerUserPassword(CustomerUser _customerUser)
        {
            #region Local Variables
            string _methodName = "Registration:ChangeCustomerUserPassword";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            ApiSuccessResponse.DataValue _datValue = null;
            int _randamNumber = 0;
            UInt64 _retValue = 0;
            string _userName = "";
            string _candidateGuid = string.Empty;
            string _newPassword = "";
            string _confirmPassword = "";
            string _oldPassword = "";
            string _passwordDB = "";
            string _passwordHash = "";

            //JSON data           
            string _jsonReturn = string.Empty;
            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300

            #endregion

            string _errorMessage = "";
            try
            {
                if (_customerUser == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.ChangePasswordDataIsRequired;
                }
                else
                {
                    //Sanitize Input
                    _userName = Sanitization.Sanitize(_customerUser.UserName);
                    _candidateGuid = Sanitization.Sanitize(_customerUser.CandidateGuid);
                    _newPassword = Sanitization.Sanitize(_customerUser.Password);
                    _confirmPassword = Sanitization.Sanitize(_customerUser.ConfirmPassword);
                    _oldPassword = Sanitization.Sanitize(_customerUser.OldPassword);

                    //Customer
                    if (string.IsNullOrEmpty(_userName))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.UserIdIsRequired;
                    }
                    else if (string.IsNullOrEmpty(_newPassword))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.NewPasswordIsRequired;
                    }
                    else if (string.IsNullOrEmpty(_candidateGuid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.CandidateIdRequired;
                    }
                    else if (string.IsNullOrEmpty(_confirmPassword))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.ConfirmPasswordIsRequired;
                    }
                    else if (string.IsNullOrEmpty(_oldPassword))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.OldPasswordIsRequired;
                    }
                    else if (_newPassword != _confirmPassword)
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.NewPasswordAndConfirmPasswordDoesNotMatch;
                    }
                    else if (!string.IsNullOrEmpty(_newPassword))
                    {
                        if (!ValidationFunctions.IsValidPassword(_newPassword))
                        {
                            _errorMessage = ApplicationConstants.ValidationMessages.PasswordShouldMeetThePasswordPolicy;
                        }
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
            if (!string.IsNullOrEmpty(_errorMessage))
            {
                _functionReturn.Status = false;
                _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                _functionReturn.Message.Add(_errorMessage);
                if (_randamNumber > 0)
                {
                    _functionReturn.Message.Add($"{Constants.GenericMessages.TracingNumberId} : [{_randamNumber}]: ");
                }
                _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
            }
            else
            {
                try
                {
                    _sqlQuery = new StringBuilder();
                    _sqlQuery.Append("SELECT MAX(if(CM.name='NgxIxcheckPassword',DSML.datavalue,null)) AS password ");
                    _sqlQuery.Append("FROM components_main CM JOIN data_save_main_live DSML ON DSML.comp_id=CM.id where DSML.candidate_guid='" + _candidateGuid + "' AND CM.status=1 AND DSML.status=1;");
                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_functionReturn.Status && _dataTable.Rows.Count > 0)
                    {
                        if (_dataTable.Rows.Count > 0)
                            _passwordDB = Convert.ToString(_dataTable.Rows[0]["password"] == DBNull.Value ? "" : Convert.ToString(_dataTable.Rows[0]["password"]));

                        if (SecurityHash.VerifyHashedPassword(_passwordDB, _oldPassword))
                        {
                            _passwordHash = SecurityHash.HashPassword(_newPassword);
                            if (_dataTable.Rows.Count > 0 && !string.IsNullOrEmpty(_passwordDB))
                            {
                                _sqlQuery.Clear();
                                _sqlQuery.Append("UPDATE data_save_main_live DSML JOIN components_main CM ON CM.id = DSML.comp_id ");
                                _sqlQuery.Append("SET DSML.datavalue = '" + _passwordHash + "'");
                                _sqlQuery.Append(" WHERE CM.name='NgxIxcheckPassword' AND DSML.candidate_guid='" + _candidateGuid + "';");
                                //Call Function                 
                                (_functionReturn, _retValue, _datValue) = _databaseFunctions.ExecuteUpdate(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.UserPasswordUpdatedSuccessfully);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.PasswordChange, ApplicationJsonReturnConstants.PropertyNames.UserPasswordUpdatedSuccessfully);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(Constants.GenericMessages.RecordNotFoundToUpdate, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.PasswordChange, Constants.GenericMessages.RecordNotFoundToUpdate);
                            }
                        }
                        else
                        {
                            _functionReturn = CommonFunctions.AppError(GenericMessages.OldPasswordIsIncorrect, _methodName);
                            var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.PasswordChange, GenericMessages.OldPasswordIsIncorrect);
                        }
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
            return (_functionReturn);
        }

        /// <summary>
        /// Update Customer User Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<IFunctionReturn> ChangeCustomerUserPasswordAsync(CustomerUser _customerUser)
        {
            return Task.Run(() => ChangeCustomerUserPassword(_customerUser));
        }

        /// <summary>
        /// Reset User Password Email
        /// </summary>
        /// <param name="_userName"></param>
        /// <param name="_candidateGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        private IFunctionReturn ResetUserPasswordEmail(string _userName, string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "F:Registration:ResetUserPasswordEmail";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            MailAddress _mailAddress = new MailAddress();
            StringBuilder _sqlQuery = new StringBuilder();
            IFunctionReturn _functionReturn = new FunctionReturn();
            //JSON data           
            #endregion
            string _errorMessage = "";
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            bool _success = true;
            int _rowsAffected = 0;
            //Initiate Default Function Settings           
            if (!string.IsNullOrEmpty(_errorMessage))
            {
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

                            _userName = Sanitization.Sanitize(_userName);


                            int _timeout_minutes = 20;
                            string _reset_token = CommonFunctions.ConvertStringToSHA256(Convert.ToString(_userName + DateTime.Now.ToString()));

                            _sqlQuery.Clear();
                            _sqlQuery.Append("DELETE FROM `app_user_reset_password` WHERE user_name = '" + _userName + "';");
                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                            _queryStart = DateTime.Now;
                            _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                            if (_success)
                            {
                                // add new entry into "customer_users_password_reset" table
                                _sqlQuery.Clear();
                                _sqlQuery.Append("INSERT INTO `app_user_reset_password` (");
                                _sqlQuery.Append("`user_name`");
                                _sqlQuery.Append(",`reset_token`");
                                _sqlQuery.Append(",`timeout_minutes`");
                                _sqlQuery.Append(",`reset_timestamp`) VALUES (");
                                _sqlQuery.Append("'" + _userName + "'");
                                _sqlQuery.Append(",'" + _reset_token + "'");
                                _sqlQuery.Append(",'" + _timeout_minutes + "'");
                                _sqlQuery.Append(",CURRENT_TIMESTAMP);");
                                _rowsAffected = 0;
                                _mySqlCommand.CommandText = _sqlQuery.ToString();
                                _rowsAffected = Convert.ToInt32(_mySqlCommand.ExecuteNonQuery());
                                if (_rowsAffected <= 0)
                                    _success = false;
                                else
                                {
                                    _sqlQuery.Clear();
                                    _sqlQuery.Append("SELECT MAX(if(CM.name='NgxIxcheckEmail',DSML.datavalue,null)) Email FROM components_main CM");
                                    _sqlQuery.Append(" JOIN data_save_main_live DSML on DSML.comp_id=CM.id");
                                    _sqlQuery.Append(" WHERE DSML.candidate_guid='" + Sanitization.Sanitize(_candidateGuid) + "' AND DSML.status=1 AND CM.status=1;");
                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                    string _receiverEmail = Convert.ToString(_mySqlCommand.ExecuteScalar());
                                    if (!string.IsNullOrEmpty(_receiverEmail))
                                    {
                                        _mailAddress.Email = _receiverEmail;
                                        string _resetPasswordBaseUrl = "http://localhost:4200/uid/" + _userName + "/reset/" + _reset_token;
                                        _mailAddress.Name = "Candidate Portal";
                                        EmailParams _emailParams = new EmailParams();
                                        _emailParams.MailTo.Add(_mailAddress);
                                        _emailParams.MailSubject = "Dear Candidate # " + _userName;
                                        StringBuilder _mailBody = new StringBuilder();
                                        _mailBody.Append("Dear Valued Customer,");
                                        _mailBody.Append("<br><br>");
                                        _mailBody.Append("Thank you for choosing our Tally Cloud services.");
                                        _mailBody.Append("<br>");
                                        _mailBody.Append("<br>");
                                        _mailBody.Append("Username : " + "daas_user_name");
                                        _mailBody.Append("<br><br>");
                                        _mailBody.Append("Please click on below link for reset password:");
                                        _mailBody.Append("<br><br>");
                                        _mailBody.Append(_resetPasswordBaseUrl);
                                        _mailBody.Append("<br><br>");
                                        _mailBody.Append("Thanks & Regards !!");
                                        _mailBody.Append("<br>");
                                        _mailBody.Append("Ixcheck");
                                        _emailParams.MailBody = _mailBody.ToString();
                                        Task<bool> _mailSent = _emailFunctions.SendMailAsync(_emailParams);
                                    }
                                    else
                                        _success = false;
                                }
                            }
                            if (_success)
                            {
                                _mytransaction?.Commit();
                                //Success
                                _functionReturn = CommonFunctions.AppSuccess(GenericMessages.EmailScheduledToSend, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.EmailChangeRequested, GenericMessages.EmailScheduledToSend);
                            }
                            else
                            {
                                _mytransaction?.Rollback();
                                //No Data // Need to send blank JSON object instead of error
                                _functionReturn = CommonFunctions.AppError(Constants.GenericMessages.ErrorInSendingEmail, _methodName);
                                var _result = _sharedFunctions.LogCandidateActivityAsync(_candidateGuid, PaymentActivityTypes.EmailChangeRequested, Constants.GenericMessages.ErrorInSendingEmail);
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                            _mytransaction?.Rollback();
                            //ERROR                   
                        }
                    }
                }
                catch (Exception ex)
                {
                    //ERROR                   
                    _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
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
            return (_functionReturn);
        }

        /// <summary>
        /// Reset User Password Email Async
        /// </summary>
        /// <param name="_userName"></param>
        /// <param name="_candidateGuid"></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>mo
        public Task<IFunctionReturn> ResetUserPasswordEmailAsync(string _userName, string _candidateGuid)
        {
            return Task.Run(() => ResetUserPasswordEmail(_userName, _candidateGuid));
        }


        /// <summary>
        /// Add Reg Component Json Value Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> AddRegGridComponentValueAsync(RegGridComponentValues _regGridComponentList)
        {
            return Task.Run(() => AddRegGridComponentValue(_regGridComponentList));
        }
        /// <summary>
        /// Add Reg Component Json Value
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) AddRegGridComponentValue(RegGridComponentValues _regGridComponentList)
        {
            #region Local Variables
            string _methodName = "F:Reg:AddRegGridComponentValue";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            DataTable _dataTable = null;
            TimeSpan? _queryTime = null;
            bool _success = true;
            string _candidateGuid = string.Empty;
            UInt64 _data_id = 0;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            //JSON data
            string _jsonReturn = string.Empty;
            string _errorMessage = "";
            #endregion
            //#region Input Sanitization and Validation
            //Validate Input

            try
            {
                //_regGridComponentList.CandidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                if (_regGridComponentList == null || _regGridComponentList.RegGridComponentValue == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.FormDataRequired; ;
                }
                if (!string.IsNullOrEmpty(_regGridComponentList.CandidateGuid))
                {
                    _candidateGuid = Sanitization.Sanitize(_regGridComponentList.CandidateGuid);
                    //_candidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                }
                foreach (var templateItem in _regGridComponentList.RegGridComponentValue)
                {
                    if (string.IsNullOrEmpty(templateItem.RowGuid))
                    {
                        _errorMessage = ApplicationConstants.ValidationMessages.RowGuidRequired;
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            //#endregion
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

                            #region Add Tab

                            if (string.IsNullOrEmpty(_candidateGuid))
                                _success = false;
                            else
                            {
                                foreach (var templateItem in _regGridComponentList.RegGridComponentValue)
                                {
                                    if (_success)
                                    {
                                        _sqlQuery = new StringBuilder();
                                        _dataTable = new DataTable();
                                        _sqlQuery.Append("SELECT id ");
                                        _sqlQuery.Append(" from reg_data_gridvalues ");
                                        _sqlQuery.Append(" WHERE ");
                                        _sqlQuery.Append(" candidate_guid = '" + _candidateGuid + "'");
                                        _sqlQuery.Append(" and row_guid = '" + templateItem.RowGuid + "'");
                                        _sqlQuery.Append(" and reg_component_id = '" + templateItem.RegComponentId + "'");
                                        _sqlQuery.Append(" and grid_component_id = '" + templateItem.GridComponentId + "'");
                                        _sqlQuery.Append(" and status = 1 ");
                                        _sqlQuery.Append(" order by id; ");

                                        (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                                        if (_dataTable.Rows.Count <= 0)
                                        {
                                            _sqlQuery.Clear();
                                            _sqlQuery.Append("INSERT INTO `reg_data_gridvalues` ( ");
                                            _sqlQuery.Append("`candidate_guid`");
                                            _sqlQuery.Append(",`reg_component_id`");
                                            _sqlQuery.Append(",`row_guid`");
                                            _sqlQuery.Append(",`grid_component_id`");
                                            _sqlQuery.Append(",`value`");
                                            _sqlQuery.Append(",`status`");
                                            _sqlQuery.Append(" ) VALUES ( ");
                                            _sqlQuery.Append("'" + _candidateGuid + "'");
                                            _sqlQuery.Append(",'" + templateItem.RegComponentId + "'");
                                            _sqlQuery.Append(",'" + templateItem.RowGuid + "'");
                                            _sqlQuery.Append(",'" + templateItem.GridComponentId + "'");
                                            _sqlQuery.Append(",'" + templateItem.Value + "'");
                                            _sqlQuery.Append(",'1'");
                                            _sqlQuery.Append(" ); ");
                                            _sqlQuery.Append("select LAST_INSERT_ID();");

                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                            _data_id = Convert.ToUInt64(_mySqlCommand.ExecuteScalar());
                                        }
                                        else
                                        {
                                            _sqlQuery.Clear();
                                            _sqlQuery.Append("update `reg_data_gridvalues` ");
                                            _sqlQuery.Append("set");
                                            _sqlQuery.Append("`value` =");
                                            _sqlQuery.Append("'" + templateItem.Value + "'");
                                            _sqlQuery.Append(" WHERE ");
                                            _sqlQuery.Append(" candidate_guid = '" + _candidateGuid + "'");
                                            _sqlQuery.Append(" and row_guid = '" + templateItem.RowGuid + "'");
                                            _sqlQuery.Append(" and reg_component_id = '" + templateItem.RegComponentId + "'");
                                            _sqlQuery.Append(" and grid_component_id = '" + templateItem.GridComponentId + "'");
                                            _sqlQuery.Append(" and status = 1 ");
                                            _mySqlCommand.CommandText = _sqlQuery.ToString();
                                            _data_id = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());
                                        }
                                        if (_data_id <= 0)
                                            _success = false;
                                    }
                                }
                            }

                            if (_success)
                            {
                                _sqlQuery = new StringBuilder();
                                _sqlQuery.Append(" select d.row_guid as 'Row Guid', d.candidate_guid as 'Candidate Guid',d.reg_component_id as 'Reg Component Id',  ");
                                _sqlQuery.Append(" (select name from reg_qualification_type where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckQualificationType',d.value,null)) )as 'Qualification Type', ");
                                _sqlQuery.Append(" (select name from reg_degree_name where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckNameOfDegree',d.value,null))) as 'Degree Name', ");
                                _sqlQuery.Append(" (select name from states_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityStateBord',d.value,null))) as 'University Board State', ");
                                _sqlQuery.Append(" (select name from university_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityBord',d.value,null))) as 'University Board', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckDateofIssuingonFinalyearMarksheet',d.value,null)) as 'Date of Issuing on Final Year Marksheet', ");
                                _sqlQuery.Append(" (select name from stream_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckSubjectStream',d.value,null))) as 'Stream', ");
                                _sqlQuery.Append(" (select name from reg_marks_type where id= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksType',d.value,null))) as 'Marks Type', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksObtained',d.value,null)) as 'Marks Obtained', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMaximumMarks',d.value,null)) as 'Maximum Marks', ");
                                _sqlQuery.Append(" (select name from reg_grade where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckGrade',d.value,null))) as 'Grade', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckpercentageMarksObtained',d.value,null)) as 'Percentage Marks Obtained' ");

                                _sqlQuery.Append(" from reg_grid_components_main c ");
                                _sqlQuery.Append(" join  reg_data_gridvalues d on d.grid_component_id=c.id  ");
                                _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "'");
                                _sqlQuery.Append(" group by d.candidate_guid,d.row_guid;");


                                Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                                {
                                { ApplicationDatabaseConstants.ColumnNames.RowGuid2, (ApplicationJsonReturnConstants.PropertyNames.RowGuid2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.CandidateGuid2, (ApplicationJsonReturnConstants.PropertyNames.CandidateGuid2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.RegComponentId2, (ApplicationJsonReturnConstants.PropertyNames.RegComponentId2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.QualificationType2, (ApplicationJsonReturnConstants.PropertyNames.QualificationType2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.DegreeName2, (ApplicationJsonReturnConstants.PropertyNames.DegreeName2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.UniversityBoardState2, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoardState2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.UniversityBoard2, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoard2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.DateofIssuingonFinalyearMarksheet2, (ApplicationJsonReturnConstants.PropertyNames.DateofIssuingonFinalyearMarksheet2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.Stream2, (ApplicationJsonReturnConstants.PropertyNames.Stream2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MarksType2, (ApplicationJsonReturnConstants.PropertyNames.MarksType2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MarksObtained2, (ApplicationJsonReturnConstants.PropertyNames.MarksObtained2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MaximumMarks2, (ApplicationJsonReturnConstants.PropertyNames.MaximumMarks2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.Grade2, (ApplicationJsonReturnConstants.PropertyNames.Grade2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.PercentageMarksObtained2, (ApplicationJsonReturnConstants.PropertyNames.PercentageMarksObtained2, DatabaseConstants.DataTypes.String) }
                                };

                                //Call Function
                                (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.RegGridComponentsMain, _dictionary, _stats.CacheCheckTime);
                            }
                            #endregion

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn.Status = true;
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordSavedSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
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
                        _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.SystemError(exTran.Message, _methodName);
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

        /// <summary>
        /// Delete Reg Component Value Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> DeleteRegGridComponentValueAsync(RegGridComponent _regGridComponent)
        {
            return Task.Run(() => DeleteRegGridComponentValue(_regGridComponent));
        }
        /// <summary>
        /// Delete Reg Component Value
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) DeleteRegGridComponentValue(RegGridComponent _regGridComponent)
        {
            #region Local Variables
            string _methodName = "F:Reg:DeleteRegGridComponentValue";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            DataTable _dataTable = null;
            bool _success = true;
            string _candidateGuid = string.Empty;
            UInt64 _data_id = 0;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            //JSON data
            string _jsonReturn = string.Empty;
            string _errorMessage = "";
            #endregion
            //#region Input Sanitization and Validation
            //Validate Input

            try
            {
                //_regGridComponent.CandidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                if (_regGridComponent == null || _regGridComponent.CandidateGuid == null)
                {
                    _errorMessage = ApplicationConstants.ValidationMessages.FormDataRequired; ;
                }
                if (!string.IsNullOrEmpty(_regGridComponent.CandidateGuid))
                {
                    _candidateGuid = Sanitization.Sanitize(_regGridComponent.CandidateGuid);
                    //_candidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                }
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            //#endregion
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

                            #region Add Tab

                            if (string.IsNullOrEmpty(_candidateGuid))
                                _success = false;
                            else
                            {
                                if (_success)
                                {
                                    _sqlQuery = new StringBuilder();
                                    _dataTable = new DataTable();
                                    _sqlQuery.Append("DELETE FROM reg_data_gridvalues ");
                                    _sqlQuery.Append(" WHERE ");
                                    _sqlQuery.Append(" candidate_guid = '" + _candidateGuid + "'");
                                    _sqlQuery.Append(" and row_guid = '" + _regGridComponent.RowGuid + "'");
                                    _sqlQuery.Append(" and reg_component_id = '" + _regGridComponent.RegComponentId + "'");
                                    _sqlQuery.Append(" and candidate_guid = '" + _regGridComponent.CandidateGuid + "'");
                                    _sqlQuery.Append(" and status = 1; ");
                                    //_sqlQuery.Append(" order by id; ");

                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                    _data_id = Convert.ToUInt64(_mySqlCommand.ExecuteNonQuery());
                                    if (_data_id <= 0)
                                        _success = false;
                                }
                            }
                            #endregion

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn.Status = true;
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordDeletedSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.AppError(ex.Message, _methodName);
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                            }
                            catch (Exception exTran)
                            {
                                _functionReturn = CommonFunctions.AppError(exTran.Message, _methodName);
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

        /// <summary>
        /// Reg Grid Component List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> RegGridComponentListAsync(string _candidateGuid)
        {
            return Task.Run(() => RegGridComponentList(_candidateGuid));
        }
        /// <summary>
        /// Reg Grid Component List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) RegGridComponentList(string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "F:Reg:RegGridComponentList";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            bool _success = true;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            //JSON data
            string _jsonReturn = string.Empty;
            string _errorMessage = "";
            #endregion
            //#region Input Sanitization and Validation
            //Validate Input

            try
            {
                //_candidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                if (_candidateGuid == null)
                    _errorMessage = ApplicationConstants.ValidationMessages.FormDataRequired; ;
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            //#endregion
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

                            #region Add Tab

                            if (string.IsNullOrEmpty(_candidateGuid))
                                _success = false;

                            if (_success)
                            {
                                _sqlQuery = new StringBuilder();
                                _sqlQuery.Append(" select d.row_guid as 'Row Guid', d.candidate_guid as 'Candidate Guid',d.reg_component_id as 'Reg Component Id',  ");
                                _sqlQuery.Append(" (select name from reg_qualification_type where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckQualificationType',d.value,null)) )as 'Qualification Type', ");
                                _sqlQuery.Append(" (select name from reg_degree_name where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckNameOfDegree',d.value,null))) as 'Degree Name', ");
                                _sqlQuery.Append(" (select name from states_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityStateBord',d.value,null))) as 'University Board State', ");
                                _sqlQuery.Append(" (select name from university_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityBord',d.value,null))) as 'University Board', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckDateofIssuingonFinalyearMarksheet',d.value,null)) as 'Date of Issuing on Final Year Marksheet', ");
                                _sqlQuery.Append(" (select name from stream_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckSubjectStream',d.value,null))) as 'Stream', ");
                                _sqlQuery.Append(" (select name from reg_marks_type where id= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksType',d.value,null))) as 'Marks Type', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksObtained',d.value,null)) as 'Marks Obtained', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMaximumMarks',d.value,null)) as 'Maximum Marks', ");
                                _sqlQuery.Append(" (select name from reg_grade where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckGrade',d.value,null))) as 'Grade', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckpercentageMarksObtained',d.value,null)) as 'Percentage Marks Obtained' ");

                                _sqlQuery.Append(" from reg_grid_components_main c ");
                                _sqlQuery.Append(" join  reg_data_gridvalues d on d.grid_component_id=c.id  ");
                                _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "'");
                                _sqlQuery.Append(" group by d.candidate_guid,d.row_guid;");


                                Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                                {
                                { ApplicationDatabaseConstants.ColumnNames.RowGuid2, (ApplicationJsonReturnConstants.PropertyNames.RowGuid2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.CandidateGuid2, (ApplicationJsonReturnConstants.PropertyNames.CandidateGuid2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.RegComponentId2, (ApplicationJsonReturnConstants.PropertyNames.RegComponentId2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.QualificationType2, (ApplicationJsonReturnConstants.PropertyNames.QualificationType2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.DegreeName2, (ApplicationJsonReturnConstants.PropertyNames.DegreeName2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.UniversityBoardState2, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoardState2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.UniversityBoard2, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoard2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.DateofIssuingonFinalyearMarksheet2, (ApplicationJsonReturnConstants.PropertyNames.DateofIssuingonFinalyearMarksheet2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.Stream2, (ApplicationJsonReturnConstants.PropertyNames.Stream2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MarksType2, (ApplicationJsonReturnConstants.PropertyNames.MarksType2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MarksObtained2, (ApplicationJsonReturnConstants.PropertyNames.MarksObtained2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MaximumMarks2, (ApplicationJsonReturnConstants.PropertyNames.MaximumMarks2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.Grade2, (ApplicationJsonReturnConstants.PropertyNames.Grade2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.PercentageMarksObtained2, (ApplicationJsonReturnConstants.PropertyNames.PercentageMarksObtained2, DatabaseConstants.DataTypes.String) }
                                };

                                //Call Function
                                (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.RegGridComponentsMain, _dictionary, _stats.CacheCheckTime);
                            }
                            #endregion

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn.Status = true;
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordFetchedSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
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
                        _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.SystemError(exTran.Message, _methodName);
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

        /// <summary>
        /// Get Layout Component Json Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> LayoutComponentListAsync(string _candidateGuid, UInt64 _id)
        {
            return Task.Run(() => LayoutComponentList(_candidateGuid, _id));
        }
        /// <summary>
        /// Get Layout Component Json
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) LayoutComponentList(string _candidateGuid, UInt64 _id)
        {
            #region Local Variables
            string _methodName = "F:Reg:LayoutComponentList";
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            int _randamNumber = 0;
            //JSON data
            DataTable _dataTable = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            string _sqlConnectionString = string.Empty;
            #endregion

            //Initiate Default Function Settings
            _functionReturn = new FunctionReturn();
            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    (_jsonReturn, _functionReturn) = GenerateLayoutJsonById(_candidateGuid, _id);
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
        /// Generate Layout Component Json By Id
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GenerateLayoutJsonById(string _candidateGuid, UInt64 _id)
        {
            #region Local Variables
            string _methodName = "F:Reg:GetLayoutJson";

            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            int _randamNumber = 0;
            //JSON data
            DataTable _dataTable = null;
            DataTable _dataTablePage = null;
            DataTable _dataTableSection = null;
            DataTable _dataTableComps = null;
            DataTable _dataTableSettings = null;
            DataTable _dataTableData = null;
            DataTable _dataTableData_object = null;
            DataTable _dataTableValidations = null;
            DataTable _dataTableCondition = null;
            DataTable _dataTableAiSetting = null;
            DataTable _dataTableAiColor = null;
            DataTable _dataTableSubCompData = null;
            DataTable _dataTableSubComponents = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            string _jsonReturn = string.Empty;
            UInt64 _layout_id = 0;
            string _layout_guid = "";
            string _layout_name = "";
            string _layout_description = "";
            string _layout_code = "";
            string _layout_page_name = "";
            string _layout_registration_guid = "";
            string _layout_status = "";
            string _layout_number = "";
            string _layout_registrations_name = "";
            UInt64 _page_id = 0;
            string _page_guid = "";
            string _page_name = "";
            string _page_description = "";
            string _page_status = "";
            UInt64 _section_id = 0;
            string _section_guid = "";
            string _section_name = "";
            string _section_description = "";
            string _section_status = "";
            UInt64 _section_visibility = 0;
            string _section_css_class = "";
            string _layout_type_guid = "";
            UInt64 _comp_id = 0;
            string _comp_guid = "";
            string _comp_name = "";
            UInt64 _comp_cols = 0;
            UInt64 _comp_rows = 0;
            UInt64 _comp_x = 0;
            UInt64 _comp_y = 0;
            string _comp_status = "";
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
            string _setting_status = "";
            bool _setting_showingrid = false;
            bool _setting_isdisabled = false;
            bool _setting_isoutput = false;
            UInt64 _data_id = 0;
            string _data_value = "";
            string _data_status = "";
            UInt64 _dataobject_id = 0;
            string _dataobject_endpoint = "";
            string _dataobject_textfield = "";
            string _dataobject_valuefield = "";
            string _dataobject_status = "";
            UInt64 _valid_id = 0;
            bool _valid_required = false;
            UInt64? _valid_maxlength;
            UInt64? _valid_minlength;
            string _valid_regex = "";
            string _valid_errormessage = "";
            string _valid_mindate = "";
            string _valid_maxdate = "";
            string _valid_status = "";
            bool _valid_unique = false;
            string _valid_uniqueURL = "";
            string _valid_allowed_extentions = "";
            UInt64? _valid_allowed_size;
            UInt64? _valid_maxwidth;
            UInt64? _valid_minwidth;
            UInt64? _valid_maxheight;
            UInt64? _valid_minheight;
            UInt64? _valid_allowed_file_count;
            bool _valid_otp_varification = false;
            UInt64 _condition_id = 0;
            string _condition_componentid = "";
            string _condition_componentguid = "";
            string _condition_conditional = "";
            string _condition_status = "";
            string _condition_eventType = "";
            string _condition_changeType = "";
            string _condition_componentToChange = "";
            string _condition_sectionToShowHide = "";
            UInt64 _sub_comp_id = 0;
            string _sub_comp_name = "";
            string _sub_comp_code = "";
            string _sub_comp_value = "";
            string _sub_comp_group_name = "";
            UInt64 _sub_setting_id = 0;
            string _sub_setting_measurementType = "";
            string _sub_setting_height = "";
            string _sub_setting_width = "";
            string _sub_setting_labelposition = "";
            string _sub_setting_type = "";
            string _sub_setting_label = "";
            string _sub_setting_description = "";
            string _sub_setting_input = "";
            string _sub_setting_placeholder = "";
            string _sub_setting_endpoint = "";
            string _sub_setting_defaultValue = "";
            string _sub_setting_dataParameter = "";
            bool _sub_setting_showingrid = false;
            bool _sub_setting_isdisabled = false;
            bool _sub_setting_isoutput = false;
            bool _sub_setting_visibility = false;
            string _sub_setting_status = "";
            UInt64 _sub_data_id = 0;
            string _sub_data_value = "";
            string _sub_data_status = "";
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

                    _sqlQuery.Append(" select lm.id, lm.layout_guid, lm.name, lm.description, lm.status, ");
                    _sqlQuery.Append(" lm.code,  lm.page_name, lm.number, lm.layout_type_guid ");
                    _sqlQuery.Append(" from layout_main lm ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" lm.id = '" + _id + "' and lm.status = 1 ");
                    _sqlQuery.Append(" order by lm.id; ");


                    //Call Function
                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                    _sw = new StringWriter();
                    _writer = new JsonTextWriter(_sw);

                    // Start Main Object Json
                    _writer.WriteStartObject();
                    _loopStart = DateTime.Now;
                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Layout);
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
                            _layout_id = row["id"] == DBNull.Value ? 0 : Convert.ToUInt64(row["id"]);
                            _layout_guid = row["layout_guid"] == DBNull.Value ? "" : Convert.ToString(row["layout_guid"]);
                            _layout_name = row["name"] == DBNull.Value ? "" : Convert.ToString(row["name"]);
                            _layout_description = row["description"] == DBNull.Value ? "" : Convert.ToString(row["description"]);
                            _layout_status = row["status"] == DBNull.Value ? "" : Convert.ToString(row["status"]);
                            _layout_code = row["code"] == DBNull.Value ? "" : Convert.ToString(row["code"]);
                            _layout_page_name = row["page_name"] == DBNull.Value ? "" : Convert.ToString(row["page_name"]);
                            _layout_number = row["number"] == DBNull.Value ? "" : Convert.ToString(row["number"]);

                            //layout_type_guid = row["layout_type_guid"] == DBNull.Value ? "" : Convert.ToString(row["layout_type_guid"]);
                            //_layout_registration_guid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                            //_layout_registrations_name = row["registrations_name"] == DBNull.Value ? "" : Convert.ToString(row["registrations_name"]);

                            _writer.WriteStartObject();

                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutId);
                            _writer.WriteValue(_layout_id.ToString());
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutGuid);
                            _writer.WriteValue(_layout_guid);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutName);
                            _writer.WriteValue(_layout_name);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutDescription);
                            _writer.WriteValue(_layout_description);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutCode);
                            _writer.WriteValue(_layout_code);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutPageName);
                            _writer.WriteValue(_layout_page_name);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutNumber);
                            _writer.WriteValue(_layout_number);
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LayoutTypeGuid);
                            _writer.WriteValue(_layout_type_guid);


                            // Start Page Json
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Pages);
                            _writer.WriteStartArray();

                            _sqlQuery = new StringBuilder();
                            _sqlQuery.Append(" select id, page_guid, code, description,status ");
                            _sqlQuery.Append(" from pages_main ");
                            _sqlQuery.Append(" WHERE ");
                            _sqlQuery.Append(" form_id =" + _layout_id.ToString() + " and status = 1 ");
                            _sqlQuery.Append(" order by id; ");

                            //Call Function
                            (_functionReturn, _dataTablePage, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                            if (_dataTablePage.Rows.Count <= 0)
                            {
                                _writer.WriteStartObject();
                                _writer.WriteEndObject();
                            }
                            else
                            {
                                foreach (DataRow rowpage in _dataTablePage.Rows)
                                {
                                    //check NULLS and DATA TYPE here for returned column values
                                    _page_id = rowpage["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowpage["id"]);
                                    _page_guid = rowpage["page_guid"] == DBNull.Value ? "" : Convert.ToString(rowpage["page_guid"]);
                                    _page_name = rowpage["code"] == DBNull.Value ? "" : Convert.ToString(rowpage["code"]);
                                    _page_description = rowpage["description"] == DBNull.Value ? "" : Convert.ToString(rowpage["description"]);
                                    _page_status = rowpage["status"] == DBNull.Value ? "" : Convert.ToString(rowpage["status"]);

                                    _writer.WriteStartObject();

                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageId);
                                    _writer.WriteValue(_page_id.ToString());
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageGuid);
                                    _writer.WriteValue(_page_guid);
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageName);
                                    _writer.WriteValue(_page_name);
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PageDescription);
                                    _writer.WriteValue(_page_description);

                                    // Start Section Json
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Sections);
                                    _writer.WriteStartArray();

                                    //_writer.WriteStartArray();

                                    _sqlQuery = new StringBuilder();
                                    _sqlQuery.Append(" select id, section_guid, code, description,status,visibility,css_class ");
                                    _sqlQuery.Append(" from section_main ");
                                    _sqlQuery.Append(" WHERE ");
                                    _sqlQuery.Append(" page_id = " + _page_id.ToString() + " and status = 1 ");
                                    _sqlQuery.Append(" order by page_id; ");

                                    //Call Function
                                    (_functionReturn, _dataTableSection, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                    if (_dataTableSection.Rows.Count <= 0)
                                    {
                                        _writer.WriteStartObject();
                                        _writer.WriteEndObject();
                                    }
                                    else
                                    {
                                        foreach (DataRow rowsection in _dataTableSection.Rows)
                                        {
                                            //check NULLS and DATA TYPE here for returned column values
                                            _section_id = rowsection["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowsection["id"]);
                                            _section_guid = rowsection["section_guid"] == DBNull.Value ? "" : Convert.ToString(rowsection["section_guid"]);
                                            _section_name = rowsection["code"] == DBNull.Value ? "" : Convert.ToString(rowsection["code"]);
                                            _section_description = rowsection["description"] == DBNull.Value ? "" : Convert.ToString(rowsection["description"]);

                                            _section_visibility = rowsection["visibility"] == DBNull.Value ? 0 : Convert.ToUInt64(rowsection["visibility"]);
                                            _section_css_class = rowsection["css_class"] == DBNull.Value ? "" : Convert.ToString(rowsection["css_class"]);

                                            _section_status = rowsection["status"] == DBNull.Value ? "" : Convert.ToString(rowsection["status"]);
                                            _writer.WriteStartObject();

                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionId);
                                            _writer.WriteValue(_section_id.ToString());
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionGuid);
                                            _writer.WriteValue(_section_guid);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionName);
                                            _writer.WriteValue(_section_name);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionDescription);
                                            _writer.WriteValue(_section_description);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionVisibility);
                                            _writer.WriteValue(_section_visibility);
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionCssClass);
                                            _writer.WriteValue(_section_css_class);

                                            //// Start Component Json
                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Components);
                                            _writer.WriteStartArray();


                                            _sqlQuery = new StringBuilder();
                                            _sqlQuery.Append(" select id, component_guid, cols, `rows`, x, y, name, status ");
                                            _sqlQuery.Append(" from components_main ");
                                            _sqlQuery.Append(" WHERE ");
                                            _sqlQuery.Append(" section_id = " + _section_id.ToString() + " and status = 1 ");
                                            _sqlQuery.Append(" order by  y, (x*y); ");

                                            //Call Function
                                            (_functionReturn, _dataTableComps, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                            if (_dataTableComps.Rows.Count <= 0)
                                            {
                                                _writer.WriteStartObject();
                                                _writer.WriteEndObject();
                                            }
                                            else
                                            {
                                                foreach (DataRow rowtablesComp in _dataTableComps.Rows)
                                                {
                                                    //check NULLS and DATA TYPE here for returned column values
                                                    _comp_id = rowtablesComp["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["id"]);
                                                    _comp_guid = rowtablesComp["component_guid"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["component_guid"]);
                                                    _comp_name = rowtablesComp["name"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["name"]);
                                                    _comp_cols = rowtablesComp["cols"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["cols"]);
                                                    _comp_rows = rowtablesComp["rows"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["rows"]);
                                                    _comp_x = rowtablesComp["x"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["x"]);
                                                    _comp_y = rowtablesComp["y"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesComp["y"]);
                                                    _comp_status = rowtablesComp["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesComp["status"]);

                                                    _writer.WriteStartObject();

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentId);
                                                    _writer.WriteValue(_comp_id.ToString());
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentGuid);
                                                    _writer.WriteValue(_comp_guid);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentName);
                                                    _writer.WriteValue(_comp_name);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentCols);
                                                    _writer.WriteValue(_comp_cols);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentRows);
                                                    _writer.WriteValue(_comp_rows);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentX);
                                                    _writer.WriteValue(_comp_x);
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ComponentY);
                                                    _writer.WriteValue(_comp_y);



                                                    // Start Setting Json

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Settings);

                                                    _sqlQuery = new StringBuilder();
                                                    _sqlQuery.Append(" select  id, measurementType,  height,  width, labelposition, type, label, description, " +
                                                        "input, placeholder, endPoint, defaultValue, status, dataParameter, showingrid,isdisabled,isoutput ");
                                                    _sqlQuery.Append(" from settings_main ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" order by id; ");

                                                    //Call Function
                                                    (_functionReturn, _dataTableSettings, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableSettings.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesSetting in _dataTableSettings.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _setting_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                            _setting_measurementType = rowtablesSetting["measurementType"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["measurementType"]);
                                                            _setting_height = rowtablesSetting["height"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["height"]);
                                                            _setting_width = rowtablesSetting["width"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["width"]);
                                                            _setting_labelposition = rowtablesSetting["labelposition"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["labelposition"]);
                                                            _setting_type = rowtablesSetting["type"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["type"]);
                                                            _setting_label = Convert.ToString(rowtablesSetting["label"]);
                                                            _setting_description = rowtablesSetting["description"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["description"]);
                                                            _setting_input = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                            _setting_placeholder = rowtablesSetting["placeholder"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["placeholder"]);
                                                            _setting_endpoint = rowtablesSetting["endPoint"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["endPoint"]);
                                                            _setting_defaultValue = rowtablesSetting["defaultValue"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["defaultValue"]);
                                                            _setting_status = rowtablesSetting["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["status"]);
                                                            _setting_dataParameter = rowtablesSetting["dataParameter"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataParameter"]);
                                                            _setting_showingrid = rowtablesSetting["showingrid"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["showingrid"]);

                                                            _setting_isdisabled = rowtablesSetting["isdisabled"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isdisabled"]);
                                                            _setting_isoutput = rowtablesSetting["isoutput"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isoutput"]);

                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingId);
                                                            _writer.WriteValue(_setting_id.ToString());

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingMeasurementType);
                                                            _writer.WriteValue(_setting_measurementType);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingHeight);
                                                            _writer.WriteValue(_setting_height);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingWidth);
                                                            _writer.WriteValue(_setting_width);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabelposition);
                                                            _writer.WriteValue(_setting_labelposition);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingType);
                                                            _writer.WriteValue(_setting_type);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabel);
                                                            _writer.WriteValue(_setting_label);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDescription);
                                                            _writer.WriteValue(_setting_description);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingInput);
                                                            _writer.WriteValue(_setting_input);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingPlaceholder);
                                                            _writer.WriteValue(_setting_placeholder);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingEndPoint);
                                                            _writer.WriteValue(_setting_endpoint);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDefaultValue);
                                                            _writer.WriteValue(_setting_defaultValue);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDataParameter);
                                                            _writer.WriteValue(_setting_dataParameter);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingShowInGrid);
                                                            _writer.WriteValue(_setting_showingrid);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsDisabled);
                                                            _writer.WriteValue(_setting_isdisabled);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsOutput);
                                                            _writer.WriteValue(_setting_isoutput);

                                                            _writer.WriteEndObject();

                                                            break;
                                                        }
                                                    }
                                                    // End Settings Json

                                                    // Start Data Json

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Data);

                                                    _sqlQuery = new StringBuilder();
                                                    _sqlQuery.Append(" select  id, datavalue,imageValue, status ");
                                                    _sqlQuery.Append(" from data_save_main_live ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" comp_id = " + _comp_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" and candidate_guid = '" + _candidateGuid.ToString() + "'");
                                                    _sqlQuery.Append(" and form_id = '" + _layout_id.ToString() + "'");
                                                    _sqlQuery.Append(" order by id;");

                                                    //Call Function
                                                    (_functionReturn, _dataTableData, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableData.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesData in _dataTableData.Rows)
                                                        {
                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _data_id = rowtablesData["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesData["id"]);
                                                            if (_comp_name == "NgxIxcheckPhotouploaderAi" || _comp_name == "NgxIxcheckSignatureUploader")
                                                            {
                                                                _data_value = rowtablesData["imageValue"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["imageValue"]);
                                                                if (!string.IsNullOrEmpty(_data_value))
                                                                {
                                                                    string[] _image_value = _data_value.Split("~");
                                                                    _data_value = _image_value[0];
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _data_value = rowtablesData["datavalue"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["datavalue"]);
                                                                _data_value = GetComponentValueByGuid(_comp_name, _comp_id, _data_value);
                                                            }
                                                            _data_status = rowtablesData["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesData["status"]);



                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataId);
                                                            _writer.WriteValue(_data_id.ToString());

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataValue);
                                                            _writer.WriteValue(_data_value);

                                                            _writer.WriteEndObject();
                                                            break;
                                                        }
                                                    }

                                                    // End Data Json



                                                    // Start SubComponent Json
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponents);
                                                    _writer.WriteStartArray();

                                                    _sqlQuery = new StringBuilder();
                                                    _sqlQuery.Append(" select  id,reg_component_id,code,name,display_name, measurementType, ");
                                                    _sqlQuery.Append(" height,  width, labelposition, type, label, description, ");
                                                    _sqlQuery.Append(" input, placeholder, api_url, defaultValue, status, dataParameter, showingrid,isdisabled,isoutput, visibility ");
                                                    _sqlQuery.Append(" from reg_grid_components_main ");
                                                    _sqlQuery.Append(" WHERE ");
                                                    _sqlQuery.Append(" reg_component_id = " + _comp_id.ToString() + " and status = 1 ");
                                                    _sqlQuery.Append(" order by id; ");

                                                    //Call Function
                                                    (_functionReturn, _dataTableSubComponents, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                    if (_dataTableSubComponents.Rows.Count <= 0)
                                                    {
                                                        _writer.WriteStartObject();
                                                        _writer.WriteEndObject();
                                                    }
                                                    else
                                                    {
                                                        foreach (DataRow rowtablesSetting in _dataTableSubComponents.Rows)
                                                        {

                                                            //check NULLS and DATA TYPE here for returned column values
                                                            _sub_comp_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                            //_sub_comp_guid = rowtablesSetting["guid"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["guid"]);
                                                            _sub_comp_name = rowtablesSetting["name"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["name"]);
                                                            _sub_comp_code = rowtablesSetting["code"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["code"]);
                                                            _sub_comp_value = rowtablesSetting["display_name"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["display_name"]);
                                                            _sub_comp_group_name = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentId);
                                                            _writer.WriteValue(_sub_comp_id.ToString());

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentName);
                                                            _writer.WriteValue(_sub_comp_name);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentCode);
                                                            _writer.WriteValue(_sub_comp_code);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentValue);
                                                            _writer.WriteValue(_sub_comp_value);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentGroupName);
                                                            _writer.WriteValue(_sub_comp_group_name);

                                                            _sub_setting_id = rowtablesSetting["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesSetting["id"]);
                                                            _sub_setting_measurementType = rowtablesSetting["measurementType"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["measurementType"]);
                                                            _sub_setting_height = rowtablesSetting["height"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["height"]);
                                                            _sub_setting_width = rowtablesSetting["width"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["width"]);
                                                            _sub_setting_labelposition = rowtablesSetting["labelposition"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["labelposition"]);
                                                            _sub_setting_type = rowtablesSetting["type"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["type"]);
                                                            _sub_setting_label = rowtablesSetting["label"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["label"]);
                                                            _sub_setting_description = rowtablesSetting["description"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["description"]);
                                                            _sub_setting_input = rowtablesSetting["input"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["input"]);
                                                            _sub_setting_placeholder = rowtablesSetting["placeholder"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["placeholder"]);
                                                            _sub_setting_endpoint = rowtablesSetting["api_url"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["api_url"]);
                                                            _sub_setting_defaultValue = rowtablesSetting["defaultValue"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["defaultValue"]);
                                                            _sub_setting_status = rowtablesSetting["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["status"]);
                                                            _sub_setting_dataParameter = rowtablesSetting["dataParameter"] == DBNull.Value ? "" : Convert.ToString(rowtablesSetting["dataParameter"]);
                                                            _sub_setting_showingrid = rowtablesSetting["showingrid"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["showingrid"]);

                                                            _sub_setting_isdisabled = rowtablesSetting["isdisabled"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isdisabled"]);
                                                            _sub_setting_isoutput = rowtablesSetting["isoutput"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["isoutput"]);
                                                            _sub_setting_visibility = rowtablesSetting["visibility"] == DBNull.Value ? false : Convert.ToBoolean(rowtablesSetting["visibility"]);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentSettings);

                                                            _writer.WriteStartObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingId);
                                                            _writer.WriteValue(_sub_setting_id.ToString());

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingMeasurementType);
                                                            _writer.WriteValue(_sub_setting_measurementType);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingHeight);
                                                            _writer.WriteValue(_sub_setting_height);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingWidth);
                                                            _writer.WriteValue(_sub_setting_width);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabelposition);
                                                            _writer.WriteValue(_sub_setting_labelposition);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingType);
                                                            _writer.WriteValue(_sub_setting_type);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingLabel);
                                                            _writer.WriteValue(_sub_setting_label);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDescription);
                                                            _writer.WriteValue(_sub_setting_description);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingInput);
                                                            _writer.WriteValue(_sub_setting_input);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingPlaceholder);
                                                            _writer.WriteValue(_sub_setting_placeholder);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingEndPoint);
                                                            _writer.WriteValue(_sub_setting_endpoint);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDefaultValue);
                                                            _writer.WriteValue(_sub_setting_defaultValue);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingDataParameter);
                                                            _writer.WriteValue(_sub_setting_dataParameter);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingShowInGrid);
                                                            _writer.WriteValue(_sub_setting_showingrid);


                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsDisabled);
                                                            _writer.WriteValue(_sub_setting_isdisabled);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingIsOutput);
                                                            _writer.WriteValue(_sub_setting_isoutput);

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SettingVisibility);
                                                            _writer.WriteValue(_sub_setting_visibility);

                                                            _writer.WriteEndObject();

                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubComponentValidations);
                                                            _writer.WriteStartObject();
                                                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ValidationRequired);
                                                            _writer.WriteValue(_sub_setting_visibility);

                                                            _writer.WriteEndObject();

                                                            // Start Data Json

                                                            //_writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Data);

                                                            //_sqlQuery = new StringBuilder();
                                                            //_sqlQuery.Append(" select  id, datavalue, status ");
                                                            //_sqlQuery.Append(" from data_save_main_live ");
                                                            //_sqlQuery.Append(" WHERE ");
                                                            //_sqlQuery.Append(" comp_id = " + _comp_id.ToString() + " and status = 1 ");
                                                            //_sqlQuery.Append(" and candidate_guid = '" + _candidateGuid.ToString() + "'");
                                                            //_sqlQuery.Append(" and form_id = '" + _layout_id.ToString() + "'");
                                                            //_sqlQuery.Append(" order by id;");

                                                            ////Call Function
                                                            //(_functionReturn, _dataTableSubCompData, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);

                                                            //if (_dataTableSubCompData.Rows.Count <= 0)
                                                            //{
                                                            //    _writer.WriteStartObject();
                                                            //    _writer.WriteEndObject();
                                                            //}
                                                            //else
                                                            //{
                                                            //    foreach (DataRow rowtablesData2 in _dataTableSubCompData.Rows)
                                                            //    {
                                                            //        //check NULLS and DATA TYPE here for returned column values
                                                            //        _data_id = rowtablesData2["id"] == DBNull.Value ? 0 : Convert.ToUInt64(rowtablesData2["id"]);
                                                            //        _data_value = rowtablesData2["datavalue"] == DBNull.Value ? "" : Convert.ToString(rowtablesData2["datavalue"]);
                                                            //        _data_status = rowtablesData2["status"] == DBNull.Value ? "" : Convert.ToString(rowtablesData2["status"]);

                                                            //        _data_value = GetComponentValueByGuid(_comp_name, _comp_id, _data_value);

                                                            //        _writer.WriteStartObject();

                                                            //        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataId);
                                                            //        _writer.WriteValue(_data_id.ToString());

                                                            //        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DataValue);
                                                            //        _writer.WriteValue(_data_value);

                                                            //        _writer.WriteEndObject();
                                                            //        break;
                                                            //    }
                                                            //}

                                                            // End Data Json


                                                            _writer.WriteEndObject();
                                                            //break;
                                                        }
                                                    }
                                                    _writer.WriteEndArray();
                                                    // End SubComponent Json

                                                    _writer.WriteEndObject();
                                                }
                                            }
                                            _writer.WriteEndArray();
                                            // End Component Json
                                            _writer.WriteEndObject();
                                        }
                                    }

                                    _writer.WriteEndArray();
                                    // End section Json
                                    _writer.WriteEndObject();
                                }

                            }
                            _writer.WriteEndArray();
                            // End Page Json
                            _writer.WriteEndObject();
                        }

                    }

                    _writer.WriteEndObject();

                    _functionReturn.Status = true;

                    _jsonReturn = _sw.ToString();
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

        private string GetComponentValueByGuid(string _comp_name, ulong _comp_id, string _data_value)
        {
            string _methodName = "GetComponentValueByGuid";
            string _value = "";
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            StringBuilder _sqlQuery = null;
            DataTable _dataTable = null;
            IFunctionReturn _functionReturn = null;
            TimeSpan? _sqlconnTime = null;
            TimeSpan? _queryTime = null;
            DateTime _loopStart;
            int _randamNumber = 0;
            _functionReturn = new FunctionReturn();
            try
            {
                //GET DATA
                _value = _data_value;
                _sqlQuery = new StringBuilder();
                _dataTable = new DataTable();
                _sqlconnTime = new TimeSpan();
                _queryTime = new TimeSpan();
                if (_comp_name == "NgxIxcheckReligion")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from religion_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" religion_guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckMaritialstatus")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from martial_status_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" martial_status_guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckGender")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from gender_main ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" gender_guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckNationality")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from nationality_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" id = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckCategory")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from category_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" category_guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckCertificationIssuingAuthority")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from reg_certificate_issuing_authority  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" id = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckCertificationIssuingDistrict")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from reg_certificate_issuing_district  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" id = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckPhysicalDisability")
                {

                    if (_data_value == "1")
                    {
                        _value = "Yes";
                    }
                    else
                    {
                        _value = "No";
                    }
                }
                else if (_comp_name == "NgxIxcheckState")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from states_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" id = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckIdproof")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from id_proof_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" id_proof_guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckCityPriority2")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from city_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" city_guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckCityPriority1")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from city_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" city_guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckQualificationType")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from reg_qualification_type  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckNameOfDegree")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from reg_degree_name  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckUniversityStateBord")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from states_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckUniversityBord")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from university_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckSubjectStream")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from stream_main  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckMarksType")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from reg_marks_type  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else if (_comp_name == "NgxIxcheckGrade")
                {
                    _sqlQuery.Append(" select id,name,code ");
                    _sqlQuery.Append(" from reg_grade  ");
                    _sqlQuery.Append(" WHERE ");
                    _sqlQuery.Append(" guid = '" + _data_value + "' and status = 1 ");
                    _sqlQuery.Append(" order by id desc; ");

                    (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlQuery.ToString(), _methodName);
                    if (_dataTable.Rows.Count > 0)
                    {
                        _value = _dataTable.Rows[0]["name"].ToString();
                    }
                }
                else
                {
                    _value = _data_value;
                }
                _functionReturn.Status = true;


            }
            catch (Exception ex)
            {
                //ERROR

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
            return _value;
        }

        /// <summary>
        /// Reg Grid Component View List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> RegGridComponentViewListAsync(string _candidateGuid)
        {
            return Task.Run(() => RegGridComponentViewList(_candidateGuid));
        }
        /// <summary>
        /// Reg Grid Component View List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) RegGridComponentViewList(string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "F:Reg:RegGridComponentViewList";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            bool _success = true;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            //JSON data
            string _jsonReturn = string.Empty;
            string _errorMessage = "";
            #endregion
            //#region Input Sanitization and Validation
            //Validate Input

            try
            {
                //_candidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                if (_candidateGuid == null)
                    _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired; ;
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            //#endregion
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

                            #region Add Tab

                            if (string.IsNullOrEmpty(_candidateGuid))
                                _success = false;

                            if (_success)
                            {
                                _sqlQuery = new StringBuilder();
                                _sqlQuery.Append(" select d.row_guid as 'Row Guid', d.candidate_guid as 'Candidate Guid',d.reg_component_id as 'Reg Component Id',  ");
                                _sqlQuery.Append(" (select name from reg_qualification_type where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckQualificationType',d.value,null)) )as 'Qualification Type', ");
                                _sqlQuery.Append(" (select name from reg_degree_name where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckNameOfDegree',d.value,null))) as 'Name of Degree', ");
                                _sqlQuery.Append(" (select name from states_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityStateBord',d.value,null))) as 'University State', ");
                                _sqlQuery.Append(" (select name from university_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityBord',d.value,null))) as 'University / Board', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckDateofIssuingonFinalyearMarksheet',d.value,null)) as 'Date of issuing of Final year Marksheet', ");
                                _sqlQuery.Append(" (select name from stream_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckSubjectStream',d.value,null))) as 'Subject', ");
                                _sqlQuery.Append(" (select name from reg_marks_type where id= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksType',d.value,null))) as 'Marks Type', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksObtained',d.value,null)) as 'Marks Obtained/CGPA', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMaximumMarks',d.value,null)) as 'Maximum  Marks/CGPA', ");
                                _sqlQuery.Append(" (select name from reg_grade where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckGrade',d.value,null))) as 'Grade', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckpercentageMarksObtained',d.value,null)) as 'Percentage' ");

                                _sqlQuery.Append(" from reg_grid_components_main c ");
                                _sqlQuery.Append(" join  reg_data_gridvalues d on d.grid_component_id=c.id  ");
                                _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "'");
                                _sqlQuery.Append(" group by d.candidate_guid,d.row_guid;");


                                Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                                {
                                { ApplicationDatabaseConstants.ColumnNames.QualificationType2, (ApplicationJsonReturnConstants.PropertyNames.QualificationType2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.DegreeName3, (ApplicationJsonReturnConstants.PropertyNames.DegreeName3, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.UniversityBoardState3, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoardState3, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.UniversityBoard3, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoard2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.DateofIssuingonFinalyearMarksheet3, (ApplicationJsonReturnConstants.PropertyNames.DateofIssuingonFinalyearMarksheet3, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.Stream3, (ApplicationJsonReturnConstants.PropertyNames.Stream3, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MarksType2, (ApplicationJsonReturnConstants.PropertyNames.MarksType2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MarksObtained3, (ApplicationJsonReturnConstants.PropertyNames.MarksObtained3, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.MaximumMarks3, (ApplicationJsonReturnConstants.PropertyNames.MaximumMarks3, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.Grade2, (ApplicationJsonReturnConstants.PropertyNames.Grade2, DatabaseConstants.DataTypes.String) },
                                { ApplicationDatabaseConstants.ColumnNames.PercentageMarksObtained3, (ApplicationJsonReturnConstants.PropertyNames.PercentageMarksObtained3, DatabaseConstants.DataTypes.String) }
                                };

                                //Call Function
                                (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.RegGridComponentsMain, _dictionary, _stats.CacheCheckTime);
                            }
                            #endregion

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn.Status = true;
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordFetchedSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
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
                        _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.SystemError(exTran.Message, _methodName);
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

        /// <summary>
        /// Reg Grid Component View List Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetCandidateEligibilityAsync(string _candidateGuid)
        {
            return Task.Run(() => GetCandidateEligibility(_candidateGuid));
        }
        /// <summary>
        /// Reg Grid Component View List
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetCandidateEligibility(string _candidateGuid)
        {
            #region Local Variables
            string _methodName = "F:Reg:GetCandidateEligibility";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            bool _success = true;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            //JSON data
            string _jsonReturn = string.Empty;
            string _errorMessage = "";
            string _jsonString = string.Empty;

            //JSON data
            DataSet _dataSet = null;
            DataTable _dataTable = null;
            TimeSpan? _queryTime = null;
            DateTime _loopStart;
            string _category_name = string.Empty;
            string _category_guid = string.Empty;
            int _ph = 0;
            int _st = 0;
            int _sc = 0;
            int _obc = 0;
            int _general = 0;
            string _gender_name = string.Empty;
            string _gender_guid = string.Empty;
            bool _isXth_standard = false;
            string _Xth_grade = string.Empty;
            double _Xth_percentage = 0;
            bool _isXIIth_standard = false;
            string _XIIth_grade = string.Empty;
            double _XIIth_percentage = 0;
            bool _isGraduation = false;
            string _graduation_grade = string.Empty;
            double _graduation_percentage = 0;
            bool _isPG = false;
            string _pg_grade = string.Empty;
            double _pg_percentage = 0;
            bool _isDiploma = false;
            string _diploma_grade = string.Empty;
            double _diploma_percentage = 0;
            string _eligibility_function_guid = string.Empty;
            string _registration_guid = string.Empty;
            string _input_json = string.Empty;
            string _output_json = string.Empty;
            UInt64 _exam_to_candidate_id = 0;
            bool _isXth_match = false;
            bool _isXIIth_match = false;
            bool _isGraduation_match = false;
            bool _isDiploma_match = false;
            bool _isPG_match = false;
            List<QualifyExamEligibiltiy> lstQualifyExamEligibiltiy = new List<QualifyExamEligibiltiy>();
            #endregion
            //#region Input Sanitization and Validation
            //Validate Input

            try
            {
                //_candidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                if (_candidateGuid == null)
                    _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            //#endregion
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

                            #region Add Tab

                            if (string.IsNullOrEmpty(_candidateGuid))
                                _success = false;

                            if (_success)
                            {
                                _sqlQuery = new StringBuilder();
                                _sqlQuery.Append(" select id,guid,code,name,description,json,status ");
                                _sqlQuery.Append(" from reg_eligibility_functions_main; ");

                                _sqlQuery.Append(" select id,registrations_guid, reg_id,reg_code,first_name,middle_name,last_name, ");
                                _sqlQuery.Append(" father_name,dob,mobile_number,email_id,photo,signature,gender_guid,gender, ");
                                _sqlQuery.Append(" category_guid,category, ph,sc,st,obc,general,candidate_guid ");
                                _sqlQuery.Append(" from registration_data ");
                                _sqlQuery.Append(" where candidate_guid = '" + _candidateGuid + "'; ");


                                _sqlQuery.Append(" select d.row_guid as 'Row Guid', d.candidate_guid as 'Candidate Guid',d.reg_component_id as 'Reg Component Id',  ");
                                _sqlQuery.Append(" (select name from reg_qualification_type where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckQualificationType',d.value,null)) )as 'QualificationType', ");
                                _sqlQuery.Append(" (select name from reg_degree_name where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckNameOfDegree',d.value,null))) as 'NameofDegree', ");
                                _sqlQuery.Append(" (select name from states_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityStateBord',d.value,null))) as 'UniversityState', ");
                                _sqlQuery.Append(" (select name from university_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityBord',d.value,null))) as 'UniversityBoard', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckDateofIssuingonFinalyearMarksheet',d.value,null)) as 'DateofissuingofFinalyearMarksheet', ");
                                _sqlQuery.Append(" (select name from stream_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckSubjectStream',d.value,null))) as 'Subject', ");
                                _sqlQuery.Append(" (select name from reg_marks_type where id= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksType',d.value,null))) as 'MarksType', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksObtained',d.value,null)) as 'MarksObtained/CGPA', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMaximumMarks',d.value,null)) as 'MaximumMarks/CGPA', ");
                                _sqlQuery.Append(" (select name from reg_grade where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckGrade',d.value,null))) as 'Grade', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckpercentageMarksObtained',d.value,null)) as 'Percentage' ");

                                _sqlQuery.Append(" from reg_grid_components_main c ");
                                _sqlQuery.Append(" join  reg_data_gridvalues d on d.grid_component_id=c.id  ");
                                _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "'");
                                _sqlQuery.Append(" group by d.candidate_guid,d.row_guid;");

                                (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);
                                if (_dataSet.Tables[0].Rows.Count > 0)
                                {
                                    _eligibility_function_guid = _dataSet.Tables[0].Rows[0]["guid"] == DBNull.Value ? "" : Convert.ToString(_dataSet.Tables[0].Rows[0]["guid"]);
                                    _jsonString = _dataSet.Tables[0].Rows[0]["json"] == DBNull.Value ? "" : Convert.ToString(_dataSet.Tables[0].Rows[0]["json"]);
                                    EligibiltyDetail _eligibilty_detail = JsonConvert.DeserializeObject<EligibiltyDetail>(_jsonString);



                                    if (_dataSet.Tables[1].Rows.Count > 0)
                                    {
                                        DataRow row = _dataSet.Tables[1].Rows[0];
                                        _category_name = row["category"] == DBNull.Value ? "" : Convert.ToString(row["category"]);
                                        _category_guid = row["category_guid"] == DBNull.Value ? "" : Convert.ToString(row["category_guid"]);
                                        _gender_name = row["gender"] == DBNull.Value ? "" : Convert.ToString(row["gender"]);
                                        _gender_guid = row["gender_guid"] == DBNull.Value ? "" : Convert.ToString(row["gender_guid"]);
                                        _ph = row["ph"] == DBNull.Value ? 0 : Convert.ToInt32(row["ph"]);
                                        _sc = row["sc"] == DBNull.Value ? 0 : Convert.ToInt32(row["sc"]);
                                        _st = row["st"] == DBNull.Value ? 0 : Convert.ToInt32(row["st"]);
                                        _obc = row["obc"] == DBNull.Value ? 0 : Convert.ToInt32(row["obc"]);
                                        _general = row["general"] == DBNull.Value ? 0 : Convert.ToInt32(row["general"]);
                                        _registration_guid = row["registration_guid"] == DBNull.Value ? "" : Convert.ToString(row["registration_guid"]);
                                    }

                                    if (_dataSet.Tables[2].Rows.Count > 0)
                                    {
                                        foreach (DataRow row in _dataSet.Tables[2].Rows)
                                        {
                                            if (row["QualificationType"].ToString() == "High School(10th)")
                                            {
                                                _Xth_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isXth_standard = true;
                                                _Xth_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Intermediate(12th)")
                                            {
                                                _XIIth_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isXIIth_standard = true;
                                                _XIIth_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Diploma")
                                            {
                                                _diploma_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isDiploma = true;
                                                _diploma_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Graduation")
                                            {
                                                _graduation_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isGraduation = true;
                                                _graduation_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Post Graduation")
                                            {
                                                _pg_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isPG = true;
                                                _pg_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }
                                        }
                                    }
                                    if (_eligibilty_detail.ExamEligibiltiy.RegistrationGuid == _registration_guid)
                                    {
                                        List<Exam> _exam_list = _eligibilty_detail.ExamEligibiltiy.Exams;
                                        foreach (var _exam in _exam_list)
                                        {
                                            QualifyExamEligibiltiy _qualifyExamEligibiltiy = new QualifyExamEligibiltiy();
                                            string _examName = _exam.ExamName;
                                            string _examGuid = _exam.ExamGuid;
                                            _qualifyExamEligibiltiy.ExamGuid = _examGuid;
                                            _qualifyExamEligibiltiy.ExamName = _examName;
                                            _qualifyExamEligibiltiy.Status = false;
                                            List<EligibiltiyCriteria> _eligibility_criteria = _exam.EligibilityCriteria;
                                            if (_eligibility_criteria.Count > 0)
                                            {

                                                foreach (var _ec in _eligibility_criteria)
                                                {
                                                    string _CategoryName = _ec.CategoryName;
                                                    string _CategoryGuid = _ec.CategoryGuid;
                                                    string _ph_e = _ec.Ph;
                                                    List<Education> _education_list = _ec.Education;
                                                    if (_category_guid == _CategoryGuid || _category_name == _CategoryName)
                                                    {
                                                        if (_education_list.Count > 0)
                                                        {
                                                            var _qur10 = _education_list.Find(m => m.QualificationTypeName == "High School(10th)");
                                                            var _qur12 = _education_list.Find(m => m.QualificationTypeName == "Intermediate(12th)");
                                                            var _qurDiploma = _education_list.Find(m => m.QualificationTypeName == "Diploma");
                                                            var _qurGraduation = _education_list.Find(m => m.QualificationTypeName == "Graduation");
                                                            var _qurPG = _education_list.Find(m => m.QualificationTypeName == "Post Graduation");
                                                            //10th Status
                                                            if (_qur10 != null)
                                                            {
                                                                if (_Xth_percentage >= Convert.ToDouble(_qur10.Percentage))
                                                                {
                                                                    _isXth_match = true;
                                                                }
                                                                else
                                                                {
                                                                    _isXth_match = false;
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _isXth_match = true;
                                                            }

                                                            //12th Status
                                                            if (_qur12 != null)
                                                            {
                                                                if (_XIIth_percentage >= Convert.ToDouble(_qur12.Percentage))
                                                                {
                                                                    _isXIIth_match = true;
                                                                }
                                                                else
                                                                {
                                                                    _isXIIth_match = false;
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _isXIIth_match = true;
                                                            }

                                                            //Diploma Status
                                                            if (_qurDiploma != null)
                                                            {
                                                                if (_diploma_percentage >= Convert.ToDouble(_qurDiploma.Percentage))
                                                                {
                                                                    _isDiploma_match = true;
                                                                }
                                                                else
                                                                {
                                                                    _isDiploma_match = false;
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _isDiploma_match = true;
                                                            }

                                                            //Graduation Status
                                                            if (_qurGraduation != null)
                                                            {
                                                                if (_graduation_percentage >= Convert.ToDouble(_qurGraduation.Percentage))
                                                                {
                                                                    _isGraduation_match = true;
                                                                }
                                                                else
                                                                {
                                                                    _isGraduation_match = false;
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _isGraduation_match = true;
                                                            }

                                                            //Post Graduation Status
                                                            if (_qurPG != null)
                                                            {
                                                                if (_pg_percentage >= Convert.ToDouble(_qurPG.Percentage))
                                                                {
                                                                    _isPG_match = true;
                                                                }
                                                                else
                                                                {
                                                                    _isPG_match = false;
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _isPG_match = true;
                                                            }

                                                            if (_qurPG != null)
                                                            {
                                                                if (_pg_percentage >= Convert.ToDouble(_qurPG.Percentage))
                                                                {
                                                                    _isPG_match = true;
                                                                }
                                                                else
                                                                {
                                                                    _isPG_match = false;
                                                                }
                                                            }
                                                            else
                                                            {
                                                                _isPG_match = true;
                                                            }
                                                            //foreach (var _ed in _education_list)
                                                            //{
                                                            //    string _qualificationTypeName = _ed.QualificationTypeName;
                                                            //    string _qualificationTypeGuid = _ed.QualificationTypeGuid;
                                                            //    string _degreeName = _ed.DegreeName;
                                                            //    string _degreeGuid = _ed.DegreeGuid;
                                                            //    string _percentage = _ed.Percentage;
                                                            //    string _grade = _ed.Grade;
                                                            //}
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                _isXth_match = true;
                                                _isXIIth_match = true;
                                                _isGraduation_match = true;
                                                _isDiploma_match = true;
                                                _isPG_match = true;
                                            }

                                            if (_isXth_match && _isXIIth_match && _isGraduation_match && _isDiploma_match && _isPG_match)
                                            {
                                                _qualifyExamEligibiltiy.Status = true;
                                            }

                                            lstQualifyExamEligibiltiy.Add(_qualifyExamEligibiltiy);
                                        }

                                        _sqlQuery.Clear();
                                        _sqlQuery.Append("INSERT INTO `exam_to_candidate` ( ");
                                        _sqlQuery.Append("`registration_guid`");
                                        _sqlQuery.Append(",`candidate_guid`");
                                        _sqlQuery.Append(",`eligibility_function_guid`");
                                        _sqlQuery.Append(",`input_json`");
                                        _sqlQuery.Append(",`output_json`");
                                        _sqlQuery.Append(",`status`");
                                        _sqlQuery.Append(" ) VALUES ( ");
                                        _sqlQuery.Append("'" + _registration_guid + "'");
                                        _sqlQuery.Append(",'" + _candidateGuid + "'");
                                        _sqlQuery.Append(",'" + _eligibility_function_guid + "'");
                                        _sqlQuery.Append(",'" + _input_json + "'");
                                        _sqlQuery.Append(",'" + _output_json + "'");
                                        _sqlQuery.Append(",'1'");
                                        _sqlQuery.Append(" ); ");
                                        _sqlQuery.Append("select LAST_INSERT_ID();");

                                        _mySqlCommand.CommandText = _sqlQuery.ToString();
                                        _exam_to_candidate_id = (UInt64)_mySqlCommand.ExecuteScalar();

                                        if (_exam_to_candidate_id <= 0)
                                        {
                                            _success = false;
                                        }
                                    }
                                    else
                                    {
                                        _success = false;
                                        _errorMessage = "Registration guid is not matched";
                                    }
                                }

                                //Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                                //{
                                //{ ApplicationDatabaseConstants.ColumnNames.QualificationType2, (ApplicationJsonReturnConstants.PropertyNames.QualificationType2, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.DegreeName3, (ApplicationJsonReturnConstants.PropertyNames.DegreeName3, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.UniversityBoardState3, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoardState3, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.UniversityBoard3, (ApplicationJsonReturnConstants.PropertyNames.UniversityBoard2, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.DateofIssuingonFinalyearMarksheet3, (ApplicationJsonReturnConstants.PropertyNames.DateofIssuingonFinalyearMarksheet3, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.Stream3, (ApplicationJsonReturnConstants.PropertyNames.Stream3, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.MarksType2, (ApplicationJsonReturnConstants.PropertyNames.MarksType2, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.MarksObtained3, (ApplicationJsonReturnConstants.PropertyNames.MarksObtained3, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.MaximumMarks3, (ApplicationJsonReturnConstants.PropertyNames.MaximumMarks3, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.Grade2, (ApplicationJsonReturnConstants.PropertyNames.Grade2, DatabaseConstants.DataTypes.String) },
                                //{ ApplicationDatabaseConstants.ColumnNames.PercentageMarksObtained3, (ApplicationJsonReturnConstants.PropertyNames.PercentageMarksObtained3, DatabaseConstants.DataTypes.String) }
                                //};

                                ////Call Function
                                //(_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.RegGridComponentsMain, _dictionary, _stats.CacheCheckTime);
                            }
                            #endregion

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn.Status = true;
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordFetchedSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
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
                        _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.SystemError(exTran.Message, _methodName);
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
        /// <summary>
        /// Save Exam Eligibility Criteria Async
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> SaveExamEligibilityCriteriaAsync(string _candidateGuid, string _registrationGuid)
        {
            return Task.Run(() => SaveExamEligibilityCriteria(_candidateGuid, _registrationGuid));
        }

        /// <summary>
        /// Save Exam Eligibility Criteria
        /// </summary>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns>IFunctionReturn</returns>
        private (string jsonReturn, IFunctionReturn functionReturn) SaveExamEligibilityCriteria(string _candidateGuid, string _registrationGuid)
        {
            #region Local Variables
            string _methodName = "F:Reg:SaveExamEligibilityCriteria";
            MySqlConnection _mySqlConnection = null;
            MySqlCommand _mySqlCommand = null;
            StringBuilder _sqlQuery = null;
            IFunctionReturn _functionReturn = null;
            string _sqlConnectionString = string.Empty;
            MySqlTransaction _mytransaction = null;
            bool _success = true;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            //JSON data
            string _jsonReturn = string.Empty;
            string _errorMessage = "";
            string _jsonString = string.Empty;

            //JSON data
            DataSet _dataSet = null;
            DataTable _dataTable = null;
            TimeSpan? _queryTime = null;
            DateTime _loopStart;
            string _category_name = string.Empty;
            string _category_guid = string.Empty;
            string _dob = string.Empty;
            int _ph = 0;            
            string _gender_name = string.Empty;
            string _gender_guid = string.Empty;
            bool _isXth_standard = false;
            string _Xth_grade = string.Empty;
            double _Xth_percentage = 0;
            bool _isXIIth_standard = false;
            string _XIIth_grade = string.Empty;
            double _XIIth_percentage = 0;
            bool _isGraduation = false;
            string _graduation_grade = string.Empty;
            double _graduation_percentage = 0;
            bool _isPG = false;
            string _pg_grade = string.Empty;
            double _pg_percentage = 0;
            bool _isDiploma = false;
            string _diploma_grade = string.Empty;
            double _diploma_percentage = 0;
            string _eligibility_function_guid = string.Empty;
            string _registration_guid = string.Empty;
            string _input_json = string.Empty;
            string _output_json = string.Empty;
            UInt64 _qualification_criteria_id = 0;


            bool _isXth_match = false;
            bool _isXIIth_match = false;
            bool _isGraduation_match = false;
            bool _isDiploma_match = false;
            bool _isPG_match = false;


            StringWriter _sw = null;
            JsonTextWriter _writer = null;
           
            List<QualifyExamEligibiltiy> lstQualifyExamEligibiltiy = new List<QualifyExamEligibiltiy>();
            #endregion
            //#region Input Sanitization and Validation
            //Validate Input

            try
            {
                //_candidateGuid = "e2381474-777f-11eb-8f5e-5a28b94f0bf6";
                if (_candidateGuid == null)
                    _errorMessage = ApplicationConstants.ValidationMessages.CandidateGuidRequired;
            }
            catch (Exception ex)
            {
                //ERROR - Treating as App Error
                _errorMessage = ex.Message;
            }
            //#endregion
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

                            #region Add Tab

                            if (string.IsNullOrEmpty(_candidateGuid))
                                _success = false;

                            if (_success)
                            {
                                _sqlQuery = new StringBuilder();
                                _sqlQuery.Append(" select id,guid,code,name,description,json,status ");
                                _sqlQuery.Append(" from reg_eligibility_functions_main; ");


                                _sqlQuery.Append(" select  (select name from category_main where category_guid= max(if(c.name='NgxIxcheckCategory',d.datavalue,null))) as Category, ");
                                _sqlQuery.Append(" (select name from gender_main where gender_guid=max(if(c.name='NgxIxcheckGender',d.datavalue,null))) as Gender, ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckPhysicalDisability',d.datavalue,'0')) as PhysicalDisability, ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckDateofbirth',d.datavalue,null)) as DOB ");
                                _sqlQuery.Append("  from components_main c ");
                                _sqlQuery.Append(" join  data_save_main_live d on d.comp_id=c.id  ");
                                _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "';");

                                _sqlQuery.Append(" select registration_guid, exam_guid  ");                                
                                _sqlQuery.Append(" from registration_to_exam ");                                
                                _sqlQuery.Append(" where registration_guid='" + _registrationGuid + "';");                                


                                _sqlQuery.Append(" select d.row_guid as 'Row Guid', d.candidate_guid as 'Candidate Guid',d.reg_component_id as 'Reg Component Id',  ");
                                _sqlQuery.Append(" (select name from reg_qualification_type where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckQualificationType',d.value,null)) )as 'QualificationType', ");
                                _sqlQuery.Append(" (select name from reg_degree_name where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckNameOfDegree',d.value,null))) as 'NameofDegree', ");
                                _sqlQuery.Append(" (select name from states_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityStateBord',d.value,null))) as 'UniversityState', ");
                                _sqlQuery.Append(" (select name from university_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckUniversityBord',d.value,null))) as 'UniversityBoard', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckDateofIssuingonFinalyearMarksheet',d.value,null)) as 'DateofissuingofFinalyearMarksheet', ");
                                _sqlQuery.Append(" (select name from stream_main where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckSubjectStream',d.value,null))) as 'Subject', ");
                                _sqlQuery.Append(" (select name from reg_marks_type where id= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksType',d.value,null))) as 'MarksType', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMarksObtained',d.value,null)) as 'MarksObtained/CGPA', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckMaximumMarks',d.value,null)) as 'MaximumMarks/CGPA', ");
                                _sqlQuery.Append(" (select name from reg_grade where guid= ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckGrade',d.value,null))) as 'Grade', ");
                                _sqlQuery.Append(" max(if(c.name='NgxIxcheckpercentageMarksObtained',d.value,null)) as 'Percentage' ");

                                _sqlQuery.Append(" from reg_grid_components_main c ");
                                _sqlQuery.Append(" join  reg_data_gridvalues d on d.grid_component_id=c.id  ");
                                _sqlQuery.Append(" where d.candidate_guid='" + _candidateGuid + "'");
                                _sqlQuery.Append(" group by d.candidate_guid,d.row_guid;");

                                (_functionReturn, _dataSet, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataSet(_sqlQuery.ToString(), _methodName);
                                if (_dataSet.Tables[0].Rows.Count > 0)
                                {
                                    _eligibility_function_guid = _dataSet.Tables[0].Rows[0]["guid"] == DBNull.Value ? "" : Convert.ToString(_dataSet.Tables[0].Rows[0]["guid"]);
                                 

                                    if (_dataSet.Tables[1].Rows.Count > 0)
                                    {
                                        DataRow row = _dataSet.Tables[1].Rows[0];
                                        _category_name = row["Category"] == DBNull.Value ? "" : Convert.ToString(row["Category"]);                                        
                                        _gender_name = row["Gender"] == DBNull.Value ? "" : Convert.ToString(row["Gender"]);                                        
                                        _ph = row["PhysicalDisability"] == DBNull.Value ? 0 : Convert.ToInt32(row["PhysicalDisability"]);
                                        _dob = row["DOB"] == DBNull.Value ? "" : Convert.ToString(row["DOB"]);
                                        
                                    }

                                    if (_dataSet.Tables[3].Rows.Count > 0)
                                    {
                                        foreach (DataRow row in _dataSet.Tables[3].Rows)
                                        {
                                            if (row["QualificationType"].ToString() == "High School(10th)")
                                            {
                                                _Xth_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isXth_standard = true;
                                                _Xth_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Intermediate(12th)")
                                            {
                                                _XIIth_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isXIIth_standard = true;
                                                _XIIth_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Diploma")
                                            {
                                                _diploma_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isDiploma = true;
                                                _diploma_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Graduation")
                                            {
                                                _graduation_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isGraduation = true;
                                                _graduation_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }

                                            if (row["QualificationType"].ToString() == "Post Graduation")
                                            {
                                                _pg_percentage = row["Percentage"] == DBNull.Value ? 0 : Convert.ToDouble(row["Percentage"]);
                                                _isPG = true;
                                                _pg_grade = row["Grade"] == DBNull.Value ? "" : Convert.ToString(row["Grade"]);
                                            }
                                        }
                                    }

                                    // Start Input Json
                                    _sw = new StringWriter();
                                    _writer = new JsonTextWriter(_sw);

                                   
                                    _writer.WriteStartObject();
                                    _loopStart = DateTime.Now;
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.EligibilityCriteria);
                                    if (_dataSet.Tables[2].Rows.Count <= 0)
                                    {
                                        _writer.WriteStartObject();
                                        _writer.WriteEndObject();
                                    }
                                    else
                                    {
                                        _writer.WriteStartObject();

                                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Category);
                                        _writer.WriteValue(_category_name);
                                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Gender);
                                        _writer.WriteValue(_gender_name);
                                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Dob);
                                        _writer.WriteValue(_dob);

                                        ////////////////Start Qualification Json///////////////////////////////////

                                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Qualification);
                                        _writer.WriteStartArray();

                                        if (_dataSet.Tables[3].Rows.Count <= 0)
                                        {
                                            _writer.WriteStartObject();
                                            _writer.WriteEndObject();
                                        }
                                        else
                                        {

                                            foreach (DataRow row in _dataSet.Tables[3].Rows)
                                            {
                                                _writer.WriteStartObject();
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QualificationType);
                                                _writer.WriteValue(row["QualificationType"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DegreeName);
                                                _writer.WriteValue(row["NameofDegree"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.UniversityBoardState);
                                                _writer.WriteValue(row["UniversityState"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.UniversityBoard);
                                                _writer.WriteValue(row["UniversityBoard"].ToString());

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.DateofIssuingonFinalyearMarksheet);
                                                _writer.WriteValue(row["DateofissuingofFinalyearMarksheet"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Stream);
                                                _writer.WriteValue(row["Subject"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MarksType);
                                                _writer.WriteValue(row["MarksType"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MarksObtained);
                                                _writer.WriteValue(row["MarksObtained/CGPA"].ToString());

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MaximumMarks);
                                                _writer.WriteValue(row["MaximumMarks/CGPA"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Grade);
                                                _writer.WriteValue(row["Grade"].ToString());
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PercentageMarksObtained);
                                                _writer.WriteValue(row["Percentage"].ToString());
                                                _writer.WriteEndObject();
                                            }
                                        }

                                        _writer.WriteEndArray();
                                        // End Page Json
                                        //_writer.WriteEndObject();


                                        ////////////////Start Exam Json///////////////////////////////////

                                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Exams);
                                        _writer.WriteStartArray();

                                        if (_dataSet.Tables[2].Rows.Count <= 0)
                                        {
                                            _writer.WriteStartObject();
                                            _writer.WriteEndObject();
                                        }
                                        else
                                        {

                                            foreach (DataRow row in _dataSet.Tables[2].Rows)
                                            {
                                                _writer.WriteStartObject();
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamGuid);
                                                _writer.WriteValue(row["exam_guid"].ToString());                                                
                                                _writer.WriteEndObject();
                                            }
                                        }

                                        _writer.WriteEndArray();
                                        // End Exam Json
                                        _writer.WriteEndObject();
                                    }

                                    _writer.WriteEndObject();

                                    _input_json = _sw.ToString();
                                    // End Input Json

                                    // Start Output Json
                                    _sw = new StringWriter();
                                    _writer = new JsonTextWriter(_sw);
                                    
                                    _writer.WriteStartObject();
                                    _loopStart = DateTime.Now;
                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamElgibilityStatus);
                                    if (_dataSet.Tables[2].Rows.Count <= 0)
                                    {
                                        _writer.WriteStartObject();
                                        _writer.WriteEndObject();
                                    }
                                    else
                                    {
                                        _writer.WriteStartObject();


                                        ////////////////Start Exam Json///////////////////////////////////

                                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Exams);
                                        _writer.WriteStartArray();

                                        if (_dataSet.Tables[2].Rows.Count <= 0)
                                        {
                                            _writer.WriteStartObject();
                                            _writer.WriteEndObject();
                                        }
                                        else
                                        {

                                            foreach (DataRow row in _dataSet.Tables[2].Rows)
                                            {
                                                _writer.WriteStartObject();
                                                
                                               
                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamGuid);
                                                _writer.WriteValue(row["exam_guid"].ToString());

                                                if (_isXIIth_standard == true && _XIIth_percentage>50)
                                                {
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                    _writer.WriteValue("1");
                                                    //_writer.WriteValue(row["exam_guid"].ToString());

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                    _writer.WriteValue("Qualified");
                                                    //_writer.WriteValue(row["exam_guid"].ToString());
                                                }
                                                else
                                                {
                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                    _writer.WriteValue("0");
                                                    //_writer.WriteValue(row["exam_guid"].ToString());

                                                    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                    _writer.WriteValue("Not Qualified");
                                                    //_writer.WriteValue(row["exam_guid"].ToString());
                                                }

                                                //if (_isXth_standard == true)
                                                //{
                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                //    _writer.WriteValue("1");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());

                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                //    _writer.WriteValue("Qualified");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());
                                                //}
                                                //else if (_isXIIth_standard == true)
                                                //{
                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                //    _writer.WriteValue("1");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());

                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                //    _writer.WriteValue("Qualified");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());
                                                //}
                                                //else if (_isDiploma == true)
                                                //{
                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                //    _writer.WriteValue("1");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());

                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                //    _writer.WriteValue("Qualified");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());
                                                //}
                                                //else if (_isGraduation == true)
                                                //{
                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                //    _writer.WriteValue("1");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());

                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                //    _writer.WriteValue("Qualified");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());
                                                //}
                                                //else if (_isPG == true)
                                                //{
                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                //    _writer.WriteValue("1");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());

                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                //    _writer.WriteValue("Qualified");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());
                                                //}
                                                //else
                                                //{
                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Status);
                                                //    _writer.WriteValue("0");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());

                                                //    _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Message);
                                                //    _writer.WriteValue("Not Qualified");
                                                //    //_writer.WriteValue(row["exam_guid"].ToString());
                                                //}
                                                _writer.WriteEndObject();
                                            }
                                        }

                                        _writer.WriteEndArray();
                                        // End Exam Json
                                        _writer.WriteEndObject();
                                    }

                                    _writer.WriteEndObject();

                                    _output_json = _sw.ToString();

                                }
                                if(_input_json!="" && _output_json!="")                                
                                {
                                    _sqlQuery.Clear();
                                    _sqlQuery.Append("INSERT INTO `registration_to_qualification_criteria` ( ");
                                    _sqlQuery.Append("`registration_guid`");
                                    _sqlQuery.Append(",`eligibility_function_guid`");
                                    _sqlQuery.Append(",`input_json`");
                                    _sqlQuery.Append(",`output_json`");                                    
                                    _sqlQuery.Append(",`status`");
                                    _sqlQuery.Append(" ) VALUES ( ");
                                    _sqlQuery.Append("'" + _registrationGuid + "'");
                                    _sqlQuery.Append(",'" + _eligibility_function_guid + "'");
                                    _sqlQuery.Append(",'" + _input_json + "'");
                                    _sqlQuery.Append(",'" + _output_json + "'");                                   
                                    _sqlQuery.Append(",'1'");
                                    _sqlQuery.Append(" ); ");
                                    _sqlQuery.Append("select LAST_INSERT_ID();");

                                    _mySqlCommand.CommandText = _sqlQuery.ToString();
                                    _qualification_criteria_id = (UInt64)_mySqlCommand.ExecuteScalar();

                                    if (_qualification_criteria_id <= 0)
                                    {
                                        _success = false;
                                    }
                                }
                                else
                                {
                                    _success = false;
                                }
                            }
                            #endregion

                            if (_success)
                            {
                                _mytransaction?.Commit();
                                _functionReturn.Status = true;
                                _functionReturn = CommonFunctions.AppSuccess(ApplicationConstants.GenericMessages.RecordSavedSuccessfully, _methodName);
                            }
                            else
                            {
                                _functionReturn = CommonFunctions.AppError(_errorMessage, _methodName);
                                _mytransaction?.Rollback();
                            }
                            //Cleanup
                            _mySqlCommand?.Dispose();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                _mytransaction?.Rollback();
                                _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                                _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
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
                        _functionReturn = CommonFunctions.SystemError(ex.Message, _methodName);
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, System.Reflection.MethodBase.GetCurrentMethod().Name + ": " + ex.Message);
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn = CommonFunctions.SystemError(exTran.Message, _methodName);
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
