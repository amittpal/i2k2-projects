using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
   public interface IRegistrationMainLive
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateCode)]
        public string CandidateCode { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationGuid)]
        public string RegistrationGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EmailVerified)]
        public string EmailVerified { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentStatusGuid)]
        public string PaymentStatusGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentDate)]
        public string PaymentDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationDate)]
        public string RegistrationDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ModifyDate)]
        public string ModifyDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationStatusGuid)]
        public string RegistrationStatusGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataSave)]
        public List<DataSaveMain> DataSaveMaintList { get; set; }
       
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateToRegTypeStatusList)]
        public List<CandidateToRegTypeStatus> CandidateToRegTypeStatusList { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegGridComponentValues)]
        public List<RegGridComponent> RegGridComponentValues { get; set; }
    }
}