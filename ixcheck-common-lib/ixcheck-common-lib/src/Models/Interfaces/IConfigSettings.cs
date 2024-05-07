using IXCheckCommonLib.Globals;
using Newtonsoft.Json;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IConfigSettings
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Name)]
        string Key { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Action)]
        string Value { get; set; }
    }
}
