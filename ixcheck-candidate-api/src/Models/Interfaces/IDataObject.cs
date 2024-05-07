using System;
using System.Collections.Generic;
using System.Text;
using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using IXCheckCandidateApi.Globals;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IDataObject
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataObjectId)]
        public UInt64 DataObjectId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataObjectEndPoint)]
        public string DataObjectEndPoint { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataObjectTextField)]
        public string DataObjectTextField { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataObjectValueField)]
        public string DataObjectValueField { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataObjectStatus)]
        public string DataObjectStatus { get; set; }
    }
}