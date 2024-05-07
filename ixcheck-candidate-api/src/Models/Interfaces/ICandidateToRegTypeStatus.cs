using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ICandidateToRegTypeStatus
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegTypeGuid)]
        public string RegTypeGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EligibilityOutputJson)]
        public string EligibilityOutputJson { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EligibilityStatus)]
        public string EligibilityStatus { get; set; }
    }
}