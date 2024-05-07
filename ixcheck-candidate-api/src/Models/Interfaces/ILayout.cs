using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ILayout
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutId)]
        public string LayoutId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutGuid)]
        public string LayoutGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutName)]
        public string LayoutName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutDescription)]
        public string LayoutDescription { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutStatus)]
        public string LayoutStatus { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutJson)]
        public string LayoutJson { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutCode)]
        public string LayoutCode { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutExamType)]
        public string LayoutExamType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutExamTypeGuid)]
        public string LayoutExamTypeGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutPageName)]
        public string LayoutPageName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutNumber)]
        public string LayoutNumber { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Pages)]
        public List<Page> Pages { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutType)]
        public string LayoutType { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LayoutTypeGuid)]
        public string LayoutTypeGuid { get; set; }
    }
}
