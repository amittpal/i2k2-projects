using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class AISettings : IAISettings
    {
        public string Id { get; set; }
        public string ComponentId { get; set; }
        public string AlgoGuid { get; set; }
        public string AlgoURL { get; set; }
        public string ValidationURL { get; set; }
        public string ColorURL { get; set; }
        public string ColorPercentMin { get; set; }
        public string ColorPercentMax { get; set; }
        public string FacePercentMin { get; set; }
        public string FacePercentMax { get; set; }
        public List<AIColorSetting> Colors { get; set; }
    }
}
