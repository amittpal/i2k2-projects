using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Page : IPage
    {
        public UInt64 PageId { get; set; }
        public string PageGuid { get; set; }
        public string PageName { get; set; }
        public string PageDescription { get; set; }
        public string PageStatus { get; set; }
        public List<Section> Sections { get; set; }
    }
}
