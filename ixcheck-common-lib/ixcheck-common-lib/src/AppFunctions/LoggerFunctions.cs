using IXCheckCommonLib.AppFunctions.Interfaces;
using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models.Interfaces;
using System.Threading.Tasks;

namespace IXCheckCommonLib.AppFunctions
{
    public class LoggerFunctions : ILoggerFunctions
    {
        private readonly ILoggerSettings _loggerSettings;
        private int _logLevelDefault = 4;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="__loggerSettings"></param>
        public LoggerFunctions(ILoggerSettings __loggerSettings)
        {
            _loggerSettings = __loggerSettings;
        }

        /// <summary>
        /// Seri Log
        /// </summary>
        /// <param name="_logLevel"></param>
        /// <param name="_message"></param>
        /// <returns></returns>
        private bool SeriLog(Enumeration.LogLevel _logLevel, string _message)
        {
            //System.Threading.Thread.Sleep(10000);
            bool _flag = true;
            try
            {
                _logLevelDefault = (_loggerSettings.LogLevel <= 0) ? 4 : _loggerSettings.LogLevel;
                // Logging is On then it will log otherwise it will be off
                if (_loggerSettings.LoggingEnabled)
                {
                    // If Log Level is greater than or equal to defaultloglevel than it will be logged
                    if ((int)_logLevel >= _logLevelDefault)
                    {
                        switch (_logLevel.ToString().ToLower())
                        {
                            case Constants.LogLevel.VERBOSE:
                                Serilog.Log.Logger.Verbose(_message);
                                break;
                            case Constants.LogLevel.TRACE:
                                Serilog.Log.Logger.Verbose(_message);
                                break;
                            case Constants.LogLevel.INFORMATION:
                                Serilog.Log.Logger.Information(_message);
                                break;
                            case Constants.LogLevel.DEBUG:
                                Serilog.Log.Logger.Debug(_message);
                                break;
                            case Constants.LogLevel.WARNING:
                                Serilog.Log.Logger.Warning(_message);
                                break;
                            case Constants.LogLevel.ERROR:
                                Serilog.Log.Logger.Error(_message);
                                break;
                            case Constants.LogLevel.CRITICAL:
                                Serilog.Log.Logger.Fatal(_message);
                                break;
                            case Constants.LogLevel.FATAL:
                                Serilog.Log.Logger.Fatal(_message);
                                break;
                            case Constants.LogLevel.NONE:
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            catch { _flag = false; }
            return _flag;
        }
        /// <summary>
        /// Seri Log Async
        /// </summary>
        /// <param name="_logLevel"></param>
        /// <param name="_message"></param>
        /// <returns></returns>
        public void SeriLogAsync(Enumeration.LogLevel _logLevel, string _message)
        {
            Task.Run(() => SeriLog(_logLevel, _message));
        }
     
    }
}
