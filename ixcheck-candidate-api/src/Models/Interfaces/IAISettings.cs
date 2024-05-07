using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IAISettings
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentId)]
        string ComponentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AlgoGuid)]
        string AlgoGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AlgoURL)]
        public string AlgoURL { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ValidationURL)]
        public string ValidationURL { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ColorURL)]
        public string ColorURL { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ColorPercentMin)]
        public string ColorPercentMin { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ColorPercentMax)]
        public string ColorPercentMax { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FacePercentMin)]
        public string FacePercentMin { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FacePercentMax)]
        public string FacePercentMax { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Colors)]
        public List<AIColorSetting> Colors { get; set; }

    }
}