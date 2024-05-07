using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
   public  class JsonFile : IJsonFile
    {
        public string FileName { get; set; }
        public string FileSize { get; set; }

        public string LastRecordDateTime { get; set; }
    }
}
