
using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaymentGatewayRazorPay
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationPayGatewayId)]
        public string RegistrationPayGatewayId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayEnvironmentId)]
        public string PayGatewayEnvironmentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.KeyId)]
        public string KeyId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.KeySecret)]
        public string KeySecret { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BankName)]
        public string BankName { get; set; }
       
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ReturnUrl)]
        public string ReturnUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }
    }
}