using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegAiLogsMain : IRegAiLogsMain
    {
        public string Id { get; set; }
        public string RegGuid { get; set; }
        public string EndPoint { get; set; }
        public string AlgoGuid { get; set; }
        public string ImageType { get; set; }
        public string ImageWidth { get; set; }
        public string ImageHeight { get; set; }
        public string LogDate { get; set; }
        public List<RegAiLogsColor> RegAiLogsColor { get; set; }
        public List<RegAiLogsFaces> RegAiLogsFaces { get; set; }
    }
}