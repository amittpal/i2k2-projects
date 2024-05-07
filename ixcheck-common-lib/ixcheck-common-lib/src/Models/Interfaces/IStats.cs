using System;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IStats
    {
        Guid StatsId { get; set; }
        DateTime CacheCheckStart { get; set; }
        DateTime CacheCheckEnd { get; set; }
        TimeSpan CacheCheckTime { get; set; }
    }
}
