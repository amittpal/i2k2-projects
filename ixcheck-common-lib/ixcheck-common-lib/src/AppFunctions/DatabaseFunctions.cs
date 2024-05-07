using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using IXCheckCommonLib.Models.Paging;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;

namespace IXCheckCommonLib.AppFunctions
{
    public class DatabaseFunctions : IDatabaseFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly ILoggerFunctions _loggerFunctions;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__databaseSettings"></param>
        public DatabaseFunctions(IDatabaseSettings __databaseSettings, ILoggerFunctions __loggerFunctions)
        {
            _databaseSettings = __databaseSettings;
            _loggerFunctions = __loggerFunctions;
        }

        /// <summary>
        /// Execute Insert
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue, ApiSuccessResponse.DataValue dataValue) ExecuteInsert(ReadOnlySpan<char> sqlSpanQuery, string methodName)
        {
            ApiSuccessResponse.DataValue _dataValue = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            int _rowsAffected = 0;
            UInt64 _retVal = 0;
            bool _success = true;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            _dataValue = new ApiSuccessResponse.DataValue();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        CommandText = sqlSpanQuery.ToString(),
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };
                    _queryStart = DateTime.Now;
                    _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);
                    if (_rowsAffected < 0)
                    {
                        _retVal = 0;
                        _success = false;
                    }
                    else { _retVal = Convert.ToUInt64(_rowsAffected); }

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _dataValue = CommonFunctions.SetDataValue(_retVal, _retVal, string.Empty, string.Empty);

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordSavedSuccessfully);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Add(Constants.GenericMessages.ErrorInSavingRecord);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                }
            }
            return (_functionReturn, _retVal, _dataValue);
        }

        /// <summary>
        /// Execute Check Exists and Insert Record
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue, ApiSuccessResponse.DataValue dataValue) ExecuteCheckExistsAndInsert(ReadOnlySpan<char> sqlSpanCheckExistQuery, ReadOnlySpan<char> sqlSpanInsertQuery, string methodName, string successMessage)
        {
            ApiSuccessResponse.DataValue _dataValue = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            int _rowsAffected = 0;
            object _obj = null;
            UInt64 _retVal = 0;
            bool _success = true;
            bool _recordAlreadyExists = false;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            _dataValue = new ApiSuccessResponse.DataValue();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout,
                        CommandText = sqlSpanCheckExistQuery.ToString()
                    };
                    _queryStart = DateTime.Now;
                    _obj = _mySqlCommand.ExecuteScalar();
                    _retVal = (_obj == DBNull.Value) ? 0 : Convert.ToUInt64(_obj);

                    if (_retVal <= 0)
                    {

                        _mySqlCommand.CommandText = sqlSpanInsertQuery.ToString();
                        _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                        if (_rowsAffected < 0)
                        {
                            _retVal = 0;
                            _success = false;
                        }
                        else { _retVal = Convert.ToUInt64(_rowsAffected); }
                    }
                    else
                    {
                        _recordAlreadyExists = true;
                    }

                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);


                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _dataValue = CommonFunctions.SetDataValue(_retVal, _retVal, string.Empty, string.Empty);

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        if (_recordAlreadyExists)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordAlreadyExists);
                        }
                        else
                        {
                            _functionReturn.Message.Add(successMessage);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Add(Constants.GenericMessages.ErrorInSavingRecord);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                    _obj = null;
                }
            }
            return (_functionReturn, _retVal, _dataValue);
        }

        /// <summary>
        /// Execute Check Exists and Insert Record
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue, ApiSuccessResponse.DataValue dataValue) ExecuteCheckExistsAndInsertWitTran(ReadOnlySpan<char> sqlSpanCheckExistQuery, ReadOnlySpan<char> sqlSpanInsertQuery, string methodName)
        {
            ApiSuccessResponse.DataValue _dataValue = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            int _rowsAffected = 0;
            object _obj = null;
            UInt64 _retVal = 0;
            bool _success = true;
            bool _recordAlreadyExists = false;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            _dataValue = new ApiSuccessResponse.DataValue();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout,
                        CommandText = sqlSpanCheckExistQuery.ToString()
                    };
                    _queryStart = DateTime.Now;
                    _obj = _mySqlCommand.ExecuteScalar();
                    _retVal = (_obj == DBNull.Value) ? 0 : Convert.ToUInt64(_obj);

                    if (_retVal <= 0)
                    {

                        _mySqlCommand.CommandText = sqlSpanInsertQuery.ToString();
                        _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                        if (_rowsAffected < 0)
                        {
                            _retVal = 0;
                            _success = false;
                        }
                        else { _retVal = Convert.ToUInt64(_rowsAffected); }
                    }
                    else
                    {
                        _recordAlreadyExists = true;
                    }

                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);


                    if (_success)
                    {
                        //_mySqlTransaction?.Commit();

                        _dataValue = CommonFunctions.SetDataValue(_retVal, _retVal, string.Empty, string.Empty);

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        if (_recordAlreadyExists)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordAlreadyExists);
                        }
                        else
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordSavedSuccessfully);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    }
                    else
                    {
                        // _mySqlTransaction?.Rollback();
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Add(Constants.GenericMessages.ErrorInSavingRecord);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        //_mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        // _mySqlConnection.Close();
                        //_mySqlConnection = null;
                    }
                    //_mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                    _obj = null;
                }
            }
            return (_functionReturn, _retVal, _dataValue);
        }

        /// <summary>
        /// Execute Update
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue, ApiSuccessResponse.DataValue dataValue) ExecuteUpdate(ReadOnlySpan<char> sqlSpanQuery, string methodName, string successMessage)
        {
            ApiSuccessResponse.DataValue _dataValue = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            int _rowsAffected = 0;
            UInt64 _retVal = 0;
            bool _success = true;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        CommandText = sqlSpanQuery.ToString(),
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };

                    _queryStart = DateTime.Now;
                    _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);
                    if (_rowsAffected < 0)
                    {
                        _retVal = 0;
                        _success = false;
                    }
                    else { _retVal = Convert.ToUInt64(_rowsAffected); }

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _dataValue = CommonFunctions.SetDataValue(_retVal, _retVal, string.Empty, string.Empty);

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        if (_rowsAffected == 0)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToUpdate);
                        }
                        else
                        {
                            _functionReturn.Message.Add(successMessage);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();
                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        if (_rowsAffected == 0)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToUpdate);
                        }
                        else
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.ErrorInUpdatingRecord);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                }
            }
            return (_functionReturn, _retVal, _dataValue);
        }

        /// <summary>
        /// Execute Check Exists and Update Record
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue, ApiSuccessResponse.DataValue dataValue) ExecuteCheckExistsAndUpdate(ReadOnlySpan<char> sqlSpanCheckExistQuery, ReadOnlySpan<char> sqlSpanUpdateQuery, string methodName, string successMessage)
        {
            ApiSuccessResponse.DataValue _dataValue = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            int _rowsAffected = 0;
            object _obj = null;
            UInt64 _retVal = 0;
            bool _success = true;
            bool _recordAlreadyExists = false;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            _dataValue = new ApiSuccessResponse.DataValue();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                    _mySqlCommand = new MySqlCommand
                    {
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout,
                        CommandText = sqlSpanCheckExistQuery.ToString()
                    };
                    _queryStart = DateTime.Now;
                    _obj = _mySqlCommand.ExecuteScalar();
                    _retVal = (_obj == DBNull.Value) ? 0 : Convert.ToUInt64(_obj);

                    if (_retVal <= 0)
                    {

                        _mySqlCommand.CommandText = sqlSpanUpdateQuery.ToString();
                        _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                        if (_rowsAffected < 0)
                        {
                            _retVal = 0;
                            _success = false;
                        }
                        else { _retVal = Convert.ToUInt64(_rowsAffected); }
                    }
                    else
                    {
                        _recordAlreadyExists = true;
                    }

                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);


                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _dataValue = CommonFunctions.SetDataValue(_retVal, _retVal, string.Empty, string.Empty);

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        if (_recordAlreadyExists)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordAlreadyExists);
                        }
                        else if (_rowsAffected == 0)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToUpdate);
                        }
                        else
                        {
                            _functionReturn.Message.Add(successMessage);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        if (_recordAlreadyExists == false && _rowsAffected == 0)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToUpdate);
                        }
                        else
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.ErrorInUpdatingRecord);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                    _obj = null;
                }
            }
            return (_functionReturn, _retVal, _dataValue);
        }

        /// <summary>
        /// Execute Delete
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue) ExecuteDelete(ReadOnlySpan<char> sqlSpanQuery, string methodName, string successMessage)
        {
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            int _rowsAffected = 0;
            UInt64 _retVal = 0;
            bool _success = true;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                    //_mySqlCommand = new MySqlCommand(sqlSpanQuery.ToString(), _mySqlConnection, _mySqlTransaction);
                    _mySqlCommand = new MySqlCommand
                    {
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandText = sqlSpanQuery.ToString()
                    };
                    _mySqlCommand.CommandTimeout = _databaseSettings.MySqlTimeout;

                    _queryStart = DateTime.Now;
                    _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);
                    if (_rowsAffected < 0)
                    {
                        _retVal = 0;
                        _success = false;
                    }
                    else { _retVal = Convert.ToUInt64(_retVal); }

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        if (_rowsAffected == 0)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToDelete);
                        }
                        else
                        {
                            _functionReturn.Message.Add(successMessage);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        if (_rowsAffected == 0)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToDelete);
                        }
                        else
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.ErrorInDeletingRecord);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                }
            }
            return (_functionReturn, _retVal);
        }

        /// <summary>
        /// Execute Check Exists and Delete Record
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue, ApiSuccessResponse.DataValue dataValue) ExecuteCheckExistsAndDelete(ReadOnlySpan<char> sqlSpanCheckExistQuery, ReadOnlySpan<char> sqlSpanDeleteQuery, string methodName)
        {
            ApiSuccessResponse.DataValue _dataValue = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            int _rowsAffected = 0;
            object _obj = null;
            UInt64 _retVal = 0;
            bool _success = true;
            bool _recordNotFound = false;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            _dataValue = new ApiSuccessResponse.DataValue();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadCommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout,
                        CommandText = sqlSpanCheckExistQuery.ToString()
                    };
                    _queryStart = DateTime.Now;
                    _obj = _mySqlCommand.ExecuteScalar();
                    _retVal = (_obj == DBNull.Value) ? 0 : Convert.ToUInt64(_obj);

                    if (_retVal > 0)
                    {

                        _mySqlCommand.CommandText = sqlSpanDeleteQuery.ToString();
                        _rowsAffected = _mySqlCommand.ExecuteNonQuery();
                        if (_rowsAffected < 0)
                        {
                            _retVal = 0;
                            _success = false;
                        }
                        else { _retVal = Convert.ToUInt64(_rowsAffected); }
                    }
                    else
                    {
                        _recordNotFound = true;
                    }

                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);


                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _dataValue = CommonFunctions.SetDataValue(_retVal, _retVal, string.Empty, string.Empty);

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        if (_recordNotFound)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToDelete);
                        }
                        else
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordDeletedSuccessfully);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        if (_rowsAffected == 0)
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFoundToDelete);
                        }
                        else
                        {
                            _functionReturn.Message.Add(Constants.GenericMessages.ErrorInDeletingRecord);
                        }
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                    _obj = null;
                }
            }
            return (_functionReturn, _retVal, _dataValue);
        }

        /// <summary>
        /// Execute Scalar
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, UInt64 retValue) ExecuteScalar(ReadOnlySpan<char> sqlSpanQuery, string methodName)
        {
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            UInt64 _retVal = 0;
            bool _success = true;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            Object _obj = null;
            IFunctionReturn _functionReturn = new FunctionReturn();

            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadUncommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        CommandText = sqlSpanQuery.ToString(),
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };

                    _queryStart = DateTime.Now;
                    _obj = _mySqlCommand.ExecuteScalar();
                    _retVal = (_obj != DBNull.Value) ? Convert.ToUInt64(_obj) : 0;
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordAlreadyExists);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFound);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlTransaction = null;
                    //_functionReturn = null;
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                }
            }
            return (_functionReturn, _retVal);
        }

        /// <summary>
        /// Execute Select DataTable
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, DataTable dataTable, TimeSpan? sqlconnTime, TimeSpan? queryTime) ExecuteSelectDataTable(ReadOnlySpan<char> sqlSpanQuery, string methodName)
        {

            MySqlDataReader _mySqlDataReader = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            bool _success = true;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlDataAdapter _dataAdapter;
            DataTable _dataTable = new DataTable();
            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadUncommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        CommandText = sqlSpanQuery.ToString(),
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };

                    //_queryStart = DateTime.Now;
                    //_mySqlDataReader = _mySqlCommand.ExecuteReader();
                    //_queryEnd = DateTime.Now;
                    //_queryTime = (_queryEnd - _queryStart);
                    //if (_mySqlDataReader.HasRows)
                    //{
                    //    _dataTable.Load(_mySqlDataReader);
                    //}
                    //else
                    //{
                    //    _success = false;
                    //}

                    _dataAdapter = new MySqlDataAdapter(_mySqlCommand);
                    _queryStart = DateTime.Now;
                    _dataAdapter.Fill(_dataTable);
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);
                    if (_dataTable?.Rows?.Count <= 0)
                    {
                        _success = false;
                    }

                    _mySqlDataReader?.Close();
                    _mySqlDataReader?.Dispose();
                    _mySqlCommand?.Dispose();

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _functionReturn.Status = true;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordFetchedSuccessfully);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFound);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlDataReader?.Close();
                        _mySqlDataReader?.Dispose();
                        _mySqlCommand?.Dispose();

                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }

                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _dataAdapter = null;
                    _mySqlDataReader?.Close();
                    _mySqlDataReader?.Dispose();
                    _mySqlCommand?.Dispose();
                    _mySqlDataReader = null;
                    _mySqlCommand = null;
                    _mySqlTransaction = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                }
            }
            return (_functionReturn, _dataTable, _sqlconnTime, _queryTime);
        }

        /// <summary>
        /// Execute Select DataSet
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, DataSet dataSet, TimeSpan? sqlconnTime, TimeSpan? queryTime) ExecuteSelectDataSet(ReadOnlySpan<char> sqlSpanQuery, string methodName)
        {
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            bool _success = true;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            DataSet _dataSet = new DataSet();
            MySqlDataAdapter _dataAdapter;
            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadUncommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        CommandText = sqlSpanQuery.ToString(),
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };

                    _dataAdapter = new MySqlDataAdapter(_mySqlCommand);
                    _queryStart = DateTime.Now;
                    _dataAdapter.Fill(_dataSet);
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);
                    if (_dataSet?.Tables?.Count <= 0)
                    {
                        _success = false;
                    }

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _functionReturn.Status = true;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordFetchedSuccessfully);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFound);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }

                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _dataAdapter = null;
                    _mySqlCommand?.Dispose();
                    _mySqlCommand = null;
                    _mySqlTransaction = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                }
            }
            return (_functionReturn, _dataSet, _sqlconnTime, _queryTime);
        }

        /// <summary>
        /// Execute Select JSON
        /// </summary>
        /// <param name="sqlSpanQuery"></param>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, string jsonReturn) ExecuteSelectJSON(ReadOnlySpan<char> sqlSpanQuery, string methodName, string jsonObjectName, Dictionary<string, (string field, string jsonProperty)> jsonDataFields, TimeSpan _cachecheckTime)
        {

            MySqlDataReader _mySqlDataReader = null;
            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection = null;
            bool _success = true;
            MySqlCommand _mySqlCommand = null;
            DateTime? _sqlconnStart = null;
            DateTime? _sqlconnEnd = null;
            TimeSpan? _sqlconnTime = null;
            DateTime? _queryStart = null;
            DateTime? _queryEnd = null;
            TimeSpan? _queryTime = null;
            IFunctionReturn _functionReturn = new FunctionReturn();
            DateTime _loopStart;
            StringWriter _sw;
            JsonTextWriter _writer;
            DateTime _loopEnd;
            TimeSpan _loopTime;
            int _jsonInputFieldCount = 0;

            //JSON data
            string _jsonReturn = string.Empty;
            //total rows
            int _jsonRows = 0;

            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300
            int _maxRecordLoopCount = _databaseSettings.MaxRecordLoopCount;
            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    // Open connection;
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadUncommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        CommandText = sqlSpanQuery.ToString(),
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };

                    _queryStart = DateTime.Now;
                    _mySqlDataReader = _mySqlCommand.ExecuteReader();
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);
                    if (_mySqlDataReader.HasRows)
                    {
                        _loopStart = DateTime.Now;
                        _sw = new StringWriter();
                        _writer = new JsonTextWriter(_sw);
                        _jsonInputFieldCount = jsonDataFields.Count;

                        // {
                        _writer.WriteStartObject();

                        // start data array
                        // "collection_name": [
                        _writer.WritePropertyName(jsonObjectName);
                        _writer.WriteStartArray();

                        while (_mySqlDataReader.Read())
                        {
                            if (_jsonInputFieldCount > 0)
                            {
                                _writer.WriteStartObject();
                                foreach (KeyValuePair<string, (string jsonProperty, string dataType)> _entry in jsonDataFields)
                                {

                                    (string _jsonProperty, string _dataType) = _entry.Value;
                                    switch (_dataType)
                                    {

                                        case DatabaseConstants.DataTypes.Int:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.Int64:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt64(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.UInt32:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToUInt32(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.UInt64:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToUInt64(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.String:
                                            _writer.WritePropertyName(_entry.Key);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? string.Empty : Convert.ToString(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.Boolean:
                                            _writer.WritePropertyName(_entry.Key);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? false : Convert.ToBoolean(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.DateTime:
                                            _writer.WritePropertyName(_entry.Key);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? DateTime.UtcNow : Convert.ToDateTime(_mySqlDataReader[_entry.Key]));
                                            break;
                                    }
                                }
                                _writer.WriteEndObject();


                                //count rows
                                ++_jsonRows;

                                //infinite loop check
                                if (_jsonRows >= _maxRecordLoopCount)
                                {
                                    //exit loop
                                    break;
                                }
                            }
                        }

                        //close data array
                        // ]
                        _writer.WriteEnd();

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.ReturnedRows);
                        _writer.WriteValue(_jsonRows.ToString());

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

                        //write json string from sw
                        _jsonReturn = _sw.ToString();

                        //dispose objects
                        _sw.Dispose();
                        _writer = null;

                        _functionReturn.Status = true;
                    }
                    else
                    {
                        _success = false;
                    }
                    //Cleanup

                    _mySqlDataReader?.Close();
                    _mySqlDataReader?.Dispose();
                    _mySqlCommand?.Dispose();

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _functionReturn.Status = true;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordFetchedSuccessfully);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFound);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlDataReader?.Close();
                        _mySqlDataReader?.Dispose();
                        _mySqlCommand?.Dispose();

                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlDataReader?.Close();
                    _mySqlDataReader?.Dispose();
                    _mySqlCommand?.Dispose();
                    _mySqlDataReader = null;
                    _mySqlCommand = null;
                    _mySqlTransaction = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                }

            }
            return (_functionReturn, _jsonReturn);
        }

        /// <summary>
        /// Execute Select JSON Paging
        /// <param name="sqlSpanQuery"></param>
        /// </summary>
        /// <returns></returns>
        public (IFunctionReturn functionReturn, string jsonReturn) ExecuteSelectJSONPaging(ReadOnlySpan<char> sqlSpanQuery, string methodName, string jsonObjectName, Dictionary<string, (string field, string jsonProperty)> jsonDataFields, HttpPaging httpPaging, TimeSpan _cachecheckTime, bool _includeStatusStyles = false, bool _includeExtraVariables = false)
        {

            MySqlTransaction _mySqlTransaction = null;
            MySqlConnection _mySqlConnection;
            bool _success = true;
            MySqlCommand _mySqlCommand = new MySqlCommand();
            DateTime? _sqlconnStart;
            DateTime? _sqlconnEnd;
            TimeSpan? _sqlconnTime;
            DateTime? _queryStart;
            DateTime? _queryEnd;
            TimeSpan? _queryTime;
            IFunctionReturn _functionReturn = new FunctionReturn();
            MySqlDataReader _mySqlDataReader = null;
            DateTime _loopStart;
            StringWriter _sw;
            JsonTextWriter _writer;
            DateTime _loopEnd;
            TimeSpan _loopTime;
            int _jsonInputFieldCount;

            //JSON data
            string _jsonReturn = string.Empty;
            //total rows
            int _jsonRows = 0;
            int _lastSeenId;
            int _lastOffset = 0;
            int _lastSeenIdMax;
            int _lastSeenIdMin;

            double _lastSeenInvoiceAmount;
            double _lastSeenInvoiceAmountMax = 0;
            double _lastSeenInvoiceAmountMin = 0;

            double _lastSeenInvoicePaidAmount;
            double _lastSeenInvoicePaidAmountMax = 0;
            double _lastSeenInvoicePaidAmountMin = 0;

            double _lastSeenBalanceAmount;
            double _lastSeenBalanceAmountMax = 0;
            double _lastSeenBalanceAmountMin = 0;

            double _lastSeenTdsAmount;
            double _lastSeenTdsAmountMax = 0;
            double _lastSeenTdsAmountMin = 0;

            double _lastSeenCreditNoteAmount;
            double _lastSeenCreditNoteAmountMax = 0;
            double _lastSeenCreditNoteAmountMin = 0;

            double _lastSeenOrderValue;
            double _lastSeenOrderValueMax = 0;
            double _lastSeenOrderValueMin = 0;

            double _lastSeenRevenue;
            double _lastSeenRevenueMax = 0;
            double _lastSeenRevenueMin = 0;

            double _lastSeenPaymentAmount;
            double _lastSeenPaymentAmountMax = 0;
            double _lastSeenPaymentAmountMin = 0;

            double _lastSeenPaymentApplied;
            double _lastSeenPaymentAppliedMax = 0;
            double _lastSeenPaymentAppliedMin = 0;

            double _lastSeenTdsPaidAmount;
            double _lastSeenTdsPaidAmountMax = 0;
            double _lastSeenTdsPaidAmountMin = 0;

            double _lastSeenAge;
            double _lastSeenAgeMax = 0;
            double _lastSeenAgeMin = 0;

            double _lastSeenSubTotalAmount;
            double _lastSeenSubTotalAmountMax = 0;
            double _lastSeenSubTotalAmountMin = 0;

            double _lastSeenTdsPercentage;
            double _lastSeenTdsPercentageMax = 0;
            double _lastSeenTdsPercentageMin = 0;

            double _lastSeenPaidAmount;
            double _lastSeenPaidAmountMax = 0;
            double _lastSeenPaidAmountMin = 0;

            double _lastSeenBadDebtsAmount;
            double _lastSeenBadDebtsAmountMax = 0;
            double _lastSeenBadDebtsAmountMin = 0;


            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300
            int _maxRecordLoopCount = _databaseSettings.MaxRecordLoopCount;


            using (_mySqlConnection = new MySqlConnection(_databaseSettings.MySqlConnection))
            {
                try
                {
                    _sqlconnStart = DateTime.Now;
                    _mySqlConnection.Open();
                    _sqlconnEnd = DateTime.Now;
                    _sqlconnTime = (_sqlconnEnd - _sqlconnStart);

                    _mySqlTransaction = _mySqlConnection.BeginTransaction(IsolationLevel.ReadUncommitted);
                    _mySqlCommand = new MySqlCommand()
                    {
                        CommandText = sqlSpanQuery.ToString(),
                        Connection = _mySqlConnection,
                        Transaction = _mySqlTransaction,
                        CommandTimeout = _databaseSettings.MySqlTimeout
                    };

                    _queryStart = DateTime.Now;
                    _mySqlDataReader = _mySqlCommand.ExecuteReader();
                    _queryEnd = DateTime.Now;
                    _queryTime = (_queryEnd - _queryStart);
                    if (_mySqlDataReader.HasRows)
                    {
                        _loopStart = DateTime.Now;
                        _sw = new StringWriter();
                        _writer = new JsonTextWriter(_sw);

                        //re-initialize id counters
                        _lastSeenId = 0;
                        _lastSeenIdMin = 0;
                        _lastSeenIdMax = 0;


                        #region Remove Columns from jsonDataFields if not in _mySqlDataReader Object. 
                        Dictionary<string, (string jsonProperty, string dataType)> jsonDataFieldsToRemove = new Dictionary<string, (string jsonProperty, string dataType)>();
                        if (jsonDataFields != null)
                        {
                            foreach (KeyValuePair<string, (string jsonProperty, string dataType)> _entry in jsonDataFields)
                            {

                                bool _columnFound = false;
                                string _currentKey = "";
                                string _currentMySqlDataReaderColumn = "";
                                (string _jsonProperty, string _dataType) = _entry.Value;
                                _currentKey = _entry.Key.ToLower();
                                for (int i = 0; i < _mySqlDataReader.FieldCount; i++)
                                {
                                    _currentMySqlDataReaderColumn = _mySqlDataReader.GetName(i).ToLower();
                                    if (_currentKey == _currentMySqlDataReaderColumn)
                                    {
                                        _columnFound = true;
                                        break;
                                    }
                                }
                                if (_columnFound == false && !string.IsNullOrEmpty(_currentKey))
                                {
                                    jsonDataFieldsToRemove.Add(_entry.Key, _entry.Value);
                                }
                            }
                            if (jsonDataFieldsToRemove != null)
                            {
                                foreach (KeyValuePair<string, (string jsonProperty, string dataType)> _entryRemove in jsonDataFieldsToRemove)
                                {
                                    if (!string.IsNullOrEmpty(_entryRemove.Key))
                                    {
                                        jsonDataFields.Remove(_entryRemove.Key);
                                    }
                                }
                            }
                        }
                        #endregion




                        _jsonInputFieldCount = jsonDataFields.Count;

                        // {
                        _writer.WriteStartObject();

                        //start data array
                        // "collection_name": [
                        _writer.WritePropertyName(jsonObjectName);
                        _writer.WriteStartArray();

                        while (_mySqlDataReader.Read())
                        {
                            if (_jsonInputFieldCount > 0)
                            {
                                _writer.WriteStartObject();
                                foreach (KeyValuePair<string, (string jsonProperty, string dataType)> _entry in jsonDataFields)
                                {
                                    (string _jsonProperty, string _dataType) = _entry.Value;
                                    switch (_dataType)
                                    {
                                        case DatabaseConstants.DataTypes.Int:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.Int64:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt64(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.UInt32:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToUInt32(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.UInt64:
                                            _writer.WritePropertyName(_jsonProperty);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToUInt64(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.String:
                                            _writer.WritePropertyName(_entry.Key);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? string.Empty : Convert.ToString(_mySqlDataReader[_entry.Key]));
                                            break;                                       
                                        case DatabaseConstants.DataTypes.Boolean:
                                            _writer.WritePropertyName(_entry.Key);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? false : Convert.ToBoolean(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.DateTime:
                                            _writer.WritePropertyName(_entry.Key);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? DateTime.UtcNow : Convert.ToDateTime(_mySqlDataReader[_entry.Key]));
                                            break;
                                        case DatabaseConstants.DataTypes.Decimal:
                                            _writer.WritePropertyName(_entry.Key);
                                            _writer.WriteValue(_mySqlDataReader[_entry.Key] == DBNull.Value ? string.Empty : Convert.ToString(_mySqlDataReader[_entry.Key]));
                                            break;
                                    }
                                    if (_entry.Key == JsonReturnConstants.PropertyNames.Id && _jsonProperty == _entry.Key)
                                    {
                                        _lastSeenId = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                        if (_lastSeenIdMax == 0) _lastSeenIdMax = _lastSeenId;
                                        if (_lastSeenIdMin == 0) _lastSeenIdMin = _lastSeenId;

                                        _lastSeenIdMax = (_lastSeenId > _lastSeenIdMax) ? _lastSeenId : _lastSeenIdMax;
                                        _lastSeenIdMin = (_lastSeenId < _lastSeenIdMin) ? _lastSeenId : _lastSeenIdMin;
                                    }
                                    else if ((_includeStatusStyles) && (_entry.Key == JsonReturnConstants.PropertyNames.Status && _jsonProperty == _entry.Key))
                                    {
                                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.StatusText);
                                        _writer.WriteValue(CommonFunctions.GetStatusText(_mySqlDataReader[_entry.Key] == DBNull.Value ? "" : Convert.ToString(_mySqlDataReader[_entry.Key])));

                                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.StatusCSSTag);
                                        _writer.WriteValue(CommonFunctions.GetStatusCSSTag(_mySqlDataReader[_entry.Key] == DBNull.Value ? "" : Convert.ToString(_mySqlDataReader[_entry.Key])));
                                    }
                                    else if ((_includeStatusStyles) && (_entry.Key == JsonReturnConstants.PropertyNames.InvoiceStatus && _jsonProperty == _entry.Key))
                                    {
                                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.StatusText);
                                        _writer.WriteValue(CommonFunctions.GetStatusText(_mySqlDataReader[_entry.Key] == DBNull.Value ? "" : Convert.ToString(_mySqlDataReader[_entry.Key])));

                                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.StatusCSSTag);
                                        _writer.WriteValue(CommonFunctions.GetInvoiceStatusCSSTag(_mySqlDataReader[_entry.Key] == DBNull.Value ? "" : Convert.ToString(_mySqlDataReader[_entry.Key])));
                                    }
                                    else if ((_includeStatusStyles) && (_entry.Key == JsonReturnConstants.PropertyNames.PaymentStatus && _jsonProperty == _entry.Key))
                                    {
                                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.StatusText);
                                        _writer.WriteValue(CommonFunctions.GetStatusText(_mySqlDataReader[_entry.Key] == DBNull.Value ? "" : Convert.ToString(_mySqlDataReader[_entry.Key])));

                                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.StatusCSSTag);
                                        _writer.WriteValue(CommonFunctions.GetPaymentStatusCSSTag(_mySqlDataReader[_entry.Key] == DBNull.Value ? "" : Convert.ToString(_mySqlDataReader[_entry.Key])));
                                    }

                                    if (_includeExtraVariables == true)
                                    {
                                        if ((_entry.Key == JsonReturnConstants.PropertyNames.InvoiceAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenInvoiceAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenInvoiceAmountMin == 0) _lastSeenInvoiceAmountMin = _lastSeenInvoiceAmount;

                                            _lastSeenInvoiceAmountMax = (_lastSeenInvoiceAmount > _lastSeenInvoiceAmountMax) ? _lastSeenInvoiceAmount : _lastSeenInvoiceAmountMax;
                                            _lastSeenInvoiceAmountMin = (_lastSeenInvoiceAmount < _lastSeenInvoiceAmountMin) ? _lastSeenInvoiceAmount : _lastSeenInvoiceAmountMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.InvoicePaidAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenInvoicePaidAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenInvoicePaidAmountMin == 0) _lastSeenInvoicePaidAmountMin = _lastSeenInvoicePaidAmount;

                                            _lastSeenInvoicePaidAmountMax = (_lastSeenInvoicePaidAmount > _lastSeenInvoicePaidAmountMax) ? _lastSeenInvoicePaidAmount : _lastSeenInvoicePaidAmountMax;
                                            _lastSeenInvoicePaidAmountMin = (_lastSeenInvoicePaidAmount < _lastSeenInvoicePaidAmountMin) ? _lastSeenInvoicePaidAmount : _lastSeenInvoicePaidAmountMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.BalanceAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenBalanceAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenBalanceAmountMin == 0) _lastSeenBalanceAmountMin = _lastSeenBalanceAmount;

                                            _lastSeenBalanceAmountMax = (_lastSeenBalanceAmount > _lastSeenBalanceAmountMax) ? _lastSeenBalanceAmount : _lastSeenBalanceAmountMax;
                                            _lastSeenBalanceAmountMin = (_lastSeenBalanceAmount < _lastSeenBalanceAmountMin) ? _lastSeenBalanceAmount : _lastSeenBalanceAmountMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.TotalTdsAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenTdsAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenTdsAmountMin == 0) _lastSeenTdsAmountMin = _lastSeenTdsAmount;

                                            _lastSeenTdsAmountMax = (_lastSeenTdsAmount > _lastSeenTdsAmountMax) ? _lastSeenTdsAmount : _lastSeenTdsAmountMax;
                                            _lastSeenTdsAmountMin = (_lastSeenTdsAmount < _lastSeenTdsAmountMin) ? _lastSeenTdsAmount : _lastSeenTdsAmountMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.TotalCreditNoteAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenCreditNoteAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenCreditNoteAmountMin == 0) _lastSeenCreditNoteAmountMin = _lastSeenCreditNoteAmount;

                                            _lastSeenCreditNoteAmountMax = (_lastSeenCreditNoteAmount > _lastSeenCreditNoteAmountMax) ? _lastSeenCreditNoteAmount : _lastSeenCreditNoteAmountMax;
                                            _lastSeenCreditNoteAmountMin = (_lastSeenCreditNoteAmount < _lastSeenCreditNoteAmountMin) ? _lastSeenCreditNoteAmount : _lastSeenCreditNoteAmountMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.OrderValue && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenOrderValue = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenOrderValueMin == 0) _lastSeenOrderValueMin = _lastSeenOrderValue;

                                            _lastSeenOrderValueMax = (_lastSeenOrderValue > _lastSeenOrderValueMax) ? _lastSeenOrderValue : _lastSeenOrderValueMax;
                                            _lastSeenOrderValueMin = (_lastSeenOrderValue < _lastSeenOrderValueMin) ? _lastSeenOrderValue : _lastSeenOrderValueMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.Revenue && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenRevenue = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenRevenueMin == 0) _lastSeenRevenueMin = _lastSeenRevenue;

                                            _lastSeenRevenueMax = (_lastSeenRevenue > _lastSeenRevenueMax) ? _lastSeenRevenue : _lastSeenRevenueMax;
                                            _lastSeenRevenueMin = (_lastSeenRevenue < _lastSeenRevenueMin) ? _lastSeenRevenue : _lastSeenRevenueMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.PaymentAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenPaymentAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenPaymentAmountMin == 0) _lastSeenPaymentAmountMin = _lastSeenPaymentAmount;

                                            _lastSeenPaymentAmountMax = (_lastSeenPaymentAmount > _lastSeenPaymentAmountMax) ? _lastSeenPaymentAmount : _lastSeenPaymentAmountMax;
                                            _lastSeenPaymentAmountMin = (_lastSeenPaymentAmount < _lastSeenPaymentAmountMin) ? _lastSeenPaymentAmount : _lastSeenPaymentAmountMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.PaymentApplied && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenPaymentApplied = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenPaymentAppliedMin == 0) _lastSeenPaymentAppliedMin = _lastSeenPaymentApplied;

                                            _lastSeenPaymentAppliedMax = (_lastSeenPaymentApplied > _lastSeenPaymentAppliedMax) ? _lastSeenPaymentApplied : _lastSeenPaymentAppliedMax;
                                            _lastSeenPaymentAppliedMin = (_lastSeenPaymentApplied < _lastSeenPaymentAppliedMin) ? _lastSeenPaymentApplied : _lastSeenPaymentAppliedMin;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.TdsPaidAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenTdsPaidAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenTdsPaidAmountMin == 0) _lastSeenTdsPaidAmountMin = _lastSeenTdsPaidAmount;

                                            _lastSeenTdsPaidAmountMax = (_lastSeenTdsPaidAmount > _lastSeenTdsPaidAmountMax) ? _lastSeenTdsPaidAmount : _lastSeenTdsPaidAmount;
                                            _lastSeenTdsPaidAmountMin = (_lastSeenTdsPaidAmount < _lastSeenTdsPaidAmountMin) ? _lastSeenTdsPaidAmount : _lastSeenTdsPaidAmount;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.SubTotalAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenSubTotalAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenSubTotalAmountMin == 0) _lastSeenSubTotalAmountMin = _lastSeenSubTotalAmount;

                                            _lastSeenSubTotalAmountMax = (_lastSeenSubTotalAmount > _lastSeenSubTotalAmountMax) ? _lastSeenSubTotalAmount : _lastSeenSubTotalAmount;
                                            _lastSeenSubTotalAmountMin = (_lastSeenSubTotalAmount < _lastSeenSubTotalAmountMin) ? _lastSeenSubTotalAmount : _lastSeenSubTotalAmount;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.Age && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenAge = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);
                                            if (_lastSeenAgeMin == 0) _lastSeenAgeMin = _lastSeenAge;

                                            _lastSeenAgeMax = (_lastSeenAge > _lastSeenAgeMax) ? _lastSeenAge : _lastSeenAge;
                                            _lastSeenAgeMin = (_lastSeenAge < _lastSeenAgeMin) ? _lastSeenAge : _lastSeenAge;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.TdsPercentage && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenTdsPercentage = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);

                                            if (_lastSeenTdsPercentageMin == 0) _lastSeenTdsPercentageMin = _lastSeenTdsPercentage;

                                            _lastSeenTdsPercentageMax = (_lastSeenTdsPercentage > _lastSeenTdsPercentageMax) ? _lastSeenTdsPercentage : _lastSeenTdsPercentage;
                                            _lastSeenTdsPercentageMin = (_lastSeenTdsPercentage < _lastSeenTdsPercentageMin) ? _lastSeenTdsPercentage : _lastSeenTdsPercentage;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.PaidAmount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenPaidAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);

                                            if (_lastSeenPaidAmountMin == 0) _lastSeenPaidAmountMin = _lastSeenPaidAmount;

                                            _lastSeenPaidAmountMax = (_lastSeenPaidAmount > _lastSeenPaidAmountMax) ? _lastSeenPaidAmount : _lastSeenPaidAmount;
                                            _lastSeenPaidAmountMin = (_lastSeenPaidAmount < _lastSeenPaidAmountMin) ? _lastSeenPaidAmount : _lastSeenPaidAmount;
                                        }
                                        else if ((_entry.Key == JsonReturnConstants.PropertyNames.BadDebtsAccount && _jsonProperty == _entry.Key))
                                        {
                                            _lastSeenBadDebtsAmount = _mySqlDataReader[_entry.Key] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[_entry.Key]);

                                            if (_lastSeenBadDebtsAmountMin == 0) _lastSeenBadDebtsAmountMin = _lastSeenBadDebtsAmount;

                                            _lastSeenBadDebtsAmountMax = (_lastSeenBadDebtsAmount > _lastSeenBadDebtsAmountMax) ? _lastSeenBadDebtsAmount : _lastSeenBadDebtsAmount;
                                            _lastSeenBadDebtsAmountMin = (_lastSeenBadDebtsAmount < _lastSeenBadDebtsAmountMin) ? _lastSeenBadDebtsAmount : _lastSeenBadDebtsAmount;
                                        }
                                    }
                                }
                                _writer.WriteEndObject();

                                //count rows
                                ++_jsonRows;

                                //infinite loop check
                                if (_jsonRows >= _maxRecordLoopCount)
                                {
                                    //exit loop
                                    break;
                                }
                            }
                        }

                        //close data array
                        // ]
                        _writer.WriteEnd();

                        if (_includeExtraVariables == true)
                        {
                            //// Object for min max decimal values
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.MinMaxValues);
                            //_writer.WriteStartObject();

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.InvoiceAmountMin);
                            //_writer.WriteValue(_lastSeenInvoiceAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.InvoiceAmountMax);
                            //_writer.WriteValue(_lastSeenInvoiceAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.InvoicePaidAmountMin);
                            //_writer.WriteValue(_lastSeenInvoicePaidAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.InvoicePaidAmountMax);
                            //_writer.WriteValue(_lastSeenInvoicePaidAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.BalanceAmountMin);
                            //_writer.WriteValue(_lastSeenBalanceAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.BalanceAmountMax);
                            //_writer.WriteValue(_lastSeenBalanceAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.TdsAmountMin);
                            //_writer.WriteValue(_lastSeenTdsAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.TdsAmountMax);
                            //_writer.WriteValue(_lastSeenTdsAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.CreditNoteAmountMin);
                            //_writer.WriteValue(_lastSeenCreditNoteAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.CreditNoteAmountMax);
                            //_writer.WriteValue(_lastSeenCreditNoteAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.OrderValueMin);
                            //_writer.WriteValue(_lastSeenOrderValueMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.OrderValueMax);
                            //_writer.WriteValue(_lastSeenOrderValueMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.RevenueMin);
                            //_writer.WriteValue(_lastSeenRevenueMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.RevenueMax);
                            //_writer.WriteValue(_lastSeenRevenueMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.PaymentAppliedMin);
                            //_writer.WriteValue(_lastSeenPaymentAppliedMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.PaymentAppliedMax);
                            //_writer.WriteValue(_lastSeenPaymentAppliedMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.PaymentAmountMin);
                            //_writer.WriteValue(_lastSeenPaymentAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.PaymentAmountMax);
                            //_writer.WriteValue(_lastSeenPaymentAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.TdsPaidAmountMin);
                            //_writer.WriteValue(_lastSeenTdsPaidAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.TdsPaidAmountMax);
                            //_writer.WriteValue(_lastSeenTdsPaidAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.AgeMin);
                            //_writer.WriteValue(_lastSeenAgeMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.AgeMax);
                            //_writer.WriteValue(_lastSeenAgeMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.SubTotalAmountMin);
                            //_writer.WriteValue(_lastSeenSubTotalAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.SubTotalAmountMax);
                            //_writer.WriteValue(_lastSeenSubTotalAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.TdsPercentageMin);
                            //_writer.WriteValue(_lastSeenTdsPercentageMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.TdsPercentageMax);
                            //_writer.WriteValue(_lastSeenTdsPercentageMax);


                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.PaidAmountMin);
                            //_writer.WriteValue(_lastSeenPaidAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.PaidAmountMax);
                            //_writer.WriteValue(_lastSeenPaidAmountMax);

                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.BadDebtsAmountMin);
                            //_writer.WriteValue(_lastSeenBadDebtsAmountMin);
                            //_writer.WritePropertyName(JsonReturnConstants.PropertyNames.BadDebtsAmountMax);
                            //_writer.WriteValue(_lastSeenBadDebtsAmountMax);

                            //_writer.WriteEndObject();

                        }

                       

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.Paging);
                        _writer.WriteStartObject();
                        //Get Total Row Count
                        _mySqlDataReader.NextResult();
                        if (_mySqlDataReader.HasRows == true)
                        {
                            _mySqlDataReader.Read(); //read only one row as its just count
                            int _totalRowCount = _mySqlDataReader[JsonReturnConstants.PropertyNames.RowCount] == DBNull.Value ? 0 : Convert.ToInt32(_mySqlDataReader[JsonReturnConstants.PropertyNames.RowCount]);
                            _writer.WritePropertyName(JsonReturnConstants.PropertyNames.TotalRows);
                            _writer.WriteValue(_totalRowCount);
                        }
                        else
                        {
                            _writer.WritePropertyName(JsonReturnConstants.PropertyNames.TotalRows);
                            _writer.WriteValue(0);
                        }

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.ReturnedRows);
                        _writer.WriteValue(_jsonRows);

                        _loopEnd = DateTime.Now;
                        _loopTime = (_loopEnd - _loopStart);


                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.Direction);
                        _writer.WriteValue(httpPaging?.Direction ?? 0);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SortOrderDirection);
                        _writer.WriteValue(httpPaging?.SortDirection ?? "");

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.PageSize);
                        _writer.WriteValue(httpPaging?.PageSize ?? 10);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.SortBy);
                        _writer.WriteValue(httpPaging?.SortBy ?? "");

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.LastOffset);  //this is important to find the direction NEXT or PREV
                        _writer.WriteValue(_lastOffset);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.LastSeenIdMax);
                        _writer.WriteValue(_lastSeenIdMax);

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.LastSeenIdMin);
                        _writer.WriteValue(_lastSeenIdMin);


                        // }
                        _writer.WriteEndObject();

                        _writer.WritePropertyName(JsonReturnConstants.PropertyNames.Stats);
                        _writer.WriteStartObject();
                        // {

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

                        // }
                        _writer.WriteEndObject();

                        //write json string from sw
                        _jsonReturn = _sw.ToString();

                        //dispose objects
                        _sw?.Dispose();
                        _writer = null;

                        _functionReturn.Status = true;
                    }
                    else
                    {
                        _success = false;
                    }
                    //Cleanup
                    _mySqlDataReader?.Close();
                    _mySqlDataReader?.Dispose();
                    _mySqlCommand?.Dispose();

                    if (_success)
                    {
                        _mySqlTransaction?.Commit();

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SuccessMessage;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordFetchedSuccessfully);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                    }
                    else
                    {
                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = _success;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.AppError;
                        _functionReturn.Message.Add(Constants.GenericMessages.RecordNotFound);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.Unauthorized;
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        _mySqlDataReader?.Close();
                        _mySqlDataReader?.Dispose();
                        _mySqlCommand?.Dispose();

                        _mySqlTransaction?.Rollback();

                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(ex.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {ex.Message}");
                    }
                    catch (Exception exTran)
                    {
                        _functionReturn.Status = false;
                        _functionReturn.MessageType = Constants.ReturnMessageTypes.SystemError;
                        _functionReturn.Message.Clear();
                        _functionReturn.Message.Add(exTran.Message);
                        _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.InternalServerError;
                        _loggerFunctions.SeriLogAsync(Enumeration.LogLevel.Error, $"[{methodName}]: {exTran.Message}");
                    }
                }
                finally
                {
                    if (_mySqlConnection != null && _mySqlConnection.State != ConnectionState.Closed)
                    {
                        _mySqlConnection.Close();
                        _mySqlConnection = null;
                    }
                    _mySqlDataReader?.Close();
                    _mySqlDataReader?.Dispose();
                    _mySqlDataReader = null;
                    _mySqlTransaction?.Dispose();
                    _mySqlTransaction = null;
                    _mySqlCommand?.Dispose();
                    _mySqlCommand = null;
                    _queryStart = null;
                    _queryEnd = null;
                    _sqlconnStart = null;
                    _sqlconnEnd = null;
                    _sqlconnTime = null;
                    _queryTime = null;
                }
            }
            return (_functionReturn, _jsonReturn);
        }
    }
}
