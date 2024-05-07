using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaymentSbiCollectDetail
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentDate)]
        public string PaymentDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentAmount)]
        public string PaymentAmount { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }
    }
}