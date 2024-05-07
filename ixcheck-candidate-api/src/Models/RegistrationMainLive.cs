using IXCheckCandidateApi.Models.Interfaces;
using System.Collections.Generic;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationMainLives : IRegistrationMainLives
    {
        public List<RegistrationMainLive> RegistrationMainLiveList { get; set; }
        public List<RegActivityLog> RegActivityLogList { get; set; }
        public List<RegGridComponent> RegGridComponentList { get; set; }
        public List<RegAiLogsMain> RegAiLogsMain { get; set; }
        public List<PaytmRequestDetail> PaytmRequestDetail { get; set; }
        public List<PayUMoneyRequestDetail> PayUMoneyRequestDetail { get; set; }
        public List<RazorpayRequestDetail> RazorpayRequestDetail { get; set; }
        public List<PaymentSbiCollectDetail> PaymentSbiCollectDetail { get; set; }
        public List<PaymentChallanDetail> PaymentChallanDetail { get; set; }
        public List<PaymentChequeDetail> PaymentChequeDetail { get; set; }
    }
    public class RegistrationMainLive : IRegistrationMainLive
    {
        public string CandidateGuid { get; set; }
        public string CandidateCode { get; set; }
        public string RegistrationGuid { get; set; }
        public string EmailVerified { get; set; }
        public string PaymentStatusGuid { get; set; }
        public string PaymentDate { get; set; }
        public string RegistrationDate { get; set; }
        public string ModifyDate { get; set; }
        public string RegistrationStatusGuid { get; set; }
        public List<DataSaveMain> DataSaveMaintList { get; set; }
        public List<CandidateToRegTypeStatus> CandidateToRegTypeStatusList { get; set; }
        public List<RegGridComponent> RegGridComponentValues { get; set; }
    }
}