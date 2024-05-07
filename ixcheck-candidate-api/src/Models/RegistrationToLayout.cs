using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationToLayout : IRegistrationToLayout
    {
        public string Id { get; set; }
        public string ExamId { get; set; }
        public string RegistrationGuid { get; set; }
        public string LayoutId { get; set; }
        public string InitialLayoutId { get; set; }
        public string InitialLayoutJson { get; set; }
        public string LayoutJson { get; set; }
        public bool? Status { get; set; }
    }
}