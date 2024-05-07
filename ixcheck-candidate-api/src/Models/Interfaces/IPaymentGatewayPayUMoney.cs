using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaymentGatewayPayUMoney
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationPayGatewayId)]
        public string RegistrationPayGatewayId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayEnvironmentId)]
        public string PaymentGatewayEnvironmentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MerchantKey)]
        public string MerchantKey { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MerchantSalt)]
        public string MerchantSalt { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AuthHeader)]
        public string AuthHeader { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ReturnUrl)]
        public string ReturnUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentUrl)]
        public string PaymentUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }
    }
}