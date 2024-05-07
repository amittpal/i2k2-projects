using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class Layout : ILayout
    {
        public string LayoutId { get; set; }
        public string LayoutGuid { get; set; }
        public string LayoutName { get; set; }
        public string LayoutDescription { get; set; }
        public string LayoutStatus { get; set; }
        public string LayoutJson { get; set; }
        public string LayoutCode { get; set; }
        public string LayoutExamType { get; set; }
        public string LayoutExamTypeGuid { get; set; }
        public string LayoutPageName { get; set; }
        public string LayoutNumber { get; set; }
        public List<Page> Pages { get; set; }
        public string LayoutType { get; set; }
        public string LayoutTypeGuid { get; set; }
    }
}