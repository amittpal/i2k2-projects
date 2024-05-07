using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class PaymentChequeDetail : IPaymentChequeDetail
    {
        public string Id { get; set; }
        public string CandidateGuid { get; set; }
        public string ModeChequeDD { get; set; }
        public string BankName { get; set; }
        public string ChequeNumber { get; set; }
        public string ChequeDate { get; set; }
        public string ChequeAmount { get; set; }
        public string Status { get; set; }
    }
}