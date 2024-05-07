using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class ValidationOTP : IValidationOTP
    {
        public string OTP { get; set; }
        public string EmailID { get; set; }
        public string RegistrationGuid { get; set; }
        public string CandidateGuid { get; set; }
    }
}