using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class RegistrationMain : IRegistrationMain
    {
        public string Id { get; set; }
        public string Guid { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string RegListGuid { get; set; }
        public bool Status { get; set; }
        public string PlanStatusGuid { get; set; }
    }
}