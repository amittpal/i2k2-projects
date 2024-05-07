using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IXCheckCandidateApi.Models
{
    public class RegGridComponent : IRegGridComponent
    {
        public UInt64 CandidateId { get; set; }
        public string CandidateGuid { get; set; }
        public UInt64 RegComponentId { get; set; }
        public string RowGuid { get; set; }
        public UInt64 GridComponentId { get; set; }
        public string Value { get; set; }
        public string Status { get; set; }
        public UInt64 Id { get; set; }
        public string ImageValue { get; set; }
    }
    public class RegGridComponentValues
    {
        public string CandidateGuid { get; set; }
        public List<RegGridComponent> RegGridComponentValue { get; set; }
    }
}