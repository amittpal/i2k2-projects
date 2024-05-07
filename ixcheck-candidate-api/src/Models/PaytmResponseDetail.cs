using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class PaytmResponseDetail : IPaytmResponseDetail
    {
        public string Id { get; set; }
        public string OrderId { get; set; }
        public string DistributorId { get; set; }
        public string Mid { get; set; }
        public string TxnId { get; set; }
        public string TxnAmount { get; set; }
        public string PaymentMode { get; set; }
        public string Currency { get; set; }
        public string TxnDate { get; set; }
        public string ResponseCode { get; set; }
        public string ResponseMsg { get; set; }
        public string GatewayName { get; set; }
        public string BankTxnId { get; set; }
        public string BankName { get; set; }
        public string CheckSumHash { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string TxnStatus { get; set; }
        public string TransactionId { get; set; }
        public string RegistrationNumber { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string MobileNumber { get; set; }
    }
}