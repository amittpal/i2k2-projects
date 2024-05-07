using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class FileData
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FilePath)]
        public string FilePath { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Data)]
        public byte[] Data { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public bool Status { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SyncServerGuid)]
        public string SyncServerGuid { get; set; }



    }
}
