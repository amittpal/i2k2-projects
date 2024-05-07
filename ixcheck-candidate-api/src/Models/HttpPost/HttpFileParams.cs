using IXCheckCandidateApi.Globals;
using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.HttpPost
{
    public class HttpFileParams
    {
        [JsonProperty("dir_root")]
        public string DirectoryRoot { get; set; }

        [JsonProperty("dir_path")]
        public string FolderPath { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DestinationPath)]
        public string DestinationPath { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FileName)]
        public string FileName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SyncServerGuid)]
        public string SyncServerGuid { get; set; }

        public int Offset { get; set; }

        public int Count { get; set; }
    }
}
