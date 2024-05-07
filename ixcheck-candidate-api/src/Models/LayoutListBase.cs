using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class LayoutListBase : ILayoutListBase
    {
        public ConfigMain ConfigMain { get; set; }
        public List<Layout> Layout { get; set; }
        public EmailSetup EmailSetup { get; set; }
        public List<Exams> Exams { get; set; }
        public List<RegistrationFeeSetup> RegistrationFeeSetup { get; set; }
        public List<ExamToRegType> ExamToRegType { get; set; }
        public List<RegistrationMain> RegistrationMain { get; set; }
        public RegEligibilityFunctionsMain RegEligibilityFunctionsMain { get; set; }
        public RegistrationToRegTypeStatus RegistrationToRegTypeStatus { get; set; }
        public CandidateToRegTypeStatus CandidateToRegTypeStatus { get; set; }
        public RegistrationToLayout RegistrationToLayout { get; set; }
        public List<RegistrationFeeType> RegistrationFeeType { get; set; }
        public List<RegistrationsToExam> RegistrationsToExam { get; set; }
        public List<RegType> RegTypes { get; set; }
        public List<RegistrationsToCities> RegistrationsToCities { get; set; }
        public List<PaymentGatewayPaytm> PaymentGatewayPaytm { get; set; }
        public List<RegistrationToPaymentGateways> RegistrationToPaymentGateways { get; set; }
        public List<PaymentGatewayTypes> PaymentGatewayTypes { get; set; }
        public List<RegAiAlgos> RegAiAlgos { get; set; }
        public List<Colors> Colors { get; set; }
        public List<PaymentGatewayPayUMoney> PaymentGatewayPayUMoney { get; set; }
        public List<PaymentGatewayRazorPay> PaymentGatewayRazorpay { get; set; }
    }
}