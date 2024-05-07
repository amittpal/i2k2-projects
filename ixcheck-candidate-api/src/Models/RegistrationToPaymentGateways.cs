using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationToPaymentGateways : IRegistrationToPaymentGateways
    {
        public string Id { get; set; }
        public string RegistrationGuid { get; set; }
        public string PaymentGatewayTypeId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string PaymentGatewayEnvironmentId { get; set; }
        public string ProductionGateway { get; set; }
        public string PrimaryGateway { get; set; }
        public string StatusGuid { get; set; }
        public string GatewayNo { get; set; }
    }
}