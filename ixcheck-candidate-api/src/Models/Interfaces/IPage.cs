using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPage
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PageId)]
        public UInt64 PageId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PageGuid)]
        public string PageGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PageName)]
        public string PageName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PageDescription)]
        public string PageDescription { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PageStatus)]
        public string PageStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Sections)]
        public List<Section> Sections { get; set; }
    }
}
