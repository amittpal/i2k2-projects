using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IAccessGroups
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Name)]
        string Name { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Action)]
        string Action { get; set; }
    }
}
