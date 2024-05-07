using System.Collections.Generic;
namespace IXCheckCommonLib.Models.Interfaces
{
    public interface ICoreUserInfo
    {
        string ApplicationId { get; set; }
        string ApplicationGuId { get; set; }
        string OwnerEntityId { get; set; }
        string OwnerEntitesTypeId { get; set; }
        string OrgID { get; set; }
        string WorkerID { get; set; }
        string ParentID { get; set; }
        string CustomerUserId { get; set; }
        string CustomerID { get; set; }
        string TokenPermissions { get; set; }
        string CustomerType { get; set; }
        string GlobalSH { get; set; }
        string UserID { get; set; }
        string UserGuId { get; set; }
        string UserUniqueId { get; set; }
        string UserName { get; set; }
        string UserType { get; set; }
        string UserTypeId { get; set; }
        string CompanyName { get; set; }
        string CustomerName { get; set; }
        string InstituteID { get; set; }
        string ExamId { get; set; }
        string JTIValue { get; set; }
        string CustomerNumber { get; set; }
        string CustomerUserFullName { get; set; }
        string AssignmentID { get; set; }
        List<IUserPermission> UserPermissions { get; set; }
        List<IUserDesktop> UserDesktops { get; set; }
        List<IUserDesktopPermission> UserDesktopsPermissions { get; set; }
        List<IAccessGroups> AccessGroups { get; set; }
    }
}

