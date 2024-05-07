using IXCheckCommonLib.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCommonLib.Models
{
    public class CustomerUserInfo : ICustomerUserInfo
    {
        public string UserType { get; set; }
        public string UserName { get; set; }
        public string CompanyName { get; set; }
        public string CustomerName { get; set; }
        public string UserTypeId { get; set; }
        public string CustomerUserFullName { get; set; }

        public string CustomerNumber { get; set; }
        public List<string> UserPermissions { get; set; }
    }
}
