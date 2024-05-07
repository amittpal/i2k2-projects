using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IJsonFile
    {

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FileName)]
        public string FileName { get; set; }
        
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FileSize)]
        public string FileSize { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LastRecordDateTime)]
        public string LastRecordDateTime { get; set; }
    }
}
