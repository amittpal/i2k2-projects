using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PaymentGatewayPaytm : IPaymentGatewayPaytm
    {
        public string RegistrationPayGatewayId { get; set; }
        public string PaymentGatewayEnvironmentId { get; set; }
        public string Mid { get; set; }
        public string MerchantKey { get; set; }
        public string ChannelId { get; set; }
        public string BankName { get; set; }
        public string ReturnUrl { get; set; }
        public string PaytmUrl { get; set; }
        public string AppUrl { get; set; }
        public string WebSite { get; set; }
        public string IndustryType { get; set; }
        public string Status { get; set; }
    }
}