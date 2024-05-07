using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public  class SyncRegistration  : ISyncRegistration
    {
            public string SyncServerGuid { get; set; }
            public string SyncDate { get; set; }
            public string FirstSync { get; set; }
            public string FileName { get; set; }
            public string RecordCount { get; set; }

    }
}
