using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class EmailSetup : IEmailSetup
    {
        public string Id { get; set; }
        public string RegistrationGuid { get; set; }
        public string Smtp { get; set; }
        public string SmtpPort { get; set; }
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public string VerifyEmailId { get; set; }
        public string Password { get; set; }
        public string EmailSubject { get; set; }
        public string AdmitCardAttach { get; set; }
        public string EmailTemplate { get; set; }
        public string ConfigTypeNAme { get; set; }
        public string SenderGridApiKey { get; set; }
        public string AdminServerUrl { get; set; }
        public string TechServerUrl { get; set; }
        public string OtpExpireMinutes { get; set; }
    }
}