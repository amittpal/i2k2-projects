using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaytmRequestDetail
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.OrderId)]
        public string OrderId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationsGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Email)]
        public string Email { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MobileNumber)]
        public string MobileNumber { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FeeAmount)]
        public string FeeAmount { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RequestDateTime)]
        public string RequestDateTime { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PayDetail)]
        public string PayDetail { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayId)]

        public string PaymentGatewayId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CheckSumHash)]
        public string CheckSumHash { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TxnStatus)]

        public string TxnStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaytmResponse)]
        public PaytmResponseDetail PaytmResponseDetail { get; set; }
    }
}
