using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PaymentGatewayPayUMoney : IPaymentGatewayPayUMoney
    {
        public string RegistrationPayGatewayId { get; set; }
        public string PaymentGatewayEnvironmentId { get; set; }
        public string MerchantKey { get; set; }
        public string MerchantSalt { get; set; }
        public string AuthHeader { get; set; }
        public string ReturnUrl { get; set; }
        public string PaymentUrl { get; set; }
        public string Status { get; set; }
    }
}