using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ISection
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionId)]
        public UInt64 SectionId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionGuid)]
        public string SectionGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionName)]
        public string SectionName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionDescription)]
        public string SectionDescription { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionStatus)]
        public string SectionStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionVisibility)]
        public string SectionVisibility { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SectionCssClass)]
        public string SectionCssClass { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Components)]
        public List<Component> Components { get; set; }
    }
}