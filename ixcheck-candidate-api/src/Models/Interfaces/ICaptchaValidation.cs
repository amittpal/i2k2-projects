using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using IXCheckCandidateApi.Globals;

namespace IXCheckCandidateApi.Models.Interfaces
{
   public interface ICaptchaValidation
    {
        [JsonProperty(PropertyName =ApplicationJsonReturnConstants.PropertyNames.CaptchaId)]
         public string CaptchaId { get; set; }
        [JsonProperty(PropertyName =ApplicationJsonReturnConstants.PropertyNames.CaptchaCode)]
        public string CaptchaCode { get; set; }
    }
}