using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IXCheckCommonLib.Models
{
    public class AppSettings : IAppSettings
    {
        public AppSettings()
        {
            // this is default options
            // Prompt user to change "UserRootFolderPath" as this is a temp path and will be deleted on uninstall
            //***********************************************************************
            // _assemblyPath\printspool              <-- download files here
            // _assemblyPath\logs                    <-- physical log folder
            // _assemblyPath\tallydata               <-- local file manager root path
            // _assemblyPath\tallydata\printedfiles  <-- moved printed files here

            //this should be a good setting
            //***********************************************************************
            // _assemblyPath\printspool             <-- download files here
            // _assemblyPath\logs                   <-- physical log folder
            // c:\tallydata                         <-- local file manager root path
            // c:\tallydata\printedfiles            <-- moved printed files here

            //Default Values
            JobServiceApiUrl = "http://localhost:22269/api/v1";
            AppServiceApiUrl = "";
            AuthServiceApiUrl = ""; // "https://dev.org01.auth.api.ixcheck.io/api/v1/token";
            PrintServiceApiUrl = "";//"https://dev.org01.printservice.api.ixcheck.io";
            OpenstackServiceApiUrl = "";//"https://dev.org01.printservice.api.ixcheck.io";
            FileWatcherFolderPath = "";//"printspool";
            FileWatcherFileExtension = "";//"*.pdf";
            UserRootFolderPath = "";//"tallydata";
            UserRootFolderPathSelected = false;
            UserPrintedfilesFolderName = "";//"printedfiles";
            PrinterUtilityWin = "";//"i2k2print.exe";
            PrinterUtilityOsx = "";//"i2k2print";
            PrintPdfUtilityWin = "";// "SumatraPDF.exe";
            PrintPdfUtilityOsx = "";//"i2k2print";
            LogFolder = "";//"logs";
            TrashFolder = "";//"trash";
            PrintUtilityTimeout = 6000;
            LogLevel = 1;//"2";
            LoggerLevel = "";//"Debug";


            AssemblyPath = "";
            OsName = "";
            ArchName = "";
            AbsoluteLogFolderPath = "";
            AbsoluteTrashFolderPath = "";
            AbsoluteFileWatcherFolderPath = "";
            AbsoluteUserRootFolderPath = "";
            AbsoluteUserPrintedfilesFolderPath = "";
            AbsolutePrinterUtilityPath = "";
            AbsolutePrintPdfUtilityPath = "";
            AbsoluteSettingsDbPath = "";
            AbsolutePrintersDbPath = "";
            AbsoluteLogsDbPath = "";

            LoggingEnabled = false;
            MySqlConnection = "";
            MySqlTimeout = 100;
            RedisConnection = "";
            MaxRecordLoopCount = 1;
            MaxReportLoopCount = 1;

            ValidForMinutes = 0;
            Issuer = "";
            Subject = "";
            Audience = "";
            SecurityKey = "";
            DesktopID = "";
            GuacApiEndpoint = "";
            DesktopApiUrl = "";

        }
        public string JobServiceApiUrl { get; set; }
        public string AuthServiceApiUrl { get; set; }
        public string AppServiceApiUrl { get; set; }
        public string PrintServiceApiUrl { get; set; }
        public string OpenstackServiceApiUrl { get; set; }
        public string FileWatcherFolderPath { get; set; }
        public string FileWatcherFileExtension { get; set; }
        public string UserRootFolderPath { get; set; }
        public bool UserRootFolderPathSelected { get; set; }
        public string UserPrintedfilesFolderName { get; set; }
        public string PrinterUtilityWin { get; set; }
        public string PrinterUtilityOsx { get; set; }
        public string PrintPdfUtilityWin { get; set; }
        public string PrintPdfUtilityOsx { get; set; }
        public int PrintUtilityTimeout { get; set; }
        public string LogFolder { get; set; }
        public int LogLevel { get; set; }
        public string LoggerLevel { get; set; }
        public string TrashFolder { get; set; }

        public string AssemblyPath { get; set; }
        public string OsName { get; set; }
        public string ArchName { get; set; }

        public string AbsoluteTrashFolderPath { get; set; }
        public string AbsoluteLogFolderPath { get; set; }
        public string AbsoluteFileWatcherFolderPath { get; set; }
        public string AbsoluteUserRootFolderPath { get; set; }
        public string AbsoluteUserPrintedfilesFolderPath { get; set; }

        public string AbsolutePrinterUtilityPath { get; set; }
        public string AbsolutePrintPdfUtilityPath { get; set; }

        public string AbsoluteSettingsDbPath { get; set; }
        public string AbsolutePrintersDbPath { get; set; }
        public string AbsoluteLogsDbPath { get; set; }

        public List<string> SelectedPrinters { get; set; }
        public List<string> Printers { get; set; }

        public bool LoggingEnabled { get; set; }

        public string DesktopID { get; set; }

        public string MySqlConnection { get; set; }
        public int MySqlTimeout { get; set; }
        public string RedisConnection { get; set; }
        public int MaxRecordLoopCount { get; set; }
        public int MaxReportLoopCount { get; set; }

        public int ValidForMinutes { get; set; }
        public string Issuer { get; set; }
        public string Subject { get; set; }
        public string Audience { get; set; }
        public DateTime NotBefore => DateTime.UtcNow;
        public DateTime IssuedAt => DateTime.UtcNow;
        public Func<Task<string>> JtiGenerator =>
          () => Task.FromResult(Guid.NewGuid().ToString());
        public string SecurityKey { get; set; }

        public string LogFile { get; set; }
        public string SeriLogMinimumLevelDefault { get; set; }
        public string SeriLogMinimumLevelOverrideMicrosoft { get; set; }
        public string SeriLogMinimumLevelOverrideSystem { get; set; }
        public string SeriLogMinimumLevelOverrideOrgPrintServiceApi { get; set; }
        public string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreMvc { get; set; }
        public string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreMvcInternal { get; set; }
        public string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreAuthentication { get; set; }
        public string SeriLogMinimumLevelOverrideMicrosoftAspNetCoreHostingInternalWebHost { get; set; }

        public string GuacApiEndpoint { get; set; }
        public string DesktopApiUrl { get; set; }


    }
}
