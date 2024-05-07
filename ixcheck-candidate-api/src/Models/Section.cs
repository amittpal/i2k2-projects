using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Section : ISection
    {
        public UInt64 SectionId { get; set; }
        public string SectionGuid { get; set; }
        public string SectionName { get; set; }
        public string SectionDescription { get; set; }
        public string SectionStatus { get; set; }
        public string SectionVisibility { get; set; }
        public string SectionCssClass { get; set; }
        public List<Component> Components { get; set; }
    }
}