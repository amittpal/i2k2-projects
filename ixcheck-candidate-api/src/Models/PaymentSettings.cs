using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class PaymentSettings : IPaymentSettings
    {
        public string AuthNetAPIUrl { get; set; }
        public string KeyName { get; set; }
        public string TransactionKey { get; set; }
        public string ValidationMode { get; set; }
        public string MerchantKey { get; set; }
        public string Mid { get; set; }
        public string CallBackUrl { get; set; }
        public string WebSite { get; set; }
        public string IndustryType { get; set; }
        public string ChannelId { get; set; }
        public string AppUrl { get; set; }
    }
}