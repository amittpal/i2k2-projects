using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models
{
    public class LoggerSettings : ILoggerSettings
    {
        public int LogLevel { get; set; }
        public bool LoggingEnabled { get; set; }
    }
}
