using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IRegistrationMainLives
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidatesMain)]
        public List<RegistrationMainLive> RegistrationMainLiveList { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegActivityLogList)]
        public List<RegActivityLog> RegActivityLogList { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegGridComponentsMain)]
        public List<RegGridComponent> RegGridComponentList { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegAiLogsMain)]
        public List<RegAiLogsMain> RegAiLogsMain { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaytmRequestDetail)]
        public List<PaytmRequestDetail> PaytmRequestDetail { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PayUMoneyRequestDetail)]
        public List<PayUMoneyRequestDetail> PayUMoneyRequestDetail { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RazorpayRequestDetail)]
        public List<RazorpayRequestDetail> RazorpayRequestDetail { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SBICollectDetail)]
        public List<PaymentSbiCollectDetail> PaymentSbiCollectDetail { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentChallanDetail)]
        public List<PaymentChallanDetail> PaymentChallanDetail { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentChequeDetail)]
        public List<PaymentChequeDetail> PaymentChequeDetail { get; set; }
    }
}