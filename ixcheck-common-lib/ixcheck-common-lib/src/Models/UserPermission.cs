using IXCheckCommonLib.Globals;
using IXCheckCommonLib.Models.Interfaces;
using Newtonsoft.Json;

namespace IXCheckCommonLib.Models
{
    public class UserPermission : IUserPermission
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Action)]
        public string Action { get; set; }
    }
}
