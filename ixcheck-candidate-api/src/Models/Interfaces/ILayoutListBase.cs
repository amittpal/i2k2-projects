using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ILayoutListBase
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConfigDetails)]
        public ConfigMain ConfigMain { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Layout)]
        public List<Layout> Layout { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EmailSetup)]
        public EmailSetup EmailSetup { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Exams)]
        public List<Exams> Exams { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FeeSetupDetails)]
        public List<RegistrationFeeSetup> RegistrationFeeSetup { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ExamToRegType)]
        public List<ExamToRegType> ExamToRegType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationMain)]
        public List<RegistrationMain> RegistrationMain { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegEligibilityFunctionsMain)]
        public RegEligibilityFunctionsMain RegEligibilityFunctionsMain { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationToRegTypeStatus)]
        public RegistrationToRegTypeStatus RegistrationToRegTypeStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateToRegTypeStatus)]
        public CandidateToRegTypeStatus CandidateToRegTypeStatus { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationToLayout)]
        public RegistrationToLayout RegistrationToLayout { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistationFeeTypes)]
        public List<RegistrationFeeType> RegistrationFeeType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationsToExam)]
        public List<RegistrationsToExam> RegistrationsToExam { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegTypes)]
        public List<RegType> RegTypes { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationToCities)]
        public List<RegistrationsToCities> RegistrationsToCities { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayPaytm)]
        public List<PaymentGatewayPaytm> PaymentGatewayPaytm { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegistrationToPaymentGateways)]
        public List<RegistrationToPaymentGateways> RegistrationToPaymentGateways { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayTypes)]
        public List<PaymentGatewayTypes> PaymentGatewayTypes { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegAiAlgos)]
        public List<RegAiAlgos> RegAiAlgos { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Colors)]
        public List<Colors> Colors { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayPayUMoney)]
        public List<PaymentGatewayPayUMoney> PaymentGatewayPayUMoney { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PaymentGatewayRazorpay)]
        public List<PaymentGatewayRazorPay> PaymentGatewayRazorpay { get; set; }
    }
}