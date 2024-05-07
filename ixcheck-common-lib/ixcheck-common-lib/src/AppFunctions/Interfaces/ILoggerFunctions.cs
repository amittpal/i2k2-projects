using IXCheckCommonLib.Globals;

namespace IXCheckCommonLib.AppFunctions.Interfaces
{
    public interface ILoggerFunctions
    {
        void SeriLogAsync(Enumeration.LogLevel _logLevel, string _message);
    }
}
