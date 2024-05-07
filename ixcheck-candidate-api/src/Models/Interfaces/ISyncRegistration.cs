using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ISyncRegistration
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SyncServerGuid)]
        public string SyncServerGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SyncDate)]
        public string SyncDate { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FirstSync)]
        public string FirstSync { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FileName)]
        public string FileName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RecordCount)]
        public string RecordCount { get; set; }
    }
}
