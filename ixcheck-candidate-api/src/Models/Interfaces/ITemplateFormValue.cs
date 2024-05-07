using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ITemplateFormValue
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutId)]
        public UInt64 LayoutId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutTypeCode)]
        public string LayoutTypeCode { get; set; }


        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutGuid)]
        public string LayoutGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PageId)]
        public UInt64 PageId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PageGuid)]
        public string PageGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionId)]
        public UInt64 SectionId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionGuid)]
        public string SectionGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentId)]
        public UInt64 ComponentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentGuid)]
        public string ComponentGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentName)]
        public string ComponentName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataValue)]
        public string DataValue { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataShowInGrid)]
        public bool DataShowInGrid { get; set; }
    }
}