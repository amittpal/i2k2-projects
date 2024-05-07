using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationsToExam : IRegistrationsToExam
    {
        public string RegistrationGuid { get; set; }
        public string ExamGuid { get; set; }
    }
}