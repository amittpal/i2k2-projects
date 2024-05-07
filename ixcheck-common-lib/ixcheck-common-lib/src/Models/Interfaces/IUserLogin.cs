namespace IXCheckCommonLib.Models.Interfaces
{
    public interface IUserLogin
    {
        string UserName { get; set; }
        string Password { get; set; }
        string ExamGuid { get; set; }
        string AppGuid { get; set; }
    }
}
