using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IOfflinePayments
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId)] 
        public string PaymentGatewayTypeId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentAmount)]
        public string PaymentAmount { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentDate)]
        public string PaymentDate { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BankName)]
        public string BankName { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChallanNumber)]
        public string ChallanNumber { get; set; }
                  
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChallanDate)]
        public string ChallanDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChallanAmount)]
        public string ChallanAmount { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ModeChequeDD)]
        public string ModeChequeDD { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChequeNumber)]
        public string ChequeNumber { get; set; }        
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChequeDate)]
        public string ChequeDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChequeAmount)]
        public string ChequeAmount { get; set; }        
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public bool Status { get; set; }
    }
}
