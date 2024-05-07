using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models.Interfaces
{
   public interface ICustomerUserInfo
    {
        string UserType { get; set; }
        string UserName { get; set; }
        string CompanyName { get; set; }
        string CustomerName { get; set; }
        string UserTypeId { get; set; }

        string CustomerUserFullName { get; set; }

        string CustomerNumber { get; set; }

        List<string> UserPermissions { get; set; }
    }
}
