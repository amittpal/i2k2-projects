using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PaymentGatewayTypes : IPaymentGatewayTypes
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string InfoTableName { get; set; }
        public string Status { get; set; }
        public string ResponseTableName { get; set; }
        public string RequestTableName { get; set; }
        public bool OnlinePayment { get; set; }
    }
}