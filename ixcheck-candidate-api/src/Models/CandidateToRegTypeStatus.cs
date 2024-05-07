using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class CandidateToRegTypeStatus : ICandidateToRegTypeStatus
    {
        public string CandidateGuid { get; set; }
        public string RegistrationGuid { get; set; }
        public string RegTypeGuid { get; set; }
        public string EligibilityOutputJson { get; set; }
        public string EligibilityStatus { get; set; }
    }
}