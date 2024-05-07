using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IPaytmResponseDetail
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.OrderId)]
        string OrderId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CustomerId)]
        string DistributorId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Mid)]
        string Mid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TxnId)]
        string TxnId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TxnAmount)]
        string TxnAmount { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentMode)]
        string PaymentMode { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Currency)]
        string Currency { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TxnDate)]
        string TxnDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ResponseCode)]
        string ResponseCode { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ResponseMsg)]
        string ResponseMsg { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GatewayName)]
        string GatewayName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BankTxnId)]
        string BankTxnId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BankName)]
        string BankName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CheckSumHash)]
        string CheckSumHash { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FromDate)]
        string FromDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ToDate)]
        string ToDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TxnStatus)]
        string TxnStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TransactionId)]
        string TransactionId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationNumber)]
        string RegistrationNumber { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Email)]
        string Email { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Name)]
        string Name { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MobileNumber)]
        string MobileNumber { get; set; }
    }
}