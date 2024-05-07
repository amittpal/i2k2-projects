using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IValidateComponent
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentName)]
        public string ComponentName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataValue)]
        public string ComponentValue { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamGuid)]
        public string ExamGuid { get; set; }
    }
}