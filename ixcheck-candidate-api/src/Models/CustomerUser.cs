using IXCheckCandidateApi.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models
{
    public class CustomerUser : ICustomerUser
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string CandidateGuid { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Title { get; set; }
        public string Mobile { get; set; }
        public string UserTypeId { get; set; }
        public string UserTypeDesc { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string OldPassword { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Status { get; set; }
        public string ParentId { get; set; }
        public string OwnerEntityId { get; set; }
        public string DefaultOrg { get; set; }
        public string AppId { get; set; }
        public string ApplicationGuid { get; set; }
        public string AppUsersToOwnerEntitiesId { get; set; }
        public List<CustomerPermission> PermissionList { get; set; }
        public string UserGuid { get; set; }
    }
}