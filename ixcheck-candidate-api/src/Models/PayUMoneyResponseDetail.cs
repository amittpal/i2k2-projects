using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PayUMoneyResponseDetail : IPayUMoneyResponseDetail
    {
        public string Id { get; set; }
        public string MerchantHash { get; set; }
        public string OrderId { get; set; }
        public string FirstName { get; set; }
        public string TxnAmount { get; set; }
        public string PaymentMode { get; set; }
        public string PayUMoneyId { get; set; }
        public string TxnDate { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string GatewayName { get; set; }
        public string BankTxnId { get; set; }
        public string ProductInfo { get; set; }
        public string CheckSumHash { get; set; }
        public string TxnStatus { get; set; }
    }
}