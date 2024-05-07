using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
  public  interface IRegActivityLog
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        public string CandidateGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ActivityTypeId)]
        public string ActivityTypeId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LogDescription)]
        public string LogDescription { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.TimeStamp)]
        public string TimeStamp { get; set; }
    }
}
