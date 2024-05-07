using IXCheckCommonLib.Models.Interfaces;
using System.Collections.Generic;

namespace IXCheckCommonLib.Models
{
    public class CoreUserInfo : ICoreUserInfo
    {
        public CoreUserInfo()
        {
            ApplicationId = string.Empty;
            ApplicationGuId = string.Empty;
            OwnerEntityId = string.Empty;
            OwnerEntitesTypeId = string.Empty;
            OrgID = string.Empty;
            WorkerID = string.Empty;
            ParentID = string.Empty;
            CustomerID = string.Empty;
            InstituteID = string.Empty;
            AssignmentID = string.Empty;
            TokenPermissions = "";
            CustomerType = string.Empty;
            GlobalSH = string.Empty;
            UserID = string.Empty;
            UserGuId = string.Empty;
            UserUniqueId = string.Empty;
            UserName = string.Empty;
            UserType = string.Empty;
            UserPermissions = null;
            UserDesktops = null;
            UserDesktopsPermissions = null;
            UserTypeId = string.Empty;
            ParentID = string.Empty;
            ExamId = string.Empty;
            JTIValue = string.Empty;
        }
        public string ApplicationId { get; set; }
        public string ApplicationGuId { get; set; }
        public string OwnerEntityId { get; set; }
        public string OwnerEntitesTypeId { get; set; }
        public string OrgID { get; set; }
        public string WorkerID { get; set; }
        public string ParentID { get; set; }
        public string CustomerID { get; set; }
        public string TokenPermissions { get; set; }
        public string CustomerUserId { get; set; }
        public string CustomerType { get; set; }
        public string GlobalSH { get; set; }
        public string UserID { get; set; }
        public string UserGuId { get; set; }
        public string UserUniqueId { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; }
        public string UserTypeId { get; set; }
        public string CompanyName { get; set; }
        public string CustomerName { get; set; }
        public string InstituteID { get; set; }
        public string ExamId { get; set; }
        public string JTIValue { get; set; }
        public string CustomerUserFullName { get; set; }
        public string CustomerNumber { get; set; }
        public string AssignmentID { get; set; }
        public List<IUserPermission> UserPermissions { get; set; }
        public List<IUserDesktop> UserDesktops { get; set; }
        public List<IUserDesktopPermission> UserDesktopsPermissions { get; set; }
        public List<IAccessGroups> AccessGroups { get; set; }
    }
}
