using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PaymentSbiCollectDetail : IPaymentSbiCollectDetail
    {
        public string Id { get; set; }
        public string CandidateGuid { get; set; }
        public string Name { get; set; }
        public string PaymentDate { get; set; }
        public string PaymentAmount { get; set; }
        public string Status { get; set; }
    }
}