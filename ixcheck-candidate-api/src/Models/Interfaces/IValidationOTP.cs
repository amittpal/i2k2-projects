using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IValidationOTP
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.OTP)]
        public string OTP { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EmailId)]
        public string EmailID { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }
    }
}