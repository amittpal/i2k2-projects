using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models
{
    public class DatabaseSettings : IDatabaseSettings
    {
        public string MySqlConnection { get; set; }
        public int MySqlTimeout { get; set; }
        public string RedisConnection { get; set; }
        public int MaxRecordLoopCount { get; set; }
        public int MaxReportLoopCount { get; set; }
    }
}
