namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IDatabaseSettings
    {
        string MySqlConnection { get; set; }
        int MySqlTimeout { get; set; }
        string RedisConnection { get; set; }
        int MaxRecordLoopCount { get; set; }
        int MaxReportLoopCount { get; set; }
    }
}
