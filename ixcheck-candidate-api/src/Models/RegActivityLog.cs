using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegActivityLog : IRegActivityLog
    {
        public string CandidateGuid { get; set; }
        public string ActivityTypeId { get; set; }
        public string LogDescription { get; set; }
        public string TimeStamp { get; set; } 
    }
}