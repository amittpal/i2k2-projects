using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class RazorPayResponseDetail : IRazorPayResponseDetail
    {
        public string Id { get; set; }
        public string OrderId { get; set; }
        public string RazorPayOrderId { get; set; }
        public string RazorPayPaymentId { get; set; }
        public string RazorPaySignature { get; set; }
        public string TxnId { get; set; }
        public string TxnAmount { get; set; }
        public string PaymentMode { get; set; }
        public string Currency { get; set; }
        public string TxnDate { get; set; }
        public string GatewayName { get; set; }
        public string BankTxnId { get; set; }
        public string BankName { get; set; }
        public string CheckSumHash { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string TxnStatus { get; set; }
        
    }
}