using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class OfflinePayments : IOfflinePayments
    {
      
        public string Id { get; set; }      
        public string CandidateGuid { get; set; }      
        public string RegistrationGuid { get; set; }       
        public string PaymentGatewayTypeId { get; set; }       
        public string Name { get; set; }     
        public string PaymentAmount { get; set; }       
        public string PaymentDate { get; set; }      
        public string BankName { get; set; }       
        public string ChallanNumber { get; set; }       
        public string ChallanDate { get; set; }       
        public string ChallanAmount { get; set; }       
        public string ModeChequeDD { get; set; }       
        public string ChequeNumber { get; set; }     
        public string ChequeDate { get; set; }     
        public string ChequeAmount { get; set; }     
        public bool Status { get; set; }
    }
}