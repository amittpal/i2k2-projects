using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IAiImageValidation
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ComponentId)]
        string ComponentId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Image)]
        string Image { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CreateLog)]
        string CreateLog { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FacePercent)]
        string FacePercent { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ColorPercent)]
        decimal ColorPercent { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AlgoGuid)]
        string AlgoGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegGuid)]
        string RegGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ColorGuid)]
        string ColorGuid { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BlueMin)]
        string BlueMin { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.BlueMax)]
        string BlueMax { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GreenMin)]
        string GreenMin { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GreenMax)]
        string GreenMax { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RedMin)]
        string RedMin { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RedMax)]
        string RedMax { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ImageHeight)]
        decimal ImageHeight { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ImageWidth)]
        decimal ImageWidth { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ImageType)]
        string ImageType { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Isdata)]
        int Isdata { get; set; }

    }
}
