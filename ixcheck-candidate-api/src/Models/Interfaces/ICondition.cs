using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ICondition
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionId)]
        public UInt64 ConditionId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionComponentId)]
        public string ConditionComponentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionComponentGuid)]
        public string ConditionComponentGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionConditional)]
        public string ConditionConditional { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionStatus)]
        public string ConditionStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionEventType)]
        public string ConditionEventType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionChangeType)]
        public string ConditionChangeType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionComponentToChange)]
        public string ConditionComponentToChange { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConditionsectionToShowHide)]
        public string ConditionsectionToShowHide { get; set; }
    }
}