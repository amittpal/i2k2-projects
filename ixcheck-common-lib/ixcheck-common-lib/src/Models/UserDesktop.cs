using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models
{
    public class UserDesktop : IUserDesktop
    {
        public string UserID { get; set; }
        public string DesktopID { get; set; }
        public string DesktopName { get; set; }
    }
}
