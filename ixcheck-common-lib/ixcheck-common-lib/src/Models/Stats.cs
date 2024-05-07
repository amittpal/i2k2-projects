using IXCheckCommonLib.Models.Interfaces;
using System;

namespace IXCheckCommonLib.Models
{
    public class Stats : IStats
    {
        public Stats()
        {
            StatsId = new Guid();
            CacheCheckStart = DateTime.Now;
            CacheCheckEnd = DateTime.Now;
            CacheCheckTime = (CacheCheckEnd - CacheCheckStart);

            SQLQueryStart = DateTime.Now;
            SQLQueryEnd = DateTime.Now;
            SQLQueryTime = (SQLQueryEnd - SQLQueryStart);

            SQLConnectionStart = DateTime.Now;
            SQLConnectionEnd = DateTime.Now;
            SQLConnectionTime = (SQLConnectionEnd - SQLConnectionStart);
        }
        public Guid StatsId { get; set; }
        public DateTime CacheCheckStart { get; set; }
        public DateTime CacheCheckEnd { get; set; }
        public TimeSpan CacheCheckTime { get; set; }

        public DateTime SQLQueryStart { get; set; }
        public DateTime SQLQueryEnd { get; set; }
        public TimeSpan SQLQueryTime { get; set; }

        public DateTime SQLConnectionStart { get; set; }
        public DateTime SQLConnectionEnd { get; set; }
        public TimeSpan SQLConnectionTime { get; set; }
    }
}
