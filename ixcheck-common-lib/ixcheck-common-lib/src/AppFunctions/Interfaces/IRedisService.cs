using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface IRedisService
    {
        ConnectionMultiplexer Connection { get; }
    }
}
