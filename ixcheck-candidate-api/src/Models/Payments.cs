using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Payments : IPayments
    {
        public string Id { get; set; }
        public string RegistrationGuid { get; set; }
        public string PaymentGatewayTypeId { get; set; }
        public string PaymentEnvironmentId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string MobileNumber { get; set; }
        public string PaymentAmount { get; set; }
        public string CandidateGuid { get; set; }
        public string CustomerId { get; set; }
        public string OrderId { get; set; }
        public string Mid { get; set; }
        public string MerchantKey { get; set; }
        public string ChannelId { get; set; }
        public string BankName { get; set; }
        public string ReturnUrl { get; set; }
        public string PaymentUrl { get; set; }
        public string PaytmUrl { get; set; }
        public string AppUrl { get; set; }
        public string WebSite { get; set; }
        public string IndustryType { get; set; }
        public string ExamCode { get; set; }
        public string ExamName { get; set; }
        public string ExamType { get; set; }
        public bool Status { get; set; }
    }
}