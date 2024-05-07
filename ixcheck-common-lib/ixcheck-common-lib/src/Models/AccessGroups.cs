using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class AccessGroups: IAccessGroups
    {
        public string Name { get; set; }
        public string Action { get; set; }
    }
}
