using IXCheckCandidateApi.Models.Interfaces;
using IxcheckRegApi.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class TemplateList : ITemplateList
    {
        public string CandidateGuid { get; set; }
        public string RegistrationGuid { get; set; }
        public List<TemplateFormValue> TemplateFormValue { get; set; }
    }
}