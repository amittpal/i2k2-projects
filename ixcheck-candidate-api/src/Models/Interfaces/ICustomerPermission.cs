using IXCheckCandidateApi.Globals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IXCheckCandidateApi.Models.Interfaces
{
    public interface ICustomerPermission
    {
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GroupId)]
        string GroupId { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GroupName)]
        string GroupName { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.GroupDesc)]
        string GroupDesc { get; set; }
        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.Action)]
        string Action { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AppId)]
        string AppId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.UserId)]
        string UserId { get; set; }

        [JsonProperty(PropertyName = ApplicationJsonReturnConstants.PropertyNames.AppUsersToOwnerEntitiesId)]
        string AppUsersToOwnerEntitiesId { get; set; }
    }
}