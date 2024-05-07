using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IApiSettings
    {
        string Version { get; set; }
        string PublishDate { get; set; }
        List<ApiDetails> ApiDetails { get; set; }
        string ThumbnailImageUrl { get; set; }
        string FilePath { get; set; }
        string ResourcesPath { get; set; }
        bool UseMinio { get; set; }
        string MinioURL { get; set; }
        string MinioAccessKey { get; set; }
        string MinioSecretKey { get; set; }
        string MinioLocation { get; set; }
        string PrintServiceApi { get; set; }
        string ApiBaseUrl { get; set; }
        string AuthApiUrl { get; set; }
        List<string> AllowedApplications { get; set; }
    }
}
