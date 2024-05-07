using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IRazorpayRequestDetail
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
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ProductInfo)]
        public string ProductInfo { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayId)]
        public string PaymentGatewayId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TxnStatus)]
        public string TxnStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RazorPayOrderId)]
        public string RazorPayOrderId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RazorpayResponse)]
        public RazorPayResponseDetail RazorPayResponseDetail { get; set; }
    }
}