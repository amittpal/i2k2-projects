using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class CustomerPermission : ICustomerPermission
    {
        public string GroupId { get; set; }
        public string GroupName { get; set; }
        public string GroupDesc { get; set; }
        public string Action { get; set; }
        public string AppId { get; set; }
        public string UserId { get; set; }
        public string AppUsersToOwnerEntitiesId { get; set; }
    }
}