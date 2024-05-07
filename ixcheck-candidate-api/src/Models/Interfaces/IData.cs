using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
  public  interface IData
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataId)]
        public UInt64 DataId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataValue)]
        public string DataValue { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataStatus)]
        public string DataStatus { get; set; }
    }
}