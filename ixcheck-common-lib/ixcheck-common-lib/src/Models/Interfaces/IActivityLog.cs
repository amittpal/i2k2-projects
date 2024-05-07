using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IActivityLog
    {
        string Action { get; set; }
        string IP { get; set; }
        string StudentGuid { get; set; }
    }
}
