using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models
{
    public class UserDesktopPermission : IUserDesktopPermission
    {
        public string UserID { get; set; }
        public string DesktopID { get; set; }
        public string PermissionId { get; set; }
        public string PermissionName { get; set; }
    }
}
