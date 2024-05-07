using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class AIColorSetting : IAIColorSetting
    {
        public string Id { get; set; }
        public string RegComponentSettingId { get; set; }
        public string ColorGuid { get; set; }
        public string BlueMin { get; set; }
        public string BlueMax { get; set; }
        public string GreenMin { get; set; }
        public string GreenMax { get; set; }
        public string RedMin { get; set; }
        public string RedMax { get; set; }
    }
}
