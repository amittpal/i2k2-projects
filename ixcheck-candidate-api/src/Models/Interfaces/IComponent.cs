using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IComponent
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentId)]
        public UInt64 ComponentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentGuid)]
        public string ComponentGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentName)]
        public string ComponentName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentCols)]
        public string ComponentCols { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentRows)]
        public string ComponentRows { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentX)]
        public string ComponentX { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentY)]
        public string ComponentY { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentStatus)]
        public string ComponentStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Settings)]
        public Setting Setting { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Data)]
        public Data Data { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataObjects)]
        public DataObject DataObjects { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Validations)]
        public Validation Validations { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Conditions)]
        public Condition Conditions { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AiParameters)]
        public AISettings AISettings { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegGridComponentsMain)]
        public List<RegGridComponentsMain> RegGridComponentsMain { get; set; }
    }
}
