using System;
using System.Collections.Generic;
using System.Text;
using IXCheckCandidateApi.Models.Interfaces;
using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;

namespace IxcheckRegApi.Models
{
    public class TemplateFormValue : ITemplateFormValue
    {
        public UInt64 LayoutId { get; set; }

        public string LayoutTypeCode { get; set; }
        public string LayoutGuid { get; set; }       
        public UInt64 PageId { get; set; }     
        public string PageGuid { get; set; }    
        public UInt64 SectionId { get; set; }   
        public string SectionGuid { get; set; }     
        public UInt64 ComponentId { get; set; }      
        public string ComponentGuid { get; set; }
        public string ComponentName { get; set; }
        public string DataValue { get; set; }
        public bool DataShowInGrid { get; set; }
    }
}