using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.AppValidations;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models;
using IXCheckCommonLib.Models.Interfaces;
using MySql.Data.MySqlClient;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions
{
    public class CacheFunctions : ICacheFunctions
    {
        private readonly IDatabaseSettings _databaseSettings;
        private readonly IDatabaseFunctions _databaseFunctions;
        private static IRedisService _redisService;
        private static ILoggerFunctions _loggerFunctions;
        private static IFunctionReturn _functionReturn;
        private static IStats _stats;
        private static IApiSettings _apiSettings;

        public CacheFunctions(IDatabaseSettings __databaseSettings, IRedisService __redisService, ILoggerFunctions __loggerFunctions, IDatabaseFunctions __databaseFunctions, IStats __stats, IApiSettings __apiSettings)
        {
            _databaseSettings = __databaseSettings;
            _redisService = __redisService;
            _loggerFunctions = __loggerFunctions;
            _databaseFunctions = __databaseFunctions;
            _stats = __stats;
            _apiSettings = __apiSettings;
        }

        private bool ValidateApplicationAccess(string _tokenApplicationGuid)
        {
            bool _flag = false;
            try
            {
                if (_apiSettings != null && _apiSettings.AllowedApplications != null && _apiSettings.AllowedApplications?.Count > 0)
                {
                    foreach (string _applicationGuId in _apiSettings.AllowedApplications)
                    {
                        if (_tokenApplicationGuid == _applicationGuId)
                        {
                            _flag = true;
                            break;
                        }
                    }
                }
            }
            catch
            {
                _flag = false;
            }
            return _flag;
        }

        private DateTime CheckHashEntryDate(RedisValue _redisValue)
        {
            DateTime _hashDateTime;
            try
            {
                _hashDateTime = Convert.ToDateTime(_redisValue);
            }
            catch
            {
                _hashDateTime = DateTime.UtcNow;
            }
            return _hashDateTime;
        }

        private HashEntry[] AddJTIHashEntries(HashEntry[] _hashEntryAllJTI, int _tokenExpire, string _hashEntryName, string _hashEntryValue)
        {
            int _hashEntryJTICount = 1;
            HashEntry[] _hashEntriesJTI = null;
            //Set Role Entry
            try
            {
                System.Collections.Generic.Dictionary<string, string> _dictHashEntriesJTI = new System.Collections.Generic.Dictionary<string, string>();
                int _hashEntryJTICounter = 0;
                //string _balanceJTIExpireValue = string.Empty;
                //Remove expired tokens and count remaining keys for _hashEntriesJTI size.
                if (_hashEntryAllJTI != null)
                {
                    foreach (HashEntry hashEntryJTI in _hashEntryAllJTI)
                    {
                        try
                        {
                            DateTime _dtExpiredDateTime = CheckHashEntryDate(hashEntryJTI.Value);//Convert.ToDateTime(hashEntryJTI.Value);
                            DateTime _dtCurrentDateTime = System.DateTime.UtcNow;
                            System.TimeSpan _timeDiffResult = _dtExpiredDateTime.Subtract(_dtCurrentDateTime);
                            if (_timeDiffResult.TotalSeconds > 0)
                            {
                                //_balanceJTIExpireValue = _dtCurrentDateTime.AddMinutes(_timeDiffResult.TotalMinutes).ToString();
                                _dictHashEntriesJTI.Add(hashEntryJTI.Name, hashEntryJTI.Value);
                                _hashEntryJTICount++;
                            }
                        }
                        catch
                        {
                            //Error Converting DateTime Value
                        }
                    }
                }
                //Add HashEntries From Dictionary
                if (_dictHashEntriesJTI != null)
                {
                    _hashEntriesJTI = new HashEntry[_hashEntryJTICount];
                    foreach (KeyValuePair<string, string> _keyValuePair in _dictHashEntriesJTI)
                    {
                        _hashEntriesJTI[_hashEntryJTICounter] = new HashEntry(_keyValuePair.Key, _keyValuePair.Value);
                        _hashEntryJTICounter++;
                    }
                }
                //Add New Global SH
                _hashEntriesJTI[_hashEntryJTICounter] = new HashEntry(_hashEntryName, _hashEntryValue);
            }
            catch
            {
                _hashEntriesJTI = null;
            }
            return _hashEntriesJTI;
        }

        /// <summary>
        /// Insert User Info and Token Info In Cache
        /// </summary>
        /// <param name="_coreUserInfo"></param>
        /// <param name="_tokenExpire"></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn InsertInCache(ICoreUserInfo _coreUserInfo, int _tokenExpire)
        {
            string _methodName = "F:Cache:InsertInCache";
            IFunctionReturn _functionReturn = new FunctionReturn();

            if (_coreUserInfo == null)
            {
                //error - user info not found
                _functionReturn = CommonFunctions.AppError(Constants.UserMessages.UserDataRequired, _methodName);
            }
            else
            {
                //Get the CoreType and CoreID from the Token
                var _coreUserGuId = _coreUserInfo.UserGuId;
                var _coreApplicationGuId = _coreUserInfo.ApplicationGuId;
                var _jtiValue = _coreUserInfo.JTIValue;

                //Once fixed change _coreUserGuId?.Length < 20 to _coreUserGuId?.Length != 36 and all !=30 from <36
                if (string.IsNullOrEmpty(_coreUserGuId) || _coreUserGuId?.Length < 20 || string.IsNullOrEmpty(_coreApplicationGuId) || _coreApplicationGuId?.Length < 36 || string.IsNullOrEmpty(_jtiValue) || _jtiValue?.Length < 36)
                {
                    //error - required user information is missing
                    _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ClaimsUserOrRoleMissing, _methodName);
                }
                else
                {
                    var _hashUniqueIdPer = CommonFunctions.getUniqueHashId(_coreApplicationGuId, _coreUserGuId,"per");
                    var _hashUniqueIdJTI = CommonFunctions.getUniqueHashId(_coreApplicationGuId, _coreUserGuId,"jti");
                    //Connect to Redis cache
                    _redisService = new RedisService(_databaseSettings);
                    ConnectionMultiplexer _connectionMultiplexer = _redisService.Connection;

                    if (_connectionMultiplexer.IsConnected == false)
                    {
                        //error - redis connection failed 
                        _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.RedisConnectionFailed, _methodName);
                    }
                    else
                    {
                        //Get Token Jti Expire Value from Current Date
                        string _tokenJTIValueExpire = System.DateTime.UtcNow.AddSeconds(_tokenExpire).ToString();

                        //Redis Cache is connected, get DB instance DB0 by default
                        var _redisDB = _connectionMultiplexer.GetDatabase();
                        //delete if old key exist
                        if (_redisDB.KeyExists(_hashUniqueIdPer))
                        {
                            _redisDB.KeyDelete(_hashUniqueIdPer);
                        }

                        if (_coreUserInfo.UserPermissions == null)
                        {
                            //Check and Add jti Keys role
                            if (_redisDB.KeyExists(_hashUniqueIdJTI))
                            {
                                var _hashEntryAllJTI = _redisDB.HashGetAll(_hashUniqueIdJTI);
                                var _hashEntriesJTI = AddJTIHashEntries(_hashEntryAllJTI, _tokenExpire, _coreUserInfo.JTIValue, _tokenJTIValueExpire);
                                if (_hashEntriesJTI != null && _hashEntriesJTI.Length > 0)
                                {
                                    //Delete Exisitng Role(JTI) Entries 
                                    _redisDB.KeyDelete(_hashUniqueIdJTI);
                                    //Add Exiting Role(JTI) Entries with Updated Value and Add New Role Entry
                                    _redisDB.HashSet(_hashUniqueIdJTI, _hashEntriesJTI);
                                }
                                else
                                {
                                    //error - _hashEntriesJTI null or blank 
                                    _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ClaimsUserOrRoleMissing, _methodName);
                                }
                            }
                            else
                            {
                                //Set New Role Entry
                                _redisDB.HashSet(_hashUniqueIdJTI, new HashEntry[] {
                                        new HashEntry(_coreUserInfo.JTIValue,_tokenJTIValueExpire)
                                        });
                            }
                            
                            
                        }
                        else
                        {
                            int _hashEntryCount = 0;
                            //Set Role Entry
                            HashEntry[] _HashEntries = new HashEntry[(_coreUserInfo.UserPermissions.Count + _hashEntryCount)];
                            int _permissions = -1;

                            //Add Permissions
                            foreach (var _userPermission in _coreUserInfo.UserPermissions)
                            {
                                _permissions++;
                                _HashEntries[_permissions] = new HashEntry(_userPermission.Name, _userPermission.Action);
                            }
                            _redisDB.HashSet(_hashUniqueIdPer, _HashEntries);
                            
                            //Check and Add Global sh Keys
                            if (_redisDB.KeyExists(_hashUniqueIdJTI))
                            {
                                var _hashEntryAllJTI = _redisDB.HashGetAll(_hashUniqueIdJTI);
                                var _hashEntriesJTI = AddJTIHashEntries(_hashEntryAllJTI, _tokenExpire, _coreUserInfo.JTIValue, _tokenJTIValueExpire);
                                if (_hashEntriesJTI != null && _hashEntriesJTI.Length > 0)
                                {
                                    //Delete Exisitng Role(JTI) Entries 
                                    _redisDB.KeyDelete(_hashUniqueIdJTI);
                                    //Add Exiting Role(JTI) Entries with Updated Value and Add New Role Entry
                                    _redisDB.HashSet(_hashUniqueIdJTI, _hashEntriesJTI);
                                }
                                else
                                {
                                    //error - _hashEntriesJTI null or blank 
                                    _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ClaimsUserOrRoleMissing, _methodName);
                                }
                            }
                            else
                            {
                                //Set New Role Entry
                                _redisDB.HashSet(_hashUniqueIdJTI, new HashEntry[] {
                                        new HashEntry(_coreUserInfo.JTIValue, _tokenJTIValueExpire)
                                        });
                            }
                        }

                        //set expire time equal to the token expiry
                        _redisDB.KeyExpire(_hashUniqueIdPer, new TimeSpan(0, 0, _tokenExpire));
                        _redisDB.KeyExpire(_hashUniqueIdJTI, new TimeSpan(0, 0, _tokenExpire));
                        //*************************
                        _functionReturn.Status = true;
                        //*************************
                    }
                }
            }
            return _functionReturn;
        }

        /// <summary>
        /// Insert User Info and Token Info In Cache Async
        /// </summary>
        /// <param name="_coreUserInfo"></param>
        /// <param name="_tokenExpire"></param>
        /// <returns>Task<IFunctionReturn></returns>
        public Task<IFunctionReturn> InsertInCacheAsync(ICoreUserInfo _coreUserInfo, int _tokenExpire)
        {
            return Task.Run(() => InsertInCache(_coreUserInfo, _tokenExpire));
        }

        /// <summary>
        /// Check Role And Permission In Cache
        /// </summary>
        /// <param name="_corePermissionToMatch"></param>
        /// <param name="_claimsIdentity"></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn CheckRoleAndPermissionInCache(
                                                    string _corePermissionToMatch,
                                                    ClaimsIdentity _claimsIdentity
                                                    )
        {
            string _methodName = "F:Cache:CheckRoleAndPermissionInCache";
            _functionReturn = new FunctionReturn();
            if (_claimsIdentity == null)
            {
                //error - user claim identity not found in token
                _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ClaimsIdentityMissing, _methodName);
            }
            else
            {
                //Get the CoreType and CoreID from the Token
                //cut:? and cid:?
                var _coreApplicationGuId = _claimsIdentity.FindFirst(Constants.TokenValues.AID)?.Value?.ToString();
                var _coreUserGuId = _claimsIdentity.FindFirst(Constants.TokenValues.UUID)?.Value?.ToString();
                var _jtiValue= _claimsIdentity.FindFirst(JwtRegisteredClaimNames.Jti)?.Value?.ToString();
                int _tokenExpire = Convert.ToInt32(_claimsIdentity.FindFirst(JwtRegisteredClaimNames.Exp)?.Value);
                //Convert minutes into seconds
                _tokenExpire = _tokenExpire * 60;

                if (string.IsNullOrEmpty(_coreApplicationGuId) || string.IsNullOrEmpty(_coreUserGuId) || string.IsNullOrEmpty(_jtiValue))
                {
                    //error - required claims missing from the token
                    _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ClaimsUserOrRoleMissing, _methodName);
                }
                else
                {
                    if (ValidateApplicationAccess(_coreApplicationGuId) == false)
                    {
                        //error - required claims missing from the token
                        _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ApplicationAccessNotAllowed, _methodName);
                    }
                    else
                    {
                        var _hashUniqueIdPer = CommonFunctions.getUniqueHashId(_coreApplicationGuId, _coreUserGuId, "per");
                        var _hashUniqueIdJTI = CommonFunctions.getUniqueHashId(_coreApplicationGuId, _coreUserGuId, "jti");
                        //Connect to Redis cache
                        _redisService = new RedisService(_databaseSettings);
                        ConnectionMultiplexer _connectionMultiplexer = _redisService.Connection;

                        if (_connectionMultiplexer == null || (_connectionMultiplexer != null & _connectionMultiplexer.IsConnected == false))
                        {
                            //error - redis connection failed 
                            _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.RedisConnectionFailed, _methodName);
                        }
                        else
                        {
                            //Redis Cache is connected, get DB instance DB0 by default
                            var _redisDB = _connectionMultiplexer.GetDatabase();

                            //get the Core Role from the Redis Cache
                            var _hashJTIValue = _redisDB.HashGet(_hashUniqueIdJTI, _jtiValue);
                            if (_hashJTIValue.IsNull == true)
                            {
                                //error - redis data is null
                                _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ClaimsUserOrRoleMissing, _methodName);
                            }
                            else
                            {
                                //compare the role from Token with Redis Cache
                                //Get The DateTimeValue and Check with Curerent Date whether It is valid or expired.
                                DateTime _dtExpiredDateTime = CheckHashEntryDate(_hashJTIValue); //Convert.ToDateTime(_hashJTIValue);
                                DateTime _dtCurrentDateTime = DateTime.UtcNow;
                                System.TimeSpan _timeDiffResult = _dtExpiredDateTime.Subtract(_dtCurrentDateTime);
                                if (_hashJTIValue.ToString().Trim() == "" && _timeDiffResult.TotalSeconds <= 0)
                                {
                                    //error - Token and server side cache dont match, token temperd with or something else
                                    _functionReturn = CommonFunctions.AppError(Constants.TokenMessages.ClaimsUserOrRoleMissing, _methodName);
                                }
                                else
                                {
                                    //check if the Permission is any good to execute this function
                                    //match permission
                                    //get the Core Role form the Redis Cache
                                    //CorePermissionToMatch - case sensitive
                                    var _permissionHash = _redisDB.HashGet(_hashUniqueIdPer, _corePermissionToMatch);
                                    if (_permissionHash.IsNull == true)
                                    {
                                        //error - redis data is null, permission dont exist
                                        _functionReturn = CommonFunctions.AppError(Constants.PermissionsMessages.PermissionMissing, _methodName);
                                    }
                                    else
                                    {
                                        if (_permissionHash.ToString().Trim() == "1")
                                        {
                                            //***********************************************************
                                            //Permission is GOOD, user is allowed to performs this action
                                            //***********************************************************
                                            _functionReturn.Status = true;
                                            _functionReturn.HttpStatusCode = Constants.HttpStatusCodes.OK;
                                        }
                                        else
                                        {
                                            //Permission is BAD, user is NOT allowed to performs this action
                                            _functionReturn = CommonFunctions.AppError(Constants.PermissionsMessages.PermissionMissing, _methodName);
                                        }
                                    }
                                    //}
                                }
                            }
                        }
                    }
                }
            }

            _stats.CacheCheckEnd = DateTime.Now;
            _stats.CacheCheckTime = (_stats.CacheCheckEnd - _stats.CacheCheckStart);
            return _functionReturn;
        }


        /// <summary>
        /// Check Role And Permission In Cache
        /// </summary>
        /// <param name="_corePermissionToMatch"></param>
        /// <param name="_claimsIdentity"></param>
        /// <returns>Task<IFunctionReturn></returns>
        public Task<IFunctionReturn> CheckRoleAndPermissionInCacheAsync(
                                                    string _corePermissionToMatch,
                                                    ClaimsIdentity _claimsIdentity
                                                    )
        {
            return Task.Run(() => CheckRoleAndPermissionInCache(_corePermissionToMatch, _claimsIdentity));
        }

        /// <summary>
        /// Insert Config Settings In Cache
        /// </summary>
        /// <param name="_configTypeName"></param>
        /// <returns>(bool settingsMissing, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn)</returns>
        private (bool settingsMissing, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn) InsertConfigSettingsInCache(string _configTypeName)
        {
            string _methodName = "F:Cache:InsertConfigSettingsInCache";
            bool _settingsMissing = false;
            int _tokenExpire = 60 * 60; // in Seconds (valid for 60 minutes)

            #region Local Variables
            DataTable _dataTable;
            StringBuilder _sqlQuery;
            TimeSpan? _sqlconnTime;
            TimeSpan? _queryTime;
            ulong _configMainId;
            string _typeName;
            string _keyName;
            string _value;
            List<ConfigSetting> _lstconfigSettings = null;
            ConfigSetting _configSetting;
            //total rows
            int _jsonRows = 0;

            //saftey for WILE loop, exit loop if it reaches this count
            //this prevents infinite loop or large records returend to client
            //this is defined in appsettings.json -> "DatabaseSettings" -> "MaxRecordLoopCount":  300
            int _maxRecordLoopCount = _databaseSettings.MaxRecordLoopCount;

            #endregion

            try
            {
                _lstconfigSettings = new List<ConfigSetting>();
                //GET DATA
                _sqlQuery = new StringBuilder();
                _sqlQuery.Append(" SELECT cm.id, cm.config_type_id,ct.name as config_type_name, cm.config_key_id, ck.name as config_key_name,cm.value,cm.status ");
                _sqlQuery.Append(" from config_main cm ");
                _sqlQuery.Append(" join config_types ct on ct.id = cm.config_type_id ");
                _sqlQuery.Append(" join config_keys ck on ck.id = cm.config_key_id ");
                _sqlQuery.Append(" WHERE ct.name = '" + _configTypeName + "'");
                _sqlQuery.Append(" and cm.status = 1 and ct.status =1 and ck.status = 1 ");
                _sqlQuery.Append(" ;");
                ReadOnlySpan<char> _sqlSpanQuery = _sqlQuery.ToString().AsSpan();
                (_functionReturn, _dataTable, _sqlconnTime, _queryTime) = _databaseFunctions.ExecuteSelectDataTable(_sqlSpanQuery, Constants.MethodNames.InsertConfigSettingsInCache);

                foreach (DataRow row in _dataTable.Rows)
                {
                    //check NULLS and DATA TYPE here for returned column values
                    _configMainId = row[DatabaseConstants.ColumnNames.Id] == DBNull.Value ? 0 : Convert.ToUInt64(row[DatabaseConstants.ColumnNames.Id]);
                    _typeName = row[DatabaseConstants.ColumnNames.ConfigTypeName] == DBNull.Value ? String.Empty : Convert.ToString(row[DatabaseConstants.ColumnNames.ConfigTypeName]);
                    _keyName = row[DatabaseConstants.ColumnNames.ConfigKeyName] == DBNull.Value ? String.Empty : Convert.ToString(row[DatabaseConstants.ColumnNames.ConfigKeyName]);
                    _value = row[DatabaseConstants.ColumnNames.Value] == DBNull.Value ? String.Empty : Convert.ToString(row[DatabaseConstants.ColumnNames.Value]);

                    if (_typeName == _configTypeName)
                    {
                        _configSetting = new ConfigSetting()
                        {
                            Key = _keyName,
                            Value = _value
                        };
                        _lstconfigSettings.Add(_configSetting);
                    }
                    //count rows
                    ++_jsonRows;

                    //infinite loop check
                    if (_jsonRows >= _maxRecordLoopCount)
                    {
                        //exit loop
                        break;
                    }
                }
                _functionReturn.Status = true;

                if (_lstconfigSettings != null && _lstconfigSettings.Count > 0)
                {

                    //Connect to Redis cache
                    _redisService = new RedisService(_databaseSettings);
                    ConnectionMultiplexer _connectionMultiplexer = _redisService.Connection;

                    if (_connectionMultiplexer.IsConnected == false)
                    {
                        //error - redis connection failed 
                        _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.RedisConnectionFailed, _methodName);
                    }
                    else
                    {
                        //Redis Cache is connected, get DB instance DB0 by default
                        var _redisDB = _connectionMultiplexer.GetDatabase();

                        //delete if old key exist
                        if (_redisDB.KeyExists(_configTypeName))
                        {
                            _redisDB.KeyDelete(_configTypeName);
                        }
                        int _hashEntryCount = 0;
                        //Set Role Entry
                        HashEntry[] _HashEntries = new HashEntry[(_lstconfigSettings.Count + _hashEntryCount)];
                        int _settings = 0;
                        //Add Config Settings
                        foreach (ConfigSetting _configSet in _lstconfigSettings)
                        {
                            _HashEntries[_settings] = new HashEntry(_configSet.Key, _configSet.Value);
                            _settings++;
                        }
                        _redisDB.HashSet(_configTypeName, _HashEntries);

                        //set expire time equal to the token expiry
                        _redisDB.KeyExpire(_configTypeName, new TimeSpan(0, 0, _tokenExpire));
                        //*************************
                        _functionReturn.Status = true;
                        //*************************
                    }
                }
                else
                {
                    _settingsMissing = true;
                    _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.SettingsMissingInRedis, _methodName);
                }
            }
            catch(Exception _ex)
            {
                _settingsMissing = true;
                _functionReturn = CommonFunctions.SystemError(_ex.Message, _methodName);
            }
            return (_settingsMissing, _lstconfigSettings, _functionReturn);
        }

        /// <summary>
        /// Insert Config Settings In Cache Async
        /// </summary>
        /// <param name="_configTypeName"></param>
        /// <returns></returns>
        public Task<(bool settingsMissing, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn)> InsertConfigSettingsInCacheAsync(string _configTypeName)
        {
            return Task.Run(() => InsertConfigSettingsInCache(_configTypeName));
        }



        /// <summary>
        /// Get Config Settings From Cache
        /// </summary>
        /// <param name="_configTypeName"></param>
        /// <returns>(bool settingsMissingInRedis, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn)</returns>
        private (bool settingsMissingInRedis, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn) GetConfigSettingsFromCache(string _configTypeName)
        {
            string _methodName = "F:Cache:GetConfigSettingsFromCache";
            _functionReturn = new FunctionReturn();
            List<ConfigSetting> _lstConfigSetting = null;
            ConfigSetting _configSetting;
            bool _settingsMissingInRedis = false;
            //Connect to Redis cache
            _redisService = new RedisService(_databaseSettings);
            ConnectionMultiplexer _connectionMultiplexer = _redisService.Connection;

            if (_connectionMultiplexer == null || (_connectionMultiplexer != null & _connectionMultiplexer.IsConnected == false))
            {
                //error - redis connection failed 
                _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.RedisConnectionFailed, _methodName);
            }
            else
            {
                //Redis Cache is connected, get DB instance DB0 by default
                var _redisDB = _connectionMultiplexer.GetDatabase();

                //Get All Settings from Redis Cache
                var _configSettingsHash = _redisDB.HashGetAll(_configTypeName);
                if (_configSettingsHash == null)
                {
                    //error - redis data is null, permission dont exist
                    _settingsMissingInRedis = true;
                    _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.SettingsMissingInRedis, _methodName);
                }
                else
                {
                    _lstConfigSetting = new List<ConfigSetting>();
                    foreach (HashEntry _hashEntry in _configSettingsHash)
                    {
                        _configSetting = new ConfigSetting()
                        {
                            Key = _hashEntry.Name,
                            Value = _hashEntry.Value
                        };
                        _lstConfigSetting.Add(_configSetting);

                    }
                }
            }
            return (_settingsMissingInRedis, _lstConfigSetting,_functionReturn);
        }

        /// <summary>
        /// Get Config Settings From Cache Async
        /// </summary>
        /// <param name="_configTypeName"></param>
        /// <returns>Task<(bool settingsMissingInRedis, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn)></returns>
        public Task<(bool settingsMissingInRedis, List<ConfigSetting> _configSettings, IFunctionReturn functionReturn)> GetConfigSettingsFromCacheAsync(string _configTypeName)
        {
            return Task.Run(() => GetConfigSettingsFromCache(_configTypeName));
        }

        /// <summary>
        /// Remove Cache Key 
        /// </summary>
        /// <param name="_keyName"></param>
        /// <returns></returns>
        private IFunctionReturn RemoveCacheKey(
                                                    string _keyName
                                                    )
        {
            string _methodName = "F:Cache:RemoveCacheKey";
            _functionReturn = new FunctionReturn();

            //Connect to Redis cache
            _redisService = new RedisService(_databaseSettings);
            ConnectionMultiplexer _connectionMultiplexer = _redisService.Connection;

            if (_connectionMultiplexer == null || (_connectionMultiplexer != null & _connectionMultiplexer.IsConnected == false))
            {
                //error - redis connection failed 
                _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.RedisConnectionFailed, _methodName);
            }
            else
            {
                //Redis Cache is connected, get DB instance DB0 by default
                var _redisDB = _connectionMultiplexer.GetDatabase();
                // Check key in Redis Cache
                bool _keyExists = _redisDB.KeyExists(_keyName);
                if (_keyExists == true)
                {
                    //Delete Key from Redis
                    _redisDB.KeyDelete(_keyName);
                    _functionReturn.Status = true;
                }
            }
            return _functionReturn;
        }
        /// <summary>
        ///  Remove Cache Key Async 
        /// </summary>
        /// <param name="_keyName"></param>
        /// <returns>Task<IFunctionReturn></returns>
        public Task<IFunctionReturn> RemoveCacheKeyAsync(
                                                    string _keyName
                                                    )
        {
            return Task.Run(() => RemoveCacheKey(_keyName));
        }

        /// <summary>
        /// Remove Cache Key List
        /// </summary>
        /// <param name="_lstKeyNames"></param>
        /// <returns>IFunctionReturn</returns>
        private IFunctionReturn RemoveCacheKeyList(
                                                    List<string> _lstKeyNames
                                                    )
        {
            string _methodName = "F:Cache:RemoveCacheKeyList";
            _functionReturn = new FunctionReturn();
            if (_lstKeyNames != null && _lstKeyNames.Count > 0)
            {
                //Connect to Redis cache
                _redisService = new RedisService(_databaseSettings);
                ConnectionMultiplexer _connectionMultiplexer = _redisService.Connection;

                if (_connectionMultiplexer == null || (_connectionMultiplexer != null & _connectionMultiplexer.IsConnected == false))
                {
                    //error - redis connection failed 
                    _functionReturn = CommonFunctions.AppError(Constants.RedisCacheMessages.RedisConnectionFailed, _methodName);
                }
                else
                {
                    //Redis Cache is connected, get DB instance DB0 by default
                    var _redisDB = _connectionMultiplexer.GetDatabase();
                    // Check and delete key from Redis Cache
                    foreach (string _keyName in _lstKeyNames)
                    {
                        bool _keyExists = _redisDB.KeyExists(_keyName);
                        if (_keyExists == true)
                        {
                            //Delete Key from Redis
                            _redisDB.KeyDelete(_keyName);
                            _functionReturn.Status = true;
                        }
                    }
                }
            }
            return _functionReturn;
        }
        /// <summary>
        /// Remove Cache Key List Async
        /// </summary>
        /// <param name="_lstkeyNames"></param>
        /// <returns>Task<IFunctionReturn></returns>
        public Task<IFunctionReturn> RemoveCacheKeyListAsync(
                                                    List<string> _lstkeyNames
                                                    )
        {
            return Task.Run(() => RemoveCacheKeyList(_lstkeyNames));
        }
    }
}
