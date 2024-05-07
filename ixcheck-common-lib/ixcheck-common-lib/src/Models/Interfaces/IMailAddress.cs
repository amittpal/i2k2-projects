using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IMailAddress
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Email)]
        string Email { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Name)]
        string Name { get; set; }
    }
}
