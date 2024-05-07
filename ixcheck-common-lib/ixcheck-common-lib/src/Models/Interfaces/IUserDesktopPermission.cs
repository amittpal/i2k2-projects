using Newtonsoft.Json;
using IXCheckCommonLib.Globals;

namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IUserDesktopPermission
    {
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.Id)]
        string UserID { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.DesktopId)]
        string DesktopID { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.PermissionId)]
        string PermissionId { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.PermissionName)]
        string PermissionName { get; set; }
    }
}
