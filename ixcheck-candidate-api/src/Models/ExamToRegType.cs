using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class ExamToRegType : IExamToRegType
    {
        public string Guid { get; set; }
        public string RegistrationGuid { get; set; }
        public string ExamGuid { get; set; }
        public string RegTypeGuid { get; set; }
    }
}