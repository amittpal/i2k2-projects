using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IAppSettings
    {
        string JobServiceApiUrl { get; set; }
        string AuthServiceApiUrl { get; set; }
        string AppServiceApiUrl { get; set; }
        string PrintServiceApiUrl { get; set; }
        string OpenstackServiceApiUrl { get; set; }
        string FileWatcherFolderPath { get; set; }
        string FileWatcherFileExtension { get; set; }
        string UserRootFolderPath { get; set; }
        string UserPrintedfilesFolderName { get; set; }
        string PrinterUtilityWin { get; set; }
        string PrinterUtilityOsx { get; set; }
        string PrintPdfUtilityWin { get; set; }
        string PrintPdfUtilityOsx { get; set; }
        int PrintUtilityTimeout { get; set; }
        string TrashFolder { get; set; }
        string LogFolder { get; set; }
        int LogLevel { get; set; }
        string LoggerLevel { get; set; }
        string DesktopID { get; set; }

        string AssemblyPath { get; set; }
        string OsName { get; set; }
        string ArchName { get; set; }

        string AbsoluteTrashFolderPath { get; set; }
        string AbsoluteLogFolderPath { get; set; }
        string AbsoluteFileWatcherFolderPath { get; set; }
        string AbsoluteUserRootFolderPath { get; set; }
        bool UserRootFolderPathSelected { get; set; }
        string AbsoluteUserPrintedfilesFolderPath { get; set; }

        string AbsolutePrinterUtilityPath { get; set; }
        string AbsolutePrintPdfUtilityPath { get; set; }

        string AbsoluteSettingsDbPath { get; set; }
        string AbsolutePrintersDbPath { get; set; }
        string AbsoluteLogsDbPath { get; set; }

        List<string> SelectedPrinters { get; set; }
        List<string> Printers { get; set; }

        bool LoggingEnabled { get; set; }
        string MySqlConnection { get; set; }
        int MySqlTimeout { get; set; }
        string RedisConnection { get; set; }
        int MaxRecordLoopCount { get; set; }
        int MaxReportLoopCount { get; set; }

        int ValidForMinutes { get; set; }
        string Issuer { get; set; }
        string Subject { get; set; }
        string Audience { get; set; }
        DateTime NotBefore { get; }
        DateTime IssuedAt { get; }
        Func<Task<string>> JtiGenerator { get; }
        string SecurityKey { get; set; }

        string LogFile { get; set; }
        string SeriLogMinimumLevelDefault { get; set; }
        string SeriLogMinimumLevelOverrideMicrosoft { get; set; }
        string SeriLogMinimumLevelOverrideSystem { get; set; }
        string SeriLogMinimumLevelOverrideOrgPrintServiceApi { get; set; }
        string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreMvc { get; set; }
        string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreMvcInternal { get; set; }
        string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreAuthentication { get; set; }
        string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreHostingInternalWebHost { get; set; }

        string GuacApiEndpoint { get; set; }
        string DesktopApiUrl { get; set; }
    }
}
