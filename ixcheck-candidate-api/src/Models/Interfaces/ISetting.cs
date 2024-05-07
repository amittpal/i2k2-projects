using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ISetting
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingId)]
        public UInt64 SettingId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingMeasurementType)]
        public string SettingMeasurementType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingHeight)]
        public string SettingHeight { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingWidth)]
        public string SettingWidth { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingLabelposition)]
        public string SettingLabelposition { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingType)]
        public string SettingType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingLabel)]
        public string SettingLabel { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingDescription)]
        public string SettingDescription { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingInput)]
        public string SettingInput { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingPlaceholder)]
        public string SettingPlaceholder { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingEndPoint)]
        public string SettingEndPoint { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingDefaultValue)]
        public string SettingDefaultValue { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingStatus)]
        public string SettingStatus { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingDataParameter)]
        public string SettingDataParameter { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingShowInGrid)]
        public string SettingShowInGrid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingDataGetEndpoint)]
        public string SettingDataGetEndpoint { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingDataDeleteEndpoint)]
        public string SettingDataDeleteEndpoint { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingAllowTextUppercase)]
        public string SettingAllowTextUppercase { get; set; }
    }
}
