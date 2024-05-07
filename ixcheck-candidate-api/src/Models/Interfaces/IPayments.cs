using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPayments
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypeId)]
        public string PaymentGatewayTypeId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentEnvironmentId)]
        public string PaymentEnvironmentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Email)]
        public string Email { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MobileNumber)]
        public string MobileNumber { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentAmount)]
        public string PaymentAmount { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CustomerId)]
        public string CustomerId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.OrderId)]
        public string OrderId { get; set; }
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
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentUrl)]
        public string PaymentUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaytmUrl)]
        public string PaytmUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AppUrl)]
        public string AppUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.WebSite)]
        public string WebSite { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.IndustryType)]
        public string IndustryType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamCode)]
        public string ExamCode { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamName)]
        public string ExamName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamType)]
        public string ExamType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public bool Status { get; set; }
    }
}
