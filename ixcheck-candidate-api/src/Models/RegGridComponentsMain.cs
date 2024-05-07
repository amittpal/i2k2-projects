using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegGridComponentsMain : IRegGridComponentsMain
    {
        public string Id { get; set; }
        public string RegComponentId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string DisplayName { get; set; }
        public string AppUrl { get; set; }
        public string Height { get; set; }
        public string Width { get; set; }
        public string LabelPosition { get; set; }
        public string Description { get; set; }
        public string Input { get; set; }
        public string Placeholder { get; set; }
        public string DefaultValue { get; set; }
        public string DataParameter { get; set; }
        public string Status { get; set; }
        public string ShowInGrid { get; set; }
        public string Isdisabled { get; set; }
        public string Isoutput { get; set; }
        public string Label { get; set; }
        public string MeasurementType { get; set; }
        public string SettingDataGetEndpoint { get; set; }
        public string SettingDataDeleteEndpoint { get; set; }
        public string Visibility { get; set; }
    }
}