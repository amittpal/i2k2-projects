using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationData : IRegistrationData
    {
        public string Id { get; set; }
        public string RegistrationGuid { get; set; }
        public string RegCode { get; set; }
        public string CandidateGuid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FatherName { get; set; }
        public string Dob { get; set; }
        public string MobileNumber { get; set; }
        public string EmailId { get; set; }
        public string Photo { get; set; }
        public string Signature { get; set; }
        public string GenderGuid { get; set; }
        public string Gender { get; set; }
        public string CategoryGuid { get; set; }
        public string Category { get; set; }
        public string Ph { get; set; }
        public string SC { get; set; }
        public string ST { get; set; }
        public string OBC { get; set; }
        public string General { get; set; }
        public string Pc1Guid { get; set; }
        public string PC1 { get; set; }
        public string Pc2Guid { get; set; }
        public string PC2 { get; set; }
        public string Pc3Guid { get; set; }
        public string PC3 { get; set; }
        public string AdmitCardId { get; set; }
    }
}