using System;
using System.Collections.Generic;
using System.Text;
using IXCheckCandidateApi.Models.Interfaces;

namespace IXCheckCandidateApi.Models
{
    public class DataObject : IDataObject
    {
        public UInt64 DataObjectId { get; set; }
        public string DataObjectEndPoint { get; set; }
        public string DataObjectTextField { get; set; }
        public string DataObjectValueField { get; set; }
        public string DataObjectStatus { get; set; }
    }
}
