using System;
using System.Collections.Generic;
using System.Text;
using IXCheckCandidateApi.Models.Interfaces;

namespace IXCheckCandidateApi.Models
{
    public class Component : IComponent
    {
        public UInt64 ComponentId { get; set; }
        public string ComponentGuid { get; set; }
        public string ComponentName { get; set; }
        public string ComponentCols { get; set; }
        public string ComponentRows { get; set; }
        public string ComponentX { get; set; }
        public string ComponentY { get; set; }
        public string ComponentStatus { get; set; }
        public Setting Setting { get; set; }
        public Data Data { get; set; }
        public DataObject DataObjects { get; set; }
        public Validation Validations { get; set; }
        public Condition Conditions { get; set; }
        public AISettings AISettings { get; set; }
        public List<RegGridComponentsMain> RegGridComponentsMain { get; set; }
    }
}