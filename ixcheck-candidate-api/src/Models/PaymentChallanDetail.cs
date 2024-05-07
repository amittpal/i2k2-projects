using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PaymentChallanDetail : IPaymentChallanDetail
    {
        public string Id { get ; set ; }
        public string CandidateGuid { get ; set ; }
        public string BankName { get ; set ; }
        public string ChallanNumber { get ; set ; }
        public string ChallanDate { get ; set ; }
        public string ChallanAmount { get ; set ; }
        public string Status { get ; set ; }
    }
}