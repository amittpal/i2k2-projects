using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PaymentGatewayRazorPay : IPaymentGatewayRazorPay
    {
        public string RegistrationPayGatewayId { get; set; }
        public string PayGatewayEnvironmentId { get; set; }
        public string KeyId { get; set; }
        public string KeySecret { get; set; }
        public string BankName { get; set; }      
        public string ReturnUrl { get; set; }
        public string Status { get; set; }
    }
}