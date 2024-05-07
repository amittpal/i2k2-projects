using Newtonsoft.Json;
using IXCheckCommonLib.Globals;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IUserPermission
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Name)]
        string Name { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Action)]
        string Action { get; set; }
    }
}
