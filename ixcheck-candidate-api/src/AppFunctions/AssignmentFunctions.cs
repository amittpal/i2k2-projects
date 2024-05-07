using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;

using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;

using Microsoft.Extensions.Configuration;
using IXCheckCandidateApi.Globals;
using IXCheckCandidateApi.AppFunctions.Interfaces;

namespace IXCheckCandidateApi.AppFunctions
{
    public class AssignmentFunctions : IAssignmentFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly IDatabaseFunctions _databaseFunctions;
        private readonly IStats _stats;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__databaseSettings"></param>
        /// <param name="__jwtIssuerOptions"></param>
        public AssignmentFunctions(IDatabaseSettings __databaseSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration)
        {
            _databaseSettings = __databaseSettings;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _configuration = __configuration;
        }

        /// <summary>
        /// Get Exam via http request
        /// </summary>
        /// <param name="sdsdsd"></param>
        /// <param name=""></param>
        /// <returns>(string jsonReturn, IFunctionReturn functionReturn)</returns>
        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetRegistrationLinkAsync()
        {
            return Task.Run(() => GetRegistrationLink());
        }


        private (string jsonReturn, IFunctionReturn functionReturn) GetRegistrationLink()
        {

            #region Local Variables
            string _methodName = "F:Assignment:GetAssignmentLink";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            string _jsonReturn = string.Empty;
            #endregion

            if (_functionReturn.Message.Count <= 0)
            {
                try
                {
                    //GET DATA
                    _sqlQuery = new StringBuilder();
                    //Get Question        
                    _sqlQuery.Clear();
                    _sqlQuery.Append(" select  CM.value exam_url , CT.name config_type_name  , CK.name  config_key_name   from config_main  CM ");
                    _sqlQuery.Append(" inner join config_keys CK on CM.config_key_id = CK.id ");
                    _sqlQuery.Append(" inner join config_types CT on CM.config_type_id = CT.id ");
                   
                    //Create Dictionary Object and Add Columns, JsonProperty Names and Data Types
                    Dictionary<string, (string, string)> _dictionary = new Dictionary<string, (string, string)>
                    {
                        { ApplicationDatabaseConstants.ColumnNames.ExamURL, (ApplicationJsonReturnConstants.PropertyNames.ExamURL, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.ConfigTypeNAme, (ApplicationJsonReturnConstants.PropertyNames.ConfigTypeNAme, DatabaseConstants.DataTypes.String) },
                        { ApplicationDatabaseConstants.ColumnNames.Config_KeyName, (ApplicationJsonReturnConstants.PropertyNames.Config_KeyName, DatabaseConstants.DataTypes.String) },
                        
                    };

                    //Call Function
                    (_functionReturn, _jsonReturn) = _databaseFunctions.ExecuteSelectJSON(_sqlQuery.ToString(), _methodName, ApplicationJsonReturnConstants.PropertyNames.ExamLink, _dictionary, _stats.CacheCheckTime);
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



        //
    }
}
