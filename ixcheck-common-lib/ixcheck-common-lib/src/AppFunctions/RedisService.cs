using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.Models.Interfaces;
using StackExchange.Redis;
using System;

namespace IXCheckCommonLib.AppFunctions
{
    public class RedisService : IRedisService
    {
        private readonly IDatabaseSettings _databaseSettings;
        private static Lazy<ConnectionMultiplexer> _lazyConnection;
        static object _connectLock = new object();

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__databaseSettings"></param>
        public RedisService(IDatabaseSettings __databaseSettings)
        {
            _databaseSettings = __databaseSettings;

            if (_lazyConnection == null)
            {
                lock (_connectLock)
                {
                    if (_lazyConnection == null)
                    {
                        _lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
                        {
                            return ConnectionMultiplexer.Connect(_databaseSettings.RedisConnection);
                        });
                    }
                }
            }
        }
        /// <summary>
        /// Get Connection Value
        /// </summary>
        public ConnectionMultiplexer Connection
        {
            get
            {
                return _lazyConnection.Value;
            }
        }
    }
}
