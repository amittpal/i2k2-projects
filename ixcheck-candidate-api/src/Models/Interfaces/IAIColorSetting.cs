using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IAIColorSetting
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegComponentAiSettingId)]
        public string RegComponentSettingId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ColorGuid)]
        public string ColorGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BlueMin)]
        public string BlueMin { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BlueMax)]
        public string BlueMax { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GreenMin)]
        public string GreenMin { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GreenMax)]
        public string GreenMax { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RedMin)]
        public string RedMin { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RedMax)]
        public string RedMax { get; set; }

    }
}
