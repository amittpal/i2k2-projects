using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaymentGatewayPaytm
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationPayGatewayId)]
        public string RegistrationPayGatewayId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayEnvironmentId)]
        public string PaymentGatewayEnvironmentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Mid)]
        public string Mid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MerchantKey)]
        public string MerchantKey { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ChannelId)]
        public string ChannelId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BankName)]
        public string BankName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ReturnUrl)]
        public string ReturnUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaytmUrl)]
        public string PaytmUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AppUrl)]
        public string AppUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.WebSite)]
        public string WebSite { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.IndustryType)]
        public string IndustryType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }
    }
}