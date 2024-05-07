using IXCheckCommonLib.Globals;
using Newtonsoft.Json;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IUserDesktop
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Id)]
        string UserID { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.DesktopId)]
        string DesktopID { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.DesktopName)]
        string DesktopName { get; set; }        
    }
}
