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
using System.Threading;
using System.IO;
using VistaDB.Provider;
using VistaDB;

namespace IXCheckCandidateApi.AppFunctions
{
    public class MockExamFunctions : IMockExamFunctions
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
        /// <param name="__loggerFunctions"></param>
        public MockExamFunctions(IDatabaseSettings __databaseSettings, ILoggerFunctions __loggerFunctions, IApiSettings __apiSettings, IDatabaseFunctions __databaseFunctions, IStats __stats, IConfiguration __configuration, IHttpClientFunctions __httpClientFunctions)
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
        /// GetFullExamVistaDB
        /// </summary>
        /// <returns></returns>
        private (string jsonReturn, IFunctionReturn functionReturn) GetMockExamVistaDB()
        {
            #region Local Variables
            string _methodName = "C:MockExam:GetMockExamVistaDB";
            StringBuilder _sqlQuery;
            IFunctionReturn _functionReturn = new FunctionReturn();
            StringWriter _sw = null;
            JsonTextWriter _writer = null;
            DataSet _dataSet;
            string _jsonReturn = string.Empty;
            string _questionGuid = "";
            string _languageGuid = "";
            string _optionNumber = "";
            string _description = "";
            string _questionDescription = "";
            string _matchDescription = "";
            string _optionGuid = "";
            string _matchGuid = "";
            string _sectionGuid = "";
            string _sectionName = "";
            string _answerType = "";
            string _languageName = "";
            string _numberOfOptions = "";
            string _answerTypeCode = "";
            string _primary_question_guid = "";
            string _subjectGuid = "";
            string _subject = "";
            string _statusGuid = "";
            string _status = "";
            string _questionNumber = "";
            string _statusName = "";
            string _statusCssTag = "";
            string _noOfQuestions = "";
            string _statusCode = "";
            string _saveAnswerKey = "";
            double _allowDurationInSeconds = 0;
            DateTime _loopStart;
            DateTime _loopEnd;
            TimeSpan _loopTime;
            short SECTIONS = 0;
            short QUESTIONCOUNTSANDSTATUS = 1;
            short SECTIONQUESTIONSTATUS = 2;
            short QUESTIONS = 3;
            short MATCHOPTIONS = 4;
            short EXAMINFO = 5;
            TimeSpan? _sqlconnTime;
            TimeSpan? _queryTime;
            #endregion

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
                    //Get Section                     
                    _sqlQuery.Append("SELECT section_guid,section_name FROM sections_main ");
                    // _sqlQuery.Append("WHERE exam_guid = '" + _examGuid + "' ; ");
                    _sqlQuery.Append(";");

                    //Get question count by status
                    _sqlQuery.Append("SELECT ext.status_guid,regs.code AS status_code,regs.name AS status_name, regs.css_tag AS status_css_tag,isnull(ext.no_of_questions,0) as  no_of_questions FROM ");
                    //_sqlQuery.Append("(SELECT rqm.status_guid AS status_guid,COUNT(1) AS no_of_questions FROM reg_questions_main AS rqm ");
                    //_sqlQuery.Append("JOIN registrations_main rm on rm.id=rqm.reg_id ");
                    // _sqlQuery.Append("WHERE rm.id = '" + _candidateGuid + "' ");
                    _sqlQuery.Append("(SELECT rqm.status_guid AS status_guid,COUNT(1) AS no_of_questions FROM exam_questions AS rqm ");
                    _sqlQuery.Append("GROUP BY rqm.status_guid ) AS ext ");
                    _sqlQuery.Append("RIGHT JOIN registrations_status AS regs ON ext.status_guid = regs.status_guid ");
                    _sqlQuery.Append("where regs.status_type=2 order by sequence; ");
                    // _sqlQuery.Append(" order by sequence; ");
                    //_sqlQuery.Append("AND qm.language_guid = em.primary_language_guid ");

                    //section_questions_status
                    _sqlQuery.Append(" SELECT qsm.question_guid, rqm.sequence_number as question_number,  stm.status_guid,stm.code  AS status_code, stm.name as status_name, stm.css_tag as status_css_tag, sqm.section_guid, qsm.language_guid, qsm.primary_question_guid ");
                    _sqlQuery.Append(" FROM   questions_main qsm  ");
                    _sqlQuery.Append(" INNER JOIN section_questions_main sqm   ON sqm.section_question_guid = qsm.section_question_guid ");
                    _sqlQuery.Append(" INNER JOIN sections_main sm  ON sm.section_guid = sqm.section_guid ");
                    _sqlQuery.Append(" INNER JOIN exams_main em  ON em.exam_guid = sm.exam_guid ");
                    _sqlQuery.Append(" INNER JOIN uoms_main um  ON um.uom_guid = em.duration_uom_guid ");
                    _sqlQuery.Append(" INNER JOIN exam_questions rqm ON rqm.question_guid = qsm.question_guid ");
                    //_sqlQuery.Append(" INNER JOIN reg_questions_main rqm  ON rqm.question_guid = qsm.question_guid ");
                    _sqlQuery.Append(" INNER JOIN registrations_status stm  ON stm.status_guid = rqm.status_guid ");
                    //_sqlQuery.Append(" where rqm.reg_id=" + _candidateGuid + " ");
                    _sqlQuery.Append(" order by rqm.sequence_number ; ");

                    //Get Question
                    _sqlQuery.Append(" SELECT DISTINCT qm.question_guid,sm.exam_guid,  qm.description AS question_description,  qm.language_guid ");
                    _sqlQuery.Append(" ,lmn.NAME AS language_name,  sm.section_guid, sm.section_name,  atp.code  AS answer_type_code, atp.name as answer_type ");
                    _sqlQuery.Append(" ,qtp.number_of_options,qm.primary_question_guid ,  sbm.subject_guid, sbm.NAME AS subject, stm.status_guid, stm.NAME  AS status_name ");
                    _sqlQuery.Append(" ,stm.code  AS status_code,  stm.css_tag  AS status_css_tag, rqm.sequence_number AS question_number ");
                    _sqlQuery.Append(" FROM   questions_main qm ");
                    _sqlQuery.Append(" INNER JOIN section_questions_main sqm  ON sqm.section_question_guid = qm.section_question_guid ");
                    _sqlQuery.Append(" INNER JOIN sections_main sm  ON sm.section_guid = sqm.section_guid ");
                    _sqlQuery.Append(" INNER JOIN languages_main lmn  ON lmn.language_guid = qm.language_guid ");
                    _sqlQuery.Append(" INNER JOIN question_types qtp  ON qtp.question_type_guid = sqm.question_type_guid ");
                    _sqlQuery.Append(" INNER JOIN answer_types atp ON atp.answer_type_guid = qtp.answer_type_guid ");
                    _sqlQuery.Append(" INNER JOIN subjects_main sbm ON sbm.subject_guid = sqm.subject_guid ");
                    _sqlQuery.Append(" INNER JOIN exam_questions rqm ON (rqm.question_guid = qm.question_guid OR rqm.question_guid= qm.primary_question_guid) ");
                    //_sqlQuery.Append(" INNER JOIN reg_questions_main rqm ON (rqm.question_guid = qm.question_guid OR rqm.question_guid= qm.primary_question_guid) ");
                    _sqlQuery.Append(" INNER JOIN registrations_status stm  ON stm.status_guid = rqm.status_guid  ");
                    // _sqlQuery.Append(" WHERE rqm.reg_id = " + _candidateGuid + " ");
                    _sqlQuery.Append(" order by rqm.sequence_number ; ");

                    //Get MatchOptions 
                    //_sqlQuery.Clear();
                    _sqlQuery.Append("SELECT qm.question_guid, aop.option_guid,amo.match_guid,aop.option_number,aop.description,amo.description as match_description ");
                    _sqlQuery.Append("FROM questions_main qm ");
                    _sqlQuery.Append("INNER JOIN answer_options aop ON aop.question_guid = qm.question_guid ");
                    _sqlQuery.Append("LEFT JOIN answer_match_options amo ON amo.option_guid = aop.option_guid ");
                    _sqlQuery.Append(";");

                    //_sqlQuery.Append("Where qm.question_guid = '" + _questionGuid + "' ; ");

                    _sqlQuery.Append("SELECT exam_guid,exam_type  FROM exams_main; ");//exam_type

                    _sqlQuery.Append(" SELECT CAST(em.duration * um.conversion_factor AS INT) as duration");
                    _sqlQuery.Append(" FROM exams_main em ");
                    _sqlQuery.Append(" INNER JOIN uoms_main um ON em.duration_uom_guid = um.uom_guid;");
                    //Call Function

                    #region VistaDBConnection
                    VistaDBConnectionStringBuilder builder = new VistaDBConnectionStringBuilder();
                    builder.Add("Data Source", "C:\\Gitlab\\backend\\ixcheck-candidate-api\\src\\DB\\VDB.vdb6");
                    builder.Add("Password", "5173EA31F0A418D7209B136BB85BBB3C05F87547268BBA06D90A6AF0FA237C2E");
                    //builder.OpenMode = VistaDBDatabaseOpenMode.MultiProcessReadWrite;
                    //builder.TransactionMode = VistaDBTransaction.TransactionMode.On;

                    using (VistaDBConnection connection = new VistaDBConnection(builder.ConnectionString))
                    {
                        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                        var enc = Encoding.GetEncoding(1251);
                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }
                        _dataSet = new DataSet();

                        using (VistaDBCommand command = new VistaDBCommand())
                        {
                            command.Connection = connection;
                            command.CommandText = _sqlQuery.ToString();

                            using (VistaDBDataAdapter adapter = new VistaDBDataAdapter())
                            {
                                adapter.SelectCommand = command;
                                adapter.Fill(_dataSet);
                            }
                        }
                    }
                    #endregion

                    if (_functionReturn.Status)
                    {
                        _sw = new StringWriter();
                        _writer = new JsonTextWriter(_sw);

                        _writer.WriteStartObject();
                        _loopStart = DateTime.Now;

                        #region section json start                   
                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Sections);
                        _writer.WriteStartArray();
                        if (_dataSet.Tables[SECTIONS].Rows.Count > 0)
                        {
                            foreach (DataRow row in _dataSet.Tables[SECTIONS].Rows)
                            {
                                System.Threading.Thread.Sleep(1);
                                _sectionGuid = Convert.ToString(row["section_guid"]);
                                _sectionName = Convert.ToString(row["section_name"]);

                                _writer.WriteStartObject();

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionGuid);
                                _writer.WriteValue(_sectionGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionName);
                                _writer.WriteValue(_sectionName);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SaveAnswerKey);
                                _writer.WriteValue(_saveAnswerKey);

                                _writer.WriteEndObject();
                            }
                        }
                        _writer.WriteEnd();
                        #endregion

                        #region section status json start
                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionStatus);
                        _writer.WriteStartArray();
                        if (_dataSet.Tables[QUESTIONCOUNTSANDSTATUS].Rows.Count > 0)
                        {
                            foreach (DataRow row in _dataSet.Tables[QUESTIONCOUNTSANDSTATUS].Rows)
                            {
                                Thread.Sleep(1);
                                _statusGuid = Convert.ToString(row["status_guid"]);
                                _statusName = Convert.ToString(row["status_name"]);
                                _statusCode = Convert.ToString(row["status_code"]);
                                _statusCssTag = Convert.ToString(row["status_css_tag"]);
                                _noOfQuestions = Convert.ToString(row["no_of_questions"]);

                                _writer.WriteStartObject();

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusGuid);
                                _writer.WriteValue(_statusGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusName);
                                _writer.WriteValue(_statusName);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusType);
                                _writer.WriteValue(_statusCode);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusCssTag);
                                _writer.WriteValue(_statusCssTag);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.NoOfQuestions);
                                _writer.WriteValue(_noOfQuestions);

                                _writer.WriteEndObject();
                            }
                        }
                        _writer.WriteEnd();
                        #endregion

                        #region section_questions_status json start
                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionQuestionsStatus);
                        _writer.WriteStartArray();
                        if (_dataSet.Tables[SECTIONQUESTIONSTATUS].Rows.Count > 0)
                        {
                            //int QuestionNumber = 0;
                            foreach (DataRow row in _dataSet.Tables[SECTIONQUESTIONSTATUS].Rows)
                            {
                                Thread.Sleep(1);
                                _questionGuid = Convert.ToString(row["question_guid"]);
                                _questionNumber = Convert.ToString(row["question_number"]);
                                _statusGuid = Convert.ToString(row["status_guid"]);
                                _statusName = Convert.ToString(row["status_name"]);
                                _statusCode = Convert.ToString(row["status_code"]);
                                _statusCssTag = Convert.ToString(row["status_css_tag"]);
                                _sectionGuid = Convert.ToString(row["section_guid"]);
                                _languageGuid = Convert.ToString(row["language_guid"]);
                                _primary_question_guid = Convert.ToString(row["primary_question_guid"]);

                                // primary question
                                // QuestionNumber++;
                                // _questionNumber = QuestionNumber.ToString();

                                _writer.WriteStartObject();

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionGuid);
                                _writer.WriteValue(_questionGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionNumber);
                                _writer.WriteValue(_questionNumber);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusGuid);
                                _writer.WriteValue(_statusGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusName);
                                _writer.WriteValue(_statusName);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusType);
                                _writer.WriteValue(_statusCode);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusCssTag);
                                _writer.WriteValue(_statusCssTag);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionGuid);
                                _writer.WriteValue(_sectionGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LanguageGuid);
                                _writer.WriteValue(_languageGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PrimaryQuestionGuid);
                                _writer.WriteValue(_primary_question_guid);

                                _writer.WriteEndObject();
                            }
                        }
                        _writer.WriteEnd();
                        #endregion

                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionSummary);
                        _writer.WriteStartArray();
                        if (_dataSet.Tables[QUESTIONS].Rows.Count > 0)
                        {
                            foreach (DataRow row in _dataSet.Tables[QUESTIONS].Rows)
                            {
                                Thread.Sleep(1);
                                _questionGuid = Convert.ToString(row["question_guid"]);
                                _questionDescription = Convert.ToString(row["question_description"]);
                                _languageGuid = Convert.ToString(row["language_guid"]);
                                _languageName = Convert.ToString(row["language_name"]);
                                _sectionGuid = Convert.ToString(row["section_guid"]);
                                _sectionName = Convert.ToString(row["section_name"]);
                                _numberOfOptions = Convert.ToString(row["number_of_options"]);
                                _answerTypeCode = Convert.ToString(row["answer_type_code"]);
                                _answerType = Convert.ToString(row["answer_type"]);
                                _primary_question_guid = Convert.ToString(row["primary_question_guid"]);
                                _subjectGuid = Convert.ToString(row["subject_guid"]);
                                _subject = Convert.ToString(row["subject"]);
                                _statusGuid = Convert.ToString(row["status_guid"]);
                                _status = Convert.ToString(row["status_name"]);
                                _statusCode = Convert.ToString(row["status_code"]);
                                _statusCssTag = Convert.ToString(row["status_css_tag"]);
                                _questionNumber = Convert.ToString(row["question_number"]);
                                //var quesnumber = 0;// Convert.ToInt32(row["primary_question_id"]);
                                //if (quesnumber == 1)
                                //{
                                //    //primary question
                                //    primaryQuestionNumber++;
                                //    _questionNumber = primaryQuestionNumber.ToString();
                                //}
                                //else
                                //{
                                //    //secondary question   
                                //    secondaryQuestionNumber++;
                                //    _questionNumber = secondaryQuestionNumber.ToString();
                                //}

                                //_writer.WriteStartArray();
                                _writer.WriteStartObject();

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Question);
                                _writer.WriteStartArray();
                                _writer.WriteStartObject();

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionGuid);
                                _writer.WriteValue(_questionGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionDescription);
                                _writer.WriteValue(_questionDescription);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LanguageGuid);
                                _writer.WriteValue(_languageGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.LanguageName);
                                _writer.WriteValue(_languageName);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionGuid);
                                _writer.WriteValue(_sectionGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SectionName);
                                _writer.WriteValue(_sectionName);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.NumberOfOptions);
                                _writer.WriteValue(_numberOfOptions);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AnswerTypeCode);
                                _writer.WriteValue(_answerTypeCode);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PrimaryQuestionGuid);
                                _writer.WriteValue(_primary_question_guid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.SubjectGuid);
                                _writer.WriteValue(_subjectGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Subject);
                                _writer.WriteValue(_subject);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusGuid);
                                _writer.WriteValue(_statusGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusName);
                                _writer.WriteValue(_status);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionStatusType);
                                _writer.WriteValue(_statusCode);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionNumber);
                                _writer.WriteValue(_questionNumber);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.StatusCssTag);
                                _writer.WriteValue(_statusCssTag);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.PositiveMarks);
                                _writer.WriteValue("4");

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.NegativeMarks);
                                _writer.WriteValue("1");

                                _writer.WriteEndObject();
                                _writer.WriteEnd();

                                #region Match Options
                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Option);
                                _writer.WriteStartArray();
                                if (_dataSet.Tables[MATCHOPTIONS].Rows.Count > 0)
                                {
                                    DataRow[] _dataRows = _dataSet.Tables[MATCHOPTIONS].Select("question_guid = '" + _questionGuid + "'");

                                    if (_dataRows != null)
                                    {
                                        foreach (DataRow _dataRow in _dataRows)
                                        {
                                            _optionGuid = Convert.ToString(_dataRow["option_guid"]);
                                            _matchGuid = Convert.ToString(_dataRow["match_guid"]);
                                            _optionNumber = Convert.ToString(_dataRow["option_number"]);
                                            _description = Convert.ToString(_dataRow["description"]);
                                            _matchDescription = Convert.ToString(_dataRow["match_description"]);
                                            if (_answerType.ToLower() == "match")
                                            {
                                                _writer.WriteStartObject();

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionGuid);
                                                _writer.WriteValue(_questionGuid);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OptionGuid);
                                                _writer.WriteValue(_optionGuid);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MatchGuid);
                                                _writer.WriteValue(_matchGuid);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OptionNumber);
                                                _writer.WriteValue(_optionNumber);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Description);
                                                _writer.WriteValue(_description);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.MatchDescription);
                                                _writer.WriteValue(_matchDescription);

                                                _writer.WriteEndObject();
                                            }
                                            else
                                            {
                                                _writer.WriteStartObject();

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OptionGuid);
                                                _writer.WriteValue(_optionGuid);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.OptionNumber);
                                                _writer.WriteValue(_optionNumber);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Description);
                                                _writer.WriteValue(_description);

                                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.QuestionGuid);
                                                _writer.WriteValue(_questionGuid);

                                                _writer.WriteEndObject();
                                            }
                                        }
                                    }
                                }
                                _writer.WriteEnd();

                                #endregion

                                #region Reg Answers
                                //datatable revcieved from server
                                // DataTable _dataTableRegAnswers = null;
                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.Answers);
                                _writer.WriteStartArray();

                                _writer.WriteEnd();
                                #endregion
                                #region Reg Answers -- This will come from server
                                #endregion
                                _writer.WriteEndObject();
                            }
                        }
                        _writer.WriteEnd();

                        #region EXAM TYPE 
                        _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamInfo);
                        _writer.WriteStartArray();
                        if (_dataSet.Tables[EXAMINFO].Rows.Count > 0)
                        {
                            foreach (DataRow row in _dataSet.Tables[EXAMINFO].Rows)
                            {
                                Thread.Sleep(1);
                                string _currentExamGuid = Convert.ToString(row["exam_guid"]);
                                string _currentExamType = Convert.ToString(row["exam_type"]);
                                _writer.WriteStartObject();

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamGuid);
                                _writer.WriteValue(_currentExamGuid);

                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamType);
                                _writer.WriteValue(_currentExamType);

                                _writer.WriteEndObject();
                            }
                        }
                        _writer.WriteEnd();
                        #endregion

                        #region Exam Duration 

                        if (_dataSet.Tables[6].Rows.Count > 0)
                        {
                            foreach (DataRow row in _dataSet.Tables[6].Rows)
                            {
                                Thread.Sleep(1);
                                _allowDurationInSeconds = Convert.ToDouble(row["duration"]);
                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamDuration);
                                _writer.WriteStartObject();
                                _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AllowedDurationInSeconds);
                                _writer.WriteValue(_allowDurationInSeconds);
                                _writer.WriteEndObject();
                            }
                        }
                        else
                        {
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.ExamDuration);
                            _writer.WriteStartObject();
                            _writer.WritePropertyName(ApplicationJsonReturnConstants.PropertyNames.AllowedDurationInSeconds);
                            _writer.WriteValue(1800);
                            _writer.WriteEndObject();
                        }
                        #endregion

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.Stats);
                        _writer.WriteStartObject();

                        _loopEnd = DateTime.Now;
                        _loopTime = (_loopEnd - _loopStart);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.CacheCheckTime);
                        _writer.WriteValue(_stats.CacheCheckTime.TotalMilliseconds.ToString() + JsonReturnConstants.PropertyNames.MS);

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


        public Task<(string jsonReturn, IFunctionReturn functionReturn)> GetMockExamVistaDBAsync()
        {
            return Task.Run(() => GetMockExamVistaDB());
        }
    }
}