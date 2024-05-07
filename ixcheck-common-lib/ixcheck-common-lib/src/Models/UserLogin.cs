using IXCheckCommonLib.Models.Interfaces;

namespace IXCheckCommonLib.Models
{
    public class UserLogin : IUserLogin
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ExamGuid { get; set; }
        public string AppGuid { get; set; }
    }
}
