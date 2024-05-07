using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class TemplateForm : ITemplateForm
    {
        public Layout Form { get; set; }
    }
}