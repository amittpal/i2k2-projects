using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IRazorPayResponseDetail
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.OrderId)]
        string OrderId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RazorPayOrderId)]
        string RazorPayOrderId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RazorPayPaymentId)]
        string RazorPayPaymentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RazorPaySignature)]
        string RazorPaySignature { get; set; }
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
        
    }
}