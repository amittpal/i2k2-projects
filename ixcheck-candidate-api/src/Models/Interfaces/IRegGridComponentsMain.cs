using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface IRegGridComponentsMain
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.RegComponentId)]
        public string RegComponentId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Code)]
        public string Code { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Type)]
        public string Type { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DisplayName)]
        public string DisplayName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AppUrl)]
        public string AppUrl { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Height)]
        public string Height { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Width)]
        public string Width { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LabelPosition)]
        public string LabelPosition { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Description)]
        public string Description { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Input)]
        public string Input { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Placeholder)]
        public string Placeholder { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DefaultValue)]
        public string DefaultValue { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DataParameter)]
        public string DataParameter { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        public string Status { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ShowInGrid)]
        public string ShowInGrid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Isdisabled)]
        public string Isdisabled { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Isoutput)]
        public string Isoutput { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Label)]
        public string Label { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MeasurementType)]
        public string MeasurementType { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingDataGetEndpoint)]
        public string SettingDataGetEndpoint { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.SettingDataDeleteEndpoint)]
        public string SettingDataDeleteEndpoint { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Visibility)]
        public string Visibility { get; set; }
    }
}