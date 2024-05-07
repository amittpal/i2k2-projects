using IXCheckCandidateApi.Globals;
using IXCheckCommonLib.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ICustomerUser
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Id)]
        string Id { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.UserId)]
        string UserId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CandidateGuid)]
        string CandidateGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.FirstName)]
        string FirstName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.MiddleName)]
        string MiddleName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.LastName)]
        string LastName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Title)]
        string Title { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Mobile)]
        string Mobile { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.UserTypeId)]
        string UserTypeId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.UserTypeDesc)]
        string UserTypeDesc { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CustomerId)]
        string CustomerId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.CustomerName)]
        string CustomerName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.UserName)]
        string UserName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Password)]
        string Password { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ConfirmPassword)]
        string ConfirmPassword { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.OldPassword)]
        string OldPassword { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Email)]
        string Email { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.PhoneNumber)]
        string PhoneNumber { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Status)]
        string Status { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ParentId)]

        string ParentId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.OwnerEntityId)]
        string OwnerEntityId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.DefaultOrg)]
        string DefaultOrg { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AppId)]
        string AppId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.ApplicationGuid)]
        string ApplicationGuid { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AppUsersToOwnerEntitiesId)]
        string AppUsersToOwnerEntitiesId { get; set; }
        [JsonProperty(PropertyName = JsonReturnConstants.PropertyNames.PermissionList)]
        List<CustomerPermission> PermissionList { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.UserGuid)]
        string UserGuid { get; set; }
    }
}