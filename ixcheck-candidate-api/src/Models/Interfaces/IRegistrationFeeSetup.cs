using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IRegistrationFeeSetup
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Level1)]
        public string Level1 { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Level2)]
        public string Level2 { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Level3)]
        public string Level3 { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Amount)]
        public string Amount { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Priority)]
        public string Priority { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public bool Status { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamGuid)]
        public string ExamGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegTypeGuid)]
        public string RegTypeGuid { get; set; }
    }
}