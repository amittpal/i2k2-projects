using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Setting : ISetting
    {
        public UInt64 SettingId { get; set; }
        public string SettingMeasurementType { get; set; }
        public string SettingHeight { get; set; }
        public string SettingWidth { get; set; }
        public string SettingLabelposition { get; set; }
        public string SettingType { get; set; }
        public string SettingLabel { get; set; }
        public string SettingDescription { get; set; }
        public string SettingInput { get; set; }
        public string SettingPlaceholder { get; set; }
        public string SettingEndPoint { get; set; }
        public string SettingDefaultValue { get; set; }
        public string SettingStatus { get; set; }
        public string SettingDataParameter { get; set; }
        public string SettingShowInGrid { get; set; }
        public string SettingDataGetEndpoint { get; set; }
        public string SettingDataDeleteEndpoint { get; set; }
        public string SettingAllowTextUppercase { get; set; }
    }
}