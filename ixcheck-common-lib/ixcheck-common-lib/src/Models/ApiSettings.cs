using IXCheckCommonLib.Models.Interfaces;
using System.Collections.Generic;

namespace IXCheckCommonLib.Models
{
    public class ApiSettings : IApiSettings
    {
        public ApiSettings()
        {
        }
        public string Version { get; set; }
        public string PublishDate { get; set; }
        public List<ApiDetails> ApiDetails { get; set; }
        public string ThumbnailImageUrl { get; set; }
        public string FilePath { get; set; }
        public string ResourcesPath { get; set; }
        public bool UseMinio { get; set; }
        public string MinioURL { get; set; }
        public string MinioAccessKey { get; set; }
        public string MinioSecretKey { get; set; }
        public string MinioLocation { get; set; }
        public string PrintServiceApi { get; set; }
        public string ApiBaseUrl { get; set; }
        public string AuthApiUrl { get; set; }
        public List<string> AllowedApplications { get; set; }
    }
}
