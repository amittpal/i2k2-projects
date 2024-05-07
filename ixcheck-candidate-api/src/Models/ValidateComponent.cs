using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class ValidateComponent : IValidateComponent
    {
        public string ComponentName { get; set; }

        public string CandidateGuid { get; set; }
        public string ComponentValue { get; set; }
        public string ExamGuid { get; set; }
    }
}