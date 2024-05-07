using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationToRegTypeStatus : IRegistrationToRegTypeStatus
    {
        public string RegistrationGuid { get; set; }
        public string RegTypeGuid { get; set; }
        public string EligibilityFunctionGuid { get; set; }
        public string EligibilityInputJson { get; set; }
    }
}