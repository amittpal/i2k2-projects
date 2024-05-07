using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationFeeSetup : IRegistrationFeeSetup
    {
        public string Id { get; set; }
        public string Level1 { get; set; }
        public string Level2 { get; set; }
        public string Level3 { get; set; }
        public string Amount { get; set; }
        public string Priority { get; set; }
        public bool Status { get; set; }
        public string ExamGuid { get; set; }
        public string RegistrationGuid { get; set; }
        public string RegTypeGuid { get; set; }
    }
}