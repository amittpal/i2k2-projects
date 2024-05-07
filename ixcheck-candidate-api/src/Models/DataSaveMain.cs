using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
   public class DataSaveMain : IDataSaveMain
    {
        public string CandidateGuid { get; set; }
        public string FormId { get; set; }
        public string PageId { get; set; }
        public string SectionId { get; set; }
        public string ComponentId { get; set; }
        public string DataValue { get; set; }
        public string ImageValue { get; set; }
        public string Status { get; set; }
        public string ShowinGrid { get; set; }
  


    }
}
