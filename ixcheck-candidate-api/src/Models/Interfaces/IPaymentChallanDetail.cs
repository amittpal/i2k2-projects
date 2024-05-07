using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaymentChallanDetail
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BankName)]
        public string BankName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChallanNumber)]
        public string ChallanNumber { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChallanDate)]
        public string ChallanDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChallanAmount)]
        public string ChallanAmount { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }
    }
}