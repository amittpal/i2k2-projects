using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class ActivityLog: IActivityLog
    {
        public ActivityLog() { }
        public string Action { get; set; }
        public string IP { get; set; }
        public string StudentGuid { get; set; }
    }
}
