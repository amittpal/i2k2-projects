using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegAiLogsFaces : IRegAiLogsFaces
    {
        public string Id { get; set; }
        public string RegAiLogId { get; set; }
        public string X { get; set; }
        public string Y { get; set; }
        public string Height { get; set; }
        public string Width { get; set; }
        public string FacePercent { get; set; }
    }
}