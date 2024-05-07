using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IRegAiLogsMain
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegGuid)]
        public string RegGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.EndPoint)]
        public string EndPoint { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AlgoGuid)]
        public string AlgoGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ImageType)]
        public string ImageType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ImageWidth)]
        public string ImageWidth { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ImageHeight)]
        public string ImageHeight { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LogDate)]
        public string LogDate { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegAiLogsColor)]
        public List<RegAiLogsColor> RegAiLogsColor { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegAiLogsFaces)]
        public List<RegAiLogsFaces> RegAiLogsFaces { get; set; }
    }
}