using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegAiLogsColor : IRegAiLogsColor
    {
        public string Id { get; set; }
        public string RegAiLogId { get; set; }
        public string Color { get; set; }
        public string ColorPercent { get; set; }
        public string ColorPortionImage { get; set; }
    }
}